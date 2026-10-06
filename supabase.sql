drop policy if exists "Directoras acceso total pdfs" on storage.objects;
drop policy if exists "Terapeutas leen pdfs de sus pacientes" on storage.objects;

drop table if exists public.documentos, public.asignaciones, public.pacientes, public.perfiles cascade;

drop function if exists public.es_directora();
drop function if exists public.es_terapeuta();
drop type if exists public.doc_type;
drop type if exists public.user_role;

-- 1. Tipos de datos
create type public.user_role as enum ('directora', 'terapeuta');
create type public.doc_type as enum ('consentimiento_informado', 'plan_tratamiento', 'otro');

-- 2. Tablas
create table public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombres text not null,
  apellidos text not null,
  rol public.user_role not null,
  especialidad text,
  activo boolean default true,
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.pacientes (
  id text primary key check (id ~ '^[0-9]{10}$'),  -- cédula
  nombres text not null,
  apellidos text not null,
  fecha_nacimiento date not null,
  representante text,
  telefono text,
  correo text,
  observaciones text,
  activo boolean default true,
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.asignaciones (
  id uuid default gen_random_uuid() primary key,
  paciente_id text not null references public.pacientes(id) on delete cascade,
  terapeuta_id uuid not null references public.perfiles(id) on delete cascade,
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (paciente_id, terapeuta_id)
);

create table public.documentos (
  id uuid default gen_random_uuid() primary key,
  paciente_id text not null references public.pacientes(id) on delete cascade,
  tipo public.doc_type not null,
  titulo text not null,
  descripcion text,
  ruta_archivo text not null,
  subido_por uuid not null references public.perfiles(id),
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Índices para mejorar rendimiento
create index idx_perfiles_rol on public.perfiles(rol);
create index idx_asignaciones_paciente on public.asignaciones(paciente_id);
create index idx_asignaciones_terapeuta on public.asignaciones(terapeuta_id);
create index idx_documentos_paciente on public.documentos(paciente_id);

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
alter table public.asignaciones enable row level security;
alter table public.documentos enable row level security;

-- Políticas: Perfiles
create policy "Usuarios leen su propio perfil o directoras leen todos"
  on public.perfiles for select to authenticated
  using ( auth.uid() = id or public.es_directora() );

create policy "Directoras pueden editar perfiles"
  on public.perfiles for update to authenticated
  using ( public.es_directora() );

-- Políticas: Pacientes
create policy "Directoras acceso total pacientes"
  on public.pacientes for all to authenticated
  using ( public.es_directora() );

create policy "Terapeutas leen sus pacientes asignados"
  on public.pacientes for select to authenticated
  using ( public.es_terapeuta() and id in (select paciente_id from public.asignaciones where terapeuta_id = auth.uid()) );

-- Políticas: Asignaciones
create policy "Directoras acceso total asignaciones"
  on public.asignaciones for all to authenticated
  using ( public.es_directora() );

create policy "Terapeutas leen sus propias asignaciones"
  on public.asignaciones for select to authenticated
  using ( terapeuta_id = auth.uid() );

-- Políticas: Documentos
create policy "Directoras acceso total documentos"
  on public.documentos for all to authenticated
  using ( public.es_directora() );

create policy "Terapeutas leen documentos de sus pacientes"
  on public.documentos for select to authenticated
  using ( public.es_terapeuta() and paciente_id in (select paciente_id from public.asignaciones where terapeuta_id = auth.uid()) );

-- 5. Storage
create policy "Directoras acceso total pdfs"
  on storage.objects for all to authenticated
  using ( bucket_id = 'pdfs' and public.es_directora() );

create policy "Terapeutas leen pdfs de sus pacientes"
  on storage.objects for select to authenticated
  using ( 
    bucket_id = 'pdfs' and 
    public.es_terapeuta() and 
    (select count(*) from public.asignaciones where terapeuta_id = auth.uid() and paciente_id = (string_to_array(name, '/'))[1]) > 0
  );

/* 
===========================================================
INSTRUCCIONES DE PRUEBA:
===========================================================
1. Crea 4 usuarios en la pestaña Authentication de Supabase y copia sus UUIDs.
2. Descomenta y reemplaza los UUIDs en el siguiente bloque para insertar datos.

-- INSERT DATOS DE PRUEBA
-- insert into public.perfiles (id, nombres, apellidos, rol, especialidad) values
-- ('<UUID-MARTA>', 'Marta', 'Ochoa', 'directora', null),
-- ('<UUID-GUADALUPE>', 'Guadalupe', 'Guarangayai', 'terapeuta', 'Terapia de lenguaje'),
-- ('<UUID-GABRIELA>', 'Gabriela', 'Cabascango', 'terapeuta', 'Terapia ocupacional'),
-- ('<UUID-CRISTIAN>', 'Cristian', 'Caicedo', 'terapeuta', 'Psicología y psicopedagogía');

-- -- Cédulas ecuatorianas válidas de prueba
-- insert into public.pacientes (id, nombres, apellidos, fecha_nacimiento, representante, telefono) values
-- ('1710034065', 'Juanito', 'Pérez', '2015-05-10', 'Ana Pérez', '555-1234'),
-- ('1710034073', 'María', 'López', '2016-08-20', 'Carlos López', '555-5678'),
-- ('1710034081', 'Pedrito', 'González', '2018-02-15', 'Laura González', '555-9012');

-- insert into public.asignaciones (paciente_id, terapeuta_id) values
-- ('1710034065', '<UUID-GUADALUPE>'),
-- ('1710034073', '<UUID-GABRIELA>'),
-- ('1710034081', '<UUID-CRISTIAN>'),
-- ('1710034065', '<UUID-CRISTIAN>');
*/
