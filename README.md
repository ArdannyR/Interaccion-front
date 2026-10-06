# Consultorio Interacción - Frontend

Aplicación web para un consultorio psicológico que permite gestionar pacientes, terapeutas y documentos de forma segura, mediante un sistema de roles.

## Estructura de Roles

1. **Directora**: Tiene acceso total. Puede ver/crear pacientes, asignar pacientes a terapeutas, gestionar perfiles de terapeutas, y subir/eliminar/descargar documentos de cualquier paciente.
2. **Terapeuta**: Solo tiene acceso a los pacientes que le han sido asignados y a sus documentos (en modo solo lectura y descarga).

## Requisitos previos

- Node.js (v18 o superior)
- Un proyecto en [Supabase](https://supabase.com/)

## Configuración e Instalación

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Copia el archivo `.env.example` y renómbralo a `.env`. Completa las variables con las credenciales de tu proyecto de Supabase (las encuentras en Project Settings > API).

## Iniciar la aplicación

Ejecuta el entorno de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Configuración de Supabase (SQL y Seguridad)

Es **obligatorio** configurar la base de datos para que la aplicación funcione.
Revisa el archivo `supabase.sql` incluido en la raíz de este proyecto. Copia y pega su contenido en la sección **SQL Editor** de tu panel de Supabase y ejecútalo.

Este script se encargará de:
- Crear los Enum y las tablas (`perfiles`, `pacientes`, `asignaciones`, `documentos`).
- Crear funciones de seguridad y activar Row Level Security (RLS) para proteger los datos a nivel de base de datos.
- Proteger el bucket de Storage llamado `pdfs`.

### Cuentas de Prueba

Dado que las cuentas de usuario (`auth.users`) no se crean desde la aplicación (por seguridad), debes:
1. Ir a Supabase > Authentication > Add user y crear los usuarios (ej. directora@test.com, terapeuta1@test.com).
2. Copiar los UUIDs (User UID) generados.
3. Al final del archivo `supabase.sql` encontrarás un script comentado (`INSERT DATOS DE PRUEBA`).
4. Reemplaza los `<UUID-MARTA>`, `<UUID-GUADALUPE>`, etc., por los UUIDs que copiaste y ejecuta esa parte del script para poblar los perfiles, pacientes y asignaciones iniciales.
