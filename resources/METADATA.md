# Capacitor App Metadata

> Arquivo: `resources/METADATA.md`  
> Status: Placeholders Configurados  
> Última Atualização: 2026-02-08

---

## App Identification

### Core Metadata

| Propriedade | Valor | Descrição |
|-------------|-------|-----------|
| **App ID** | `com.mdconnect.app` | Reverse domain notation único |
| **App Name** | `MD Connect` | Nome exibido no launcher |
| **Short Name** | `MD Connect` | Nome curto (limitado em espaço) |
| **Version** | `1.0.0` | Versão inicial |
| **Build Number** | `1` | Número do build incrementável |
| **Description** | Momento Devocional - Palavra, Comunidade e Apoio | Descrição curta |

### Localização dos Arquivos

```
configuração/
├── capacitor.config.ts          # Configuração principal
├── android/
│   └── app/src/main/
│       ├── AndroidManifest.xml  # Manifest Android
│       └── res/values/
│           └── strings.xml      # Strings localizadas
└── resources/                   # Assets (ícones, splash)
    ├── icon.png                 # Ícone fonte (1024x1024)
    ├── splash.png               # Splash fonte (2732x2732)
    └── METADATA.md             # Este arquivo
```

---

## Icon Specifications

### Android Icons

| Tamanho | Densidade | Arquivo | Uso |
|---------|-----------|---------|-----|
| 48x48 | mdpi | `mipmap-mdpi/ic_launcher.png` | Ícone base |
| 72x72 | hdpi | `mipmap-hdpi/ic_launcher.png` | Alta densidade |
| 96x96 | xhdpi | `mipmap-xhdpi/ic_launcher.png` | Extra alta |
| 144x144 | xxhdpi | `mipmap-xxhdpi/ic_launcher.png` | XX alta |
| 192x192 | xxxhdpi | `mipmap-xxxhdpi/ic_launcher.png` | XXX alta |

### Icon Adaptativo (Android 8.0+)

- **Foreground**: `mipmap-*/ic_launcher_foreground.png`
- **Background**: Cor sólida definida em `ic_launcher.xml`
- **Safe Zone**: 66dp centro (icone não pode ultrapassar)

### Placeholder Status

⚠️ **ATENÇÃO**: Os arquivos atuais são placeholders padrão do Capacitor.

**Para substituir:**
1. Gerar ícone fonte: `resources/icon.png` (1024x1024)
2. Gerar splash fonte: `resources/splash.png` (2732x2732)
3. Executar: `npx cordova-res android --skip-config --copy`

---

## Splash Screen Specifications

### Android Splash Screens

| Orientação | Tamanho | Densidade | Arquivo |
|------------|---------|-----------|---------|
| Portrait | 320x480 | mdpi | `drawable-port-mdpi/splash.png` |
| Portrait | 480x800 | hdpi | `drawable-port-hdpi/splash.png` |
| Portrait | 720x1280 | xhdpi | `drawable-port-xhdpi/splash.png` |
| Portrait | 960x1600 | xxhdpi | `drawable-port-xxhdpi/splash.png` |
| Portrait | 1280x1920 | xxxhdpi | `drawable-port-xxxhdpi/splash.png` |
| Landscape | 480x320 | mdpi | `drawable-land-mdpi/splash.png` |
| Landscape | 800x480 | hdpi | `drawable-land-hdpi/splash.png` |
| Landscape | 1280x720 | xhdpi | `drawable-land-xhdpi/splash.png` |
| Landscape | 1600x960 | xxhdpi | `drawable-land-xxhdpi/splash.png` |
| Landscape | 1920x1280 | xxxhdpi | `drawable-land-xxxhdpi/splash.png` |

### Configuração Atual

```typescript
// capacitor.config.ts
SplashScreen: {
  launchShowDuration: 2000,      // 2 segundos
  launchAutoHide: true,          // Auto-ocultar
  backgroundColor: '#1e3a8a',   // IPDA Blue
  androidSplashResourceName: 'splash',
  androidScaleType: 'CENTER_CROP',
  showSpinner: false,
  splashFullScreen: true,
  splashImmersive: true,
}
```

### Design Guidelines

- **Background**: `#1e3a8a` (azul IPDA)
- **Logo**: Centralizado, 40% da tela
- **Safe Zone**: Evitar elementos nas bordas (notch/status bar)
- **Formato**: PNG com transparência ou cor sólida

---

## Status Bar Configuration

### Android Status Bar

```typescript
// capacitor.config.ts
StatusBar: {
  style: 'DARK',                 // Ícones escuros (para fundo claro)
  backgroundColor: '#1e3a8a',   // Cor de fundo
}
```

### Comportamento

- Cor: `#1e3a8a` (azul IPDA)
- Estilo: DARK (texto branco)
- Aplica-se a: Todas as telas

---

## Deep Links (URL Scheme)

### Configuração

```xml
<!-- AndroidManifest.xml -->
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="com.mdconnect.app" />
</intent-filter>
```

### Exemplos de Uso

```
com.mdconnect.app://devocionais/today
com.mdconnect.app://biblia/genesis/1
com.mdconnect.app://prayer
```

---

## Permissões Android

### Permissões Atuais

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
```

### Permissões Planejadas (Fase 2)

```xml
<!-- Push Notifications -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Camera (para upload de fotos) -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

<!-- Network State -->
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

---

## Versioning Strategy

### Schema de Versionamento

Formato: `MAJOR.MINOR.PATCH`

| Tipo | Quando Incrementar | Exemplo |
|------|-------------------|---------|
| **MAJOR** | Mudanças breaking, nova arquitetura | 1.0.0 → 2.0.0 |
| **MINOR** | Novas features, funcionalidades | 1.0.0 → 1.1.0 |
| **PATCH** | Bug fixes, hotfixes | 1.0.0 → 1.0.1 |

### Atualização de Versão

1. **Versão Web** (package.json)
   ```json
   "version": "1.0.1"
   ```

2. **Versão Android** (android/app/build.gradle)
   ```gradle
   versionName "1.0.1"
   versionCode 2
   ```

3. **Build Number** deve incrementar sempre

---

## Checklist de Assets

### Ícones

- [ ] `resources/icon.png` (1024x1024) - Ícone fonte
- [ ] Ícone tem fundo transparente ou cor sólida
- [ ] Ícone segue guidelines Android adaptativo
- [ ] Testado em diferentes densidades

### Splash Screen

- [ ] `resources/splash.png` (2732x2732) - Splash fonte
- [ ] Background: `#1e3a8a`
- [ ] Logo centralizado (40% da área)
- [ ] Safe zone respeitada
- [ ] Testado em portrait e landscape

### Outros

- [ ] Feature graphic (Google Play) - 1024x500
- [ ] Screenshots (Google Play) - 5 telas
- [ ] Promo video (opcional)

---

## Notas de Implementação

### Gerar Assets Automáticamente

```bash
# Instalar cordova-res globalmente
npm install -g cordova-res

# Gerar todos os assets
npx cordova-res android --skip-config --copy

# Ou especificar fontes diferentes
npx cordova-res android --icon-source resources/icon.png --splash-source resources/splash.png
```

### Validação de Assets

```bash
# Verificar se todos os arquivos existem
ls -la android/app/src/main/res/mipmap-*/
ls -la android/app/src/main/res/drawable-*/

# Validar tamanhos
file android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

### Troubleshooting

**Problema**: Ícone não aparece corretamente  
**Solução**: Verificar se `ic_launcher_foreground.png` existe em todas as densidades

**Problema**: Splash screen cortada  
**Solução**: Usar `CENTER_CROP` e garantir safe zone de 10%

**Problema**: Status bar com cor errada  
**Solução**: Verificar configuração em capacitor.config.ts e AndroidManifest.xml

---

## Referências

- [Capacitor Splash Screen Plugin](https://capacitorjs.com/docs/apis/splash-screen)
- [Android Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [Material Design Icons](https://material.io/design/iconography/)
- [Google Play Assets](https://developer.android.com/distribute/best-practices/launch/launch-checklist)

---

*Documento de especificação de metadados e assets*
