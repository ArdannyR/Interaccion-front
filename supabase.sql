drop table if exists public.planes_tratamiento, public.pacientes, public.perfiles cascade;

drop function if exists public.es_directora();
drop function if exists public.es_terapeuta();
drop type if exists public.user_role;

-- 1. Tipos de datos
create type public.user_role as enum ('directora', 'terapeuta');

-- 2. Tablas
create table public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombres text not null,
  apellidos text not null,
  rol public.user_role not null,
  especialidad text,
  foto_url text,
  activo boolean default true,
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.pacientes (
  id uuid default gen_random_uuid() primary key,
  cedula text not null unique check (cedula ~ '^[0-9]{10}$'),
  nombre_completo text not null,
  fecha_nacimiento date not null,
  direccion text not null,
  madre_nombre text not null,
  madre_telefono text not null,
  padre_nombre text not null,
  padre_telefono text not null,
  contacto_nombre text,
  contacto_telefono text,
  contacto_direccion text,
  activo boolean default true,
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.planes_tratamiento (
  id uuid default gen_random_uuid() primary key,
  paciente_id uuid not null references public.pacientes(id) on delete cascade,
  fecha date not null,
  diagnostico text not null,
  objetivo_inicial text not null,
  objetivos_alcanzados text,
  creado_por uuid references public.perfiles(id) on delete set null,
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Índices para mejorar rendimiento
create index idx_perfiles_rol on public.perfiles(rol);
create index idx_pacientes_cedula on public.pacientes(cedula);
create index idx_planes_paciente on public.planes_tratamiento(paciente_id);

-- 4. Seguridad RLS
create or replace function public.es_directora()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.perfiles
    where id = auth.uid() and rol = 'directora'
  );
$$;

create or replace function public.es_terapeuta()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.perfiles
    where id = auth.uid() and rol = 'terapeuta'
  );
$$;

alter table public.perfiles enable row level security;
alter table public.pacientes enable row level security;
alter table public.planes_tratamiento enable row level security;

-- Políticas: Perfiles
create policy "Usuarios leen todos los perfiles activos o el suyo propio"
  on public.perfiles for select to authenticated
  using ( auth.uid() = id or activo = true );

create policy "Directoras pueden editar perfiles"
  on public.perfiles for update to authenticated
  using ( public.es_directora() );

-- Políticas: Pacientes (Temporalmente accesibles a todo auth)
create policy "Todos autenticados leen pacientes"
  on public.pacientes for select to authenticated
  using ( true );

create policy "Directoras gestionan pacientes"
  on public.pacientes for all to authenticated
  using ( public.es_directora() );

-- Políticas: Planes
create policy "Todos autenticados leen planes"
  on public.planes_tratamiento for select to authenticated
  using ( true );

create policy "Directoras gestionan planes"
  on public.planes_tratamiento for all to authenticated
  using ( public.es_directora() );
