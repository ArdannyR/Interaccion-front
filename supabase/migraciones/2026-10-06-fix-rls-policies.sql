-- Eliminar políticas inseguras o antiguas
DROP POLICY IF EXISTS "Todos autenticados leen pacientes" ON public.pacientes;
DROP POLICY IF EXISTS "Todos autenticados leen planes" ON public.planes_tratamiento;
DROP POLICY IF EXISTS "Todos autenticados leen citas" ON public.citas;
DROP POLICY IF EXISTS "Terapeutas pueden crear y editar citas" ON public.citas;
DROP POLICY IF EXISTS "Terapeutas pueden actualizar citas" ON public.citas;
DROP POLICY IF EXISTS "Directoras gestionan pacientes" ON public.pacientes;
DROP POLICY IF EXISTS "Directoras gestionan planes" ON public.planes_tratamiento;
DROP POLICY IF EXISTS "Directoras gestionan todas las citas" ON public.citas;
DROP POLICY IF EXISTS "Directoras pueden editar perfiles" ON public.perfiles;

-- Crear políticas estrictas (Lectura/Escritura exclusiva para directora, con check)
CREATE POLICY "Directoras acceso total pacientes"
  ON public.pacientes FOR ALL TO authenticated
  USING ( public.es_directora() )
  WITH CHECK ( public.es_directora() );

CREATE POLICY "Directoras acceso total planes"
  ON public.planes_tratamiento FOR ALL TO authenticated
  USING ( public.es_directora() )
  WITH CHECK ( public.es_directora() );

CREATE POLICY "Directoras acceso total citas"
  ON public.citas FOR ALL TO authenticated
  USING ( public.es_directora() )
  WITH CHECK ( public.es_directora() );

CREATE POLICY "Directoras pueden editar perfiles"
  ON public.perfiles FOR UPDATE TO authenticated
  USING ( public.es_directora() )
  WITH CHECK ( public.es_directora() );
