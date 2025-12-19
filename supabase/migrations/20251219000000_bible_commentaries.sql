-- Create bible_commentaries table for theological context
create table if not exists bible_commentaries (
  id uuid default gen_random_uuid() primary key,
  book_id text not null, -- Normalized slug, e.g. 'gn' or 'genesis'
  chapter integer not null,
  verse integer, -- Nullable for chapter-level commentary
  verse_end integer, -- For range support
  
  -- Content Fields
  historical_context text, -- Contexto Histórico
  theological_insights text[], -- Visão Teológica (Array of strings)
  practical_application text[], -- Aplicação Prática (Array of strings)
  themes text[], -- Temas Centrais
  
  -- Metadata
  author_ref text default 'MD Connect Theology Team', -- Referência do Autor/Fonte
  cross_references jsonb, -- e.g. [{"ref": "Jo 3:16", "note": "See also..."}]
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table bible_commentaries enable row level security;

-- Public read access
create policy "Public commentaries are viewable by everyone"
  on bible_commentaries for select
  using (true);

-- Admin write access (simplified for now, authenticated users can't write)
create policy "Only service role can insert commentaries"
  on bible_commentaries for insert
  with check (auth.role() = 'service_role');

-- Create index for fast lookups
create index idx_bible_commentaries_lookup 
  on bible_commentaries(book_id, chapter, verse);

-- SEED DATA (Genesis 2:21)
insert into bible_commentaries (book_id, chapter, verse, historical_context, theological_insights, practical_application, themes, author_ref)
values 
(
  'gn', 2, 21,
  'Neste relato da criação da mulher, vemos Deus agindo como o primeiro cirurgião. O termo "sono profundo" (tardemah) indica um estado divinamente induzido, onde o homem é passivo enquanto Deus realiza Sua obra criativa sovereigna.',
  ARRAY[
    'A criação da mulher não é independente, mas derivada, indicando unidade essencial entre homem e mulher.',
    'A costela simboliza paridade: não da cabeça para governar, nem dos pés para ser pisada, mas do lado para ser igual e próxima ao coração.',
    'Prefiguração de Cristo e a Igreja (o "segundo Adão" que teve seu lado ferido para o nascimento de Sua noiva).'
  ],
  ARRAY[
    'Deus provê nossas necessidades relacionais muitas vezes enquanto "dormimos", ou seja, sem nosso esforço direto, para que a glória seja dEle.',
    'O casamento é a restauração de uma unidade quebrada; marido e mulher são da mesma essência e devem cuidar um do outro como a si mesmos.'
  ],
  ARRAY['Criação', 'Casamento', 'Soberania Divina', 'Unidade'],
  'Matthew Henry / C.S. Lewis (Synthesis)'
);
