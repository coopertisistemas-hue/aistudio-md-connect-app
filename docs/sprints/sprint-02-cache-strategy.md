# Estratégia de Cache - Sprint 02

> Data: 2026-02-07  
> Escopo: Leitura de Bíblia e Devocionais  
> Prioridade: Alta (Performance & Offline Support)

---

## 1. Visão Geral

Esta estratégia de cache visa melhorar significativamente a performance de leitura e permitir uso offline parcial para conteúdo de Bíblia e Devocionais. O objetivo é reduzir latência, economizar dados móveis e garantir experiência contínua mesmo com conectividade instável.

### Contexto Atual
- **Bíblia**: API externa (bible-api.com) + Supabase para comentários
- **Devocionais**: Supabase Edge Functions (`devotionals-get`)
- **Storage atual**: Apenas progresso de leitura em localStorage
- **Offline**: Nenhum suporte atual

---

## 2. O que Cachear

### 2.1 Tier 1 - Cache Crítico (Offline-first)

#### A. Texto Bíblico (Capítulos)
```typescript
interface CachedChapter {
  bookId: string;
  chapter: number;
  translation: string;
  verses: BibleVerse[];
  text: string;
  cachedAt: number;
  version: number; // Para invalidação
}
```
- **O que**: Capítulos completos da Bíblia
- **Quando**: Ao primeiro acesso ou navegação
- **Quantidade**: Até 100 capítulos recentes (~5-10 MB)
- **Fonte**: `bible-api.com` (via `bibleService.getChapter()`)

#### B. Devocional do Dia
```typescript
interface CachedDevotional {
  id: string;
  post: Post;
  date: string; // YYYY-MM-DD
  cachedAt: number;
  expiresAt: number;
}
```
- **O que**: Devocional diário atual
- **Quando**: Primeiro carregamento do dia
- **TTL**: 24 horas (atualiza às 00:01)
- **Fonte**: `devotionalsApi.getLatest()`

#### C. Metadados da Bíblia
```typescript
interface CachedBibleMetadata {
  books: BibleBookData[];
  categories: BibleCategory[];
  contextData: Record<string, BookContext>;
  cachedAt: number;
  version: string;
}
```
- **O que**: Lista de livros, categorias, contextos históricos
- **Quando**: Inicialização do app
- **TTL**: 7 dias
- **Tamanho**: ~100 KB
- **Fonte**: `public-bible-books` Edge Function

### 2.2 Tier 2 - Cache de Performance

#### A. Comentários de Versículos
```typescript
interface CachedCommentary {
  bookId: string;
  chapter: number;
  verse: number;
  commentary: BibleCommentary;
  cachedAt: number;
}
```
- **O que**: Explicações/exegese de versículos específicos
- **Quando**: Ao clicar "Explicar" em um versículo
- **TTL**: 30 dias
- **Tamanho estimado**: ~5 KB por versículo
- **Limite**: 200 comentários recentes

#### B. Devocionais Recentes
- **O que**: Lista dos últimos 30 devocionais
- **Quando**: Ao acessar lista de devocionais
- **TTL**: 12 horas
- **Fonte**: `devotionalsApi.getList()`

#### C. Passagens Bíblicas Favoritas
- **O que**: Versículos marcados como favoritos
- **Quando**: Ao favoritar
- **Persistência**: Permanente até desfavoritar
- **Fonte**: Local + sync com Supabase quando online

### 2.3 Tier 3 - Cache Opcional

#### A. Imagens de Capa
- **O que**: URLs de imagens de devocionais (não as imagens em si)
- **Onde**: IndexedDB + Cache API para blobs
- **TTL**: 7 dias
- **Estratégia**: Lazy loading com cache

#### B. Contexto de Livros (AI-Generated)
- **O que**: Contexto histórico gerado por IA
- **Quando**: Ao acessar pela primeira vez
- **TTL**: 30 dias (raramente muda)

---

## 3. Onde Cachear (Storage Strategy)

### 3.1 Arquitetura de Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                    NÍVEL 1: MEMÓRIA                         │
│  React Query / SWR Cache (sessão atual)                     │
│  - Dados em uso                                             │
│  - Invalidação automática em navegação                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    NÍVEL 2: INDEXEDDB                       │
│  Estrutura principal de cache                               │
│  - Capítulos bíblicos                                       │
│  - Devocionais                                              │
│  - Comentários                                              │
│  - Metadados                                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    NÍVEL 3: LOCALSTORAGE                    │
│  Dados pequenos e críticos                                  │
│  - Progresso de leitura                                     │
│  - Configurações                                            │
│  - IDs de cache recente                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    NÍVEL 4: CACHE API                       │
│  Service Worker (PWA)                                       │
│  - Assets estáticos                                         │
│  - Imagens de capa                                          │
│  - Fontes                                                   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Implementação IndexedDB

#### Estrutura do Banco
```typescript
// Nome do banco: md-content-cache
// Versão: 1

interface ContentCacheDB {
  // Store: bible_chapters
  bible_chapters: {
    key: string; // `${bookId}:${chapter}:${translation}`
    value: CachedChapter;
    indexes: {
      byBook: string;      // bookId
      byDate: number;      // cachedAt
    }
  };
  
  // Store: devotionals
  devotionals: {
    key: string; // devotional id ou 'latest:${date}'
    value: CachedDevotional;
    indexes: {
      byDate: string;      // YYYY-MM-DD
      byCachedAt: number;  // cachedAt
    }
  };
  
  // Store: commentaries
  commentaries: {
    key: string; // `${bookId}:${chapter}:${verse}`
    value: CachedCommentary;
    indexes: {
      byBookChapter: string; // `${bookId}:${chapter}`
      byDate: number;
    }
  };
  
  // Store: metadata
  metadata: {
    key: string; // 'bible-books', 'categories', etc.
    value: CachedBibleMetadata;
  };
}
```

#### Configuração de Limites
| Store | Limite Máximo | Estratégia de Expurgo |
|-------|---------------|----------------------|
| `bible_chapters` | 100 registros | LRU (Least Recently Used) |
| `devotionals` | 50 registros | Por data (mais antigos primeiro) |
| `commentaries` | 200 registros | LRU |
| `metadata` | 10 registros | Por versão |

### 3.3 localStorage (Configurações & Estado)

Mantém uso atual mas adiciona:
```typescript
// Novas chaves
const CACHE_CONFIG = {
  CACHE_VERSION: 'md:cache:v1',
  LAST_SYNC: 'md:last-sync',
  OFFLINE_MODE: 'md:offline-mode',
  PENDING_UPDATES: 'md:pending-updates', // Queue de ações offline
};
```

---

## 4. TTL e Invalidação

### 4.1 Políticas de Expiração

| Tipo de Dado | TTL Padrão | Gatilho de Invalidação |
|--------------|------------|------------------------|
| **Capítulo Bíblico** | 30 dias | Nunca expira (imutável) |
| **Devocional do Dia** | 24 horas | 00:01 ou manual |
| **Lista Devocionais** | 12 horas | Novo post publicado |
| **Comentários** | 30 dias | Versão do modelo IA |
| **Metadados Bíblia** | 7 dias | Nova versão do app |
| **Contexto Livro** | 30 dias | Raramente |

### 4.2 Estratégias de Invalidação

#### A. Time-based (Automática)
```typescript
function isExpired(cachedAt: number, ttlHours: number): boolean {
  const ttlMs = ttlHours * 60 * 60 * 1000;
  return Date.now() - cachedAt > ttlMs;
}

// Exemplo: Verificar devocional do dia
const cached = await db.devotionals.get('latest:today');
if (!cached || isExpired(cached.cachedAt, 24)) {
  // Fetch fresh
}
```

#### B. Version-based (Controle de Mudanças)
```typescript
interface CacheVersion {
  bibleTranslation: string; // 'almeida', 'nvi', etc.
  commentaryModel: string;  // Versão do modelo AI
  appVersion: string;       // Versão do app
}

// On app update, verificar se versão mudou
const currentVersion = await db.metadata.get('version');
if (currentVersion?.appVersion !== APP_VERSION) {
  await clearAllCaches();
}
```

#### C. Manual (User-triggered)
```typescript
// Botão "Atualizar" no header
async function forceRefreshDevotional() {
  await db.devotionals.delete('latest:today');
  return fetchLatestDevotional();
}

// Pull-to-refresh
<RefreshControl onRefresh={forceRefreshDevotional} />
```

#### D. Event-based (Background Sync)
```typescript
// Quando app volta ao foreground
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    checkForUpdates(); // Verifica novos devocionais
  }
});
```

### 4.3 Limpeza Automática (Garbage Collection)

```typescript
async function cleanupOldCaches() {
  const db = await openDB('md-content-cache', 1);
  
  // Limpar capítulos antigos (LRU)
  const oldChapters = await db.getAllFromIndex('bible_chapters', 'byDate');
  if (oldChapters.length > 100) {
    const toDelete = oldChapters.slice(0, oldChapters.length - 100);
    for (const chapter of toDelete) {
      await db.delete('bible_chapters', chapter.key);
    }
  }
  
  // Limpar devocionais antigos
  const allDevotionals = await db.getAll('devotionals');
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  for (const dev of allDevotionals) {
    if (dev.cachedAt < thirtyDaysAgo) {
      await db.delete('devotionals', dev.key);
    }
  }
}

// Executar a cada 7 dias
if (shouldRunCleanup()) {
  cleanupOldCaches();
}
```

---

## 5. Comportamento Offline

### 5.1 Estados de Conectividade

```typescript
type ConnectivityStatus = 'online' | 'offline' | 'slow-connection';

interface NetworkState {
  status: ConnectivityStatus;
  effectiveType: '4g' | '3g' | '2g' | 'offline';
  saveData: boolean;
}
```

### 5.2 Fluxo de Requisição (Cache-First Strategy)

```typescript
async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions
): Promise<T> {
  // 1. Tentar cache primeiro
  const cached = await cacheManager.get<T>(key);
  
  if (cached) {
    // Se online, revalidar em background (stale-while-revalidate)
    if (navigator.onLine && shouldRevalidate(cached)) {
      revalidateInBackground(key, fetcher);
    }
    return cached.data;
  }
  
  // 2. Sem cache - verificar conectividade
  if (!navigator.onLine) {
    throw new OfflineError('Conteúdo não disponível offline');
  }
  
  // 3. Fetch da rede
  try {
    const data = await fetcher();
    await cacheManager.set(key, data, options.ttl);
    return data;
  } catch (error) {
    throw new NetworkError('Falha ao carregar conteúdo');
  }
}
```

### 5.3 Cenários Offline

#### Cenário 1: Capítulo Bíblico Já Visitado
```
Usuário: Acessa Gênesis 1
Estado: Offline
Comportamento:
  ✓ Carrega imediatamente do IndexedDB
  ✓ Mantém funcionalidade completa (leitura, navegação)
  ✓ Mostra badge "Modo Offline"
  ✓ Salva progresso localmente
```

#### Cenário 2: Capítulo Nunca Visitado
```
Usuário: Tenta acessar Salmos 23
Estado: Offline
Comportamento:
  ✗ Mostra tela "Conteúdo não disponível offline"
  ✓ Sugere últimos capítulos lidos (do cache)
  ✓ Botão "Ler quando online" (background sync)
```

#### Cenário 3: Devocional do Dia
```
Usuário: Acessa devocional
Estado: Offline
Comportamento:
  ✓ Se já carregado hoje: exibe do cache
  ✓ Se não carregado: mostra devocional anterior do cache
  ✓ Badge "Devocional de [data]" (se antigo)
  ✓ Botão "Verificar atualização" (quando voltar online)
```

#### Cenário 4: Comentário de Versículo
```
Usuário: Clica "Explicar" em João 3:16
Estado: Offline
Comportamento:
  ✓ Se comentário em cache: exibe normalmente
  ✓ Se não em cache: mostra explicação local (fallback)
  ✓ Adiciona à fila de sincronização
```

### 5.4 UI/UX em Modo Offline

#### Indicadores Visuais
```tsx
// Componente de status
<OfflineIndicator 
  showWhen="offline" // ou "cache-used"
  message="Modo Offline - Conteúdo pode estar desatualizado"
/>

// Badge em cards
<ContentCard 
  title="Gênesis 1"
  badge={isOfflineContent ? { type: 'cached', date: cachedAt } : null}
/>
```

#### Telas de Fallback
```tsx
// Tela quando conteúdo não está em cache
<OfflinePlaceholder
  icon={<BookX />}
  title="Conteúdo não disponível offline"
  description="Você ainda não leu este capítulo. Conecte-se à internet para acessá-lo."
  actions={[
    { label: 'Ver últimos lidos', to: '/biblia/historico' },
    { label: 'Tentar novamente', onClick: retry }
  ]}
/>
```

### 5.5 Sincronização em Background

#### Queue de Ações Offline
```typescript
interface PendingAction {
  id: string;
  type: 'favorite' | 'commentary-request' | 'progress-update';
  payload: unknown;
  timestamp: number;
  retries: number;
}

// Salvar ação offline
async function queueAction(action: Omit<PendingAction, 'id'>) {
  const queue = JSON.parse(localStorage.getItem('md:pending-actions') || '[]');
  queue.push({ ...action, id: crypto.randomUUID() });
  localStorage.setItem('md:pending-actions', JSON.stringify(queue));
}

// Sincronizar quando voltar online
window.addEventListener('online', async () => {
  const queue = JSON.parse(localStorage.getItem('md:pending-actions') || '[]');
  for (const action of queue) {
    try {
      await processAction(action);
      // Remove da queue
    } catch (error) {
      // Incrementa retry ou mantém na queue
    }
  }
});
```

---

## 6. Implementação Passo-a-Passo

### Fase 1: Cache Básico (Semana 1)
1. **Setup IndexedDB** com `idb` library
2. **Cache de Capítulos Bíblicos** - LRU simples
3. **Cache de Devocional do Dia** - TTL 24h
4. **Detecção de Offline** básica

### Fase 2: Otimização (Semana 2)
1. **Cache de Comentários**
2. **Background Sync** para favoritos
3. **Garbage Collection** automático
4. **Version-based invalidation**

### Fase 3: PWA & Service Worker (Semana 3)
1. **Workbox integration** para assets estáticos
2. **Precache** de rotas críticas
3. **Background Fetch** para devocional diário
4. **Push notifications** (opcional)

---

## 7. Métricas de Sucesso

| Métrica | Baseline | Meta | Como Medir |
|---------|----------|------|------------|
| **Tempo de carregamento** capítulo | 800ms | <200ms (cache hit) | Performance API |
| **Taxa de cache hit** | 0% | >70% | Analytics |
| **Uso offline** | 0% | Capacidade de leitura | User surveys |
| **Consumo de dados** | -50% | -80% para usuários recorrentes | Network tab |
| **Tamanho do cache** | 0 | <50 MB | DevTools |

---

## 8. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Cache desatado | Médio | TTL adequado + indicadores visuais |
| Storage quota exceeded | Alto | GC agressivo + limite de 50 MB |
| Cache poisoning | Baixo | Validação de schema antes de usar |
| Performance do IndexedDB | Médio | Operações async + índices otimizados |
| Privacidade (cache de devocional) | Baixo | Separação por usuário (quando logado) |

---

## 9. Código de Exemplo

### Cache Manager
```typescript
// lib/cache/contentCache.ts
import { openDB, DBSchema } from 'idb';

export class ContentCache {
  private db: IDBPDatabase<ContentCacheDB> | null = null;
  
  async init() {
    this.db = await openDB<ContentCacheDB>('md-content-cache', 1, {
      upgrade(db) {
        // bible_chapters store
        const chapterStore = db.createObjectStore('bible_chapters', { 
          keyPath: 'key' 
        });
        chapterStore.createIndex('byBook', 'bookId');
        chapterStore.createIndex('byDate', 'cachedAt');
        
        // devotionals store
        const devStore = db.createObjectStore('devotionals', { 
          keyPath: 'key' 
        });
        devStore.createIndex('byDate', 'date');
        
        // commentaries store
        const commStore = db.createObjectStore('commentaries', { 
          keyPath: 'key' 
        });
        commStore.createIndex('byBookChapter', 'bookChapter');
      }
    });
  }
  
  async getChapter(bookId: string, chapter: number, translation = 'almeida') {
    const key = `${bookId}:${chapter}:${translation}`;
    return this.db?.get('bible_chapters', key);
  }
  
  async setChapter(data: CachedChapter) {
    await this.db?.put('bible_chapters', {
      ...data,
      cachedAt: Date.now()
    });
    await this.cleanupIfNeeded();
  }
  
  private async cleanupIfNeeded() {
    const count = await this.db?.count('bible_chapters');
    if (count && count > 100) {
      // Remove os 20 mais antigos
      const old = await this.db?.getAllFromIndex('bible_chapters', 'byDate', null, 20);
      for (const item of old || []) {
        await this.db?.delete('bible_chapters', item.key);
      }
    }
  }
}

export const contentCache = new ContentCache();
```

### Hook com Cache
```typescript
// hooks/useCachedBibleChapter.ts
export function useCachedBibleChapter(bookId: string, chapter: number) {
  const [data, setData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      
      // 1. Tentar cache
      const cached = await contentCache.getChapter(bookId, chapter);
      if (cached) {
        setData(cached);
        setFromCache(true);
        setLoading(false);
        
        // Revalidar em background se necessário
        if (shouldRevalidate(cached)) {
          bibleService.getChapter(bookId, chapter)
            .then(fresh => fresh && contentCache.setChapter(fresh));
        }
        return;
      }
      
      // 2. Fetch da API
      try {
        const fresh = await bibleService.getChapter(bookId, chapter);
        if (fresh) {
          setData(fresh);
          await contentCache.setChapter(fresh);
        }
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [bookId, chapter]);
  
  return { data, loading, fromCache };
}
```

---

*Documento criado para Sprint 02 - Implementação de Cache de Conteúdo*
