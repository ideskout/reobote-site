-- Reobote — cole este arquivo no SQL Editor do Supabase e execute.
-- Depois crie um usuário em Authentication > Users para acessar /admin.

create extension if not exists pgcrypto;

create table if not exists public.imoveis (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  cidade text not null,
  preco numeric(14, 2) not null check (preco >= 0),
  categoria text not null check (categoria in ('casa', 'apartamento', 'comercial', 'terreno')),
  tipo text not null check (tipo in ('venda', 'locacao')),
  quartos integer not null default 0 check (quartos >= 0),
  area numeric(12, 2) not null check (area >= 0),
  descricao text not null default '',
  foto_url text,
  created_at timestamptz not null default now()
);

create index if not exists imoveis_cidade_idx on public.imoveis (cidade);
create index if not exists imoveis_tipo_idx on public.imoveis (tipo);
create index if not exists imoveis_categoria_idx on public.imoveis (categoria);
create index if not exists imoveis_created_at_idx on public.imoveis (created_at desc);

alter table public.imoveis enable row level security;

drop policy if exists "imoveis_leitura_publica" on public.imoveis;
drop policy if exists "imoveis_insercao_autenticada" on public.imoveis;
drop policy if exists "imoveis_atualizacao_autenticada" on public.imoveis;
drop policy if exists "imoveis_exclusao_autenticada" on public.imoveis;

create policy "imoveis_leitura_publica"
on public.imoveis
for select
to anon, authenticated
using (true);

create policy "imoveis_insercao_autenticada"
on public.imoveis
for insert
to authenticated
with check (true);

create policy "imoveis_atualizacao_autenticada"
on public.imoveis
for update
to authenticated
using (true)
with check (true);

create policy "imoveis_exclusao_autenticada"
on public.imoveis
for delete
to authenticated
using (true);

grant select on table public.imoveis to anon, authenticated;
grant insert, update, delete on table public.imoveis to authenticated;

insert into storage.buckets (id, name, public)
values ('fotos-imoveis', 'fotos-imoveis', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "fotos_imoveis_leitura" on storage.objects;
drop policy if exists "fotos_imoveis_envio" on storage.objects;
drop policy if exists "fotos_imoveis_atualizacao" on storage.objects;
drop policy if exists "fotos_imoveis_exclusao" on storage.objects;

create policy "fotos_imoveis_leitura"
on storage.objects
for select
to public
using (bucket_id = 'fotos-imoveis');

create policy "fotos_imoveis_envio"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'fotos-imoveis');

create policy "fotos_imoveis_atualizacao"
on storage.objects
for update
to authenticated
using (bucket_id = 'fotos-imoveis');

create policy "fotos_imoveis_exclusao"
on storage.objects
for delete
to authenticated
using (bucket_id = 'fotos-imoveis');

-- Exemplos para o catálogo. Não duplica se a tabela já tiver imóveis.
insert into public.imoveis (titulo, cidade, preco, categoria, tipo, quartos, area, descricao, foto_url)
select *
from (
  values
    (
      'Casa de vila com jardim',
      'Campinas',
      890000,
      'casa',
      'venda',
      3,
      180,
      'Casa térrea em rua tranquila, com jardim nos fundos, sala integrada e cozinha arejada. Pronta para quem quer chegar e começar.',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'
    ),
    (
      'Apartamento com vista livre',
      'São Paulo',
      650000,
      'apartamento',
      'venda',
      2,
      78,
      'Dois dormitórios, uma suíte e varanda com vista aberta. Condomínio com portaria e lazer, a poucos minutos do metrô.',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80'
    ),
    (
      'Sala comercial no centro',
      'Belo Horizonte',
      3200,
      'comercial',
      'locacao',
      0,
      42,
      'Sala clara em edifício com elevador, pronta para consultório ou escritório. O valor anunciado é o aluguel mensal.',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80'
    ),
    (
      'Terreno em condomínio',
      'Florianópolis',
      420000,
      'terreno',
      'venda',
      0,
      450,
      'Lote plano em condomínio fechado, com infraestrutura de água, luz e acesso pavimentado. Um começo em branco, no seu tempo.',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80'
    ),
    (
      'Casa térrea reformada',
      'Curitiba',
      1150000,
      'casa',
      'venda',
      4,
      220,
      'Quatro dormitórios, área gourmet e quintal com espaço para horta. Reforma recente, com materiais sóbrios e boa iluminação natural.',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
    ),
    (
      'Apartamento mobiliado',
      'Rio de Janeiro',
      2800,
      'apartamento',
      'locacao',
      1,
      46,
      'Studio mobiliado, com luz da manhã e prédios de serviço por perto. Aluguel mensal, ideal para uma mudança sem espera.',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80'
    )
) as exemplos (titulo, cidade, preco, categoria, tipo, quartos, area, descricao, foto_url)
where not exists (select 1 from public.imoveis);
