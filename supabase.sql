/* 
=============================================================================
ADVERTENCIA: 
Este script (`supabase.sql`) es para realizar un RESET COMPLETO de la base de datos.
Su ejecución ELIMINARÁ todas las tablas, datos y políticas actuales, y recreará el esquema desde cero.
Para cambios iterativos en producción, utiliza los scripts aditivos en `supabase/migraciones/`.
=============================================================================
*/

create extension if not exists btree_gist;

drop table if exists public.citas, public.planes_tratamiento, public.pacientes, public.perfiles cascade;

drop function if exists public.es_directora();
drop function if exists public.es_terapeuta();
drop type if exists public.user_role;
drop type if exists public.cita_estado;

-- 1. Tipos de datos
create type public.user_role as enum ('directora', 'terapeuta');
create type public.cita_estado as enum ('programada', 'cancelada');

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

create table public.citas (
  id uuid default gen_random_uuid() primary key,
  paciente_id uuid not null references public.pacientes(id) on delete cascade,
  profesional_id uuid not null references public.perfiles(id) on delete cascade,
  fecha date not null,
  hora_inicio time not null,
  hora_fin time not null,
  estado public.cita_estado default 'programada' not null,
  notas text,
  creado_por uuid references public.perfiles(id) on delete set null,
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Restricción: Un profesional no puede tener citas solapadas
  CONSTRAINT profesional_no_solapa EXCLUDE USING gist (
    profesional_id WITH =,
    fecha WITH =,
    timerange(hora_inicio, hora_fin, '()') WITH &&
  ) WHERE (estado = 'programada'),
  
  -- Restricción: Un paciente no puede tener citas solapadas
  CONSTRAINT paciente_no_solapa EXCLUDE USING gist (
    paciente_id WITH =,
    fecha WITH =,
    timerange(hora_inicio, hora_fin, '()') WITH &&
  ) WHERE (estado = 'programada')
);

-- 3. Índices para mejorar rendimiento
create index idx_perfiles_rol on public.perfiles(rol);
create index idx_pacientes_cedula on public.pacientes(cedula);
create index idx_planes_paciente on public.planes_tratamiento(paciente_id);
create index idx_citas_profesional on public.citas(profesional_id);
create index idx_citas_paciente on public.citas(paciente_id);
create index idx_citas_fecha on public.citas(fecha);

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
alter table public.citas enable row level security;

-- Políticas: Perfiles
create policy "Usuarios leen todos los perfiles activos o el suyo propio"
  on public.perfiles for select to authenticated
  using ( auth.uid() = id or activo = true );

create policy "Directoras pueden editar perfiles"
  on public.perfiles for update to authenticated
  using ( public.es_directora() )
  with check ( public.es_directora() );

-- Políticas: Pacientes
create policy "Directoras acceso total pacientes"
  on public.pacientes for all to authenticated
  using ( public.es_directora() )
  with check ( public.es_directora() );

-- Políticas: Planes
create policy "Directoras acceso total planes"
  on public.planes_tratamiento for all to authenticated
  using ( public.es_directora() )
  with check ( public.es_directora() );

-- Políticas: Citas
create policy "Directoras acceso total citas"
  on public.citas for all to authenticated
  using ( public.es_directora() )
  with check ( public.es_directora() );
