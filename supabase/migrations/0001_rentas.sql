-- Toriku · solicitudes de renta de equipo (solo usuarios registrados).
-- El sitio inserta con la sesión del usuario (assets/js/cuenta.js). Precios y disponibilidad los confirma el equipo:
-- «subtotal_estimado» lo calcula el navegador y es solo referencia, nunca se cobra a partir de él.

create table if not exists public.rentas (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null default auth.uid() references auth.users (id) on delete cascade,
  correo             text,
  fecha_inicio       date not null,
  dias               int  not null check (dias between 1 and 30),
  items              jsonb not null,               -- [{ id, sku, cantidad }]
  operadores         int  not null default 0 check (operadores >= 0),
  subtotal_estimado  numeric(12, 2),
  notas              text check (char_length(notas) <= 2000),
  estado             text not null default 'solicitada' check (estado in ('solicitada', 'confirmada', 'entregada', 'devuelta', 'cancelada')),
  created_at         timestamptz not null default now()
);

alter table public.rentas enable row level security;

-- Cada quien crea y ve solo sus solicitudes; el estado lo cambia el equipo con service_role.
create policy "rentas: insertar propias" on public.rentas
  for insert to authenticated with check (user_id = (select auth.uid()) and estado = 'solicitada');

create policy "rentas: leer propias" on public.rentas
  for select to authenticated using (user_id = (select auth.uid()));

revoke update, delete on public.rentas from anon, authenticated;
create index if not exists rentas_user_id_idx on public.rentas (user_id);
