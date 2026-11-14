-- Execute no SQL Editor do projeto Supabase.
create table if not exists public.store_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric(10,2) not null check (price >= 0),
  description text not null default '',
  image_url text not null default '/images/burger-classic.jpg',
  tag text not null default '',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.store_admins enable row level security;
alter table public.products enable row level security;

drop policy if exists "Admins can read own membership" on public.store_admins;
create policy "Admins can read own membership"
  on public.store_admins for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Anyone can read active products" on public.products;
create policy "Anyone can read active products"
  on public.products for select to anon, authenticated
  using (active = true);

drop policy if exists "Store admins can manage products" on public.products;
create policy "Store admins can manage products"
  on public.products for all to authenticated
  using (exists (
    select 1 from public.store_admins a where a.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.store_admins a where a.user_id = (select auth.uid())
  ));

insert into public.products (id, name, category, price, description, image_url, tag, active, sort_order)
values
  ('10000000-0000-4000-8000-000000000001', 'QuarterNask 2 por 1', 'Promoções', 39.90, 'Dois burgers para dividir — a pedida que já chama atenção no cardápio.', '/images/burger-double.jpg', '2 POR 1', true, 1),
  ('10000000-0000-4000-8000-000000000002', 'Ragu', 'Hambúrgueres', 34.90, 'Carne suculenta, queijo derretido e nosso ragu preparado lentamente.', '/images/burger-ragu.jpg', 'MAIS PEDIDO', true, 2),
  ('10000000-0000-4000-8000-000000000003', 'Nask Cheddar', 'Hambúrgueres', 32.90, 'Pão australiano, carne 160g, cebola caramelizada e molho cheddar autoral.', '/images/burger-cheese.jpg', '', true, 3),
  ('10000000-0000-4000-8000-000000000004', 'Duplo da Nask', 'Hambúrgueres', 38.90, 'Dois smash burgers, queijo, picles e molho especial da casa.', '/images/burger-classic.jpg', '', true, 4),
  ('10000000-0000-4000-8000-000000000005', 'Batata Nask', 'Acompanhamentos', 15.90, 'Batata crocante, sequinha e temperada na medida.', '/images/burger-cheese.jpg', 'CROCANTE', true, 5),
  ('10000000-0000-4000-8000-000000000006', 'Combo Nask', 'Combos', 45.90, 'Um burger clássico, batata e bebida gelada para fechar o pedido.', '/images/burger-classic.jpg', 'COMBO', true, 6)
on conflict (id) do nothing;

-- Depois de criar o usuário em Authentication > Users, vincule-o como admin:
-- insert into public.store_admins (user_id)
-- select id from auth.users where email = 'SEU_EMAIL_DE_ADMIN';
