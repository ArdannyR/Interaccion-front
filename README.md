# Consultorio Interacción - Frontend

Aplicación web para un consultorio psicológico que permite gestionar pacientes, terapeutas y planes de tratamiento de forma segura, mediante un sistema de roles.

## Estructura de Roles

1. **Directora**: Tiene acceso total. Puede ver/crear pacientes, añadir planes de tratamiento, ver la lista de terapeutas y configurar ajustes visuales.
2. **Terapeuta**: Próximamente dispondrá de su propio espacio. Actualmente visualiza un mensaje informativo al iniciar sesión.

## Rutas y Layout

La aplicación para la directora sigue un diseño tipo Moodle (Barra lateral a la izquierda) y cuenta con las siguientes rutas:
- `/pacientes` (Lista principal de pacientes)
- `/pacientes/nuevo` (Formulario para añadir un paciente)
- `/pacientes/:id` (Vista de detalles de un paciente y su historial de tratamientos)
- `/pacientes/:id/editar` (Edición de datos de un paciente)
- `/pacientes/:id/plan/nuevo` (Crear un plan de tratamiento nuevo)
- `/pacientes/:id/plan/:planId/editar` (Editar un plan de tratamiento existente)
- `/terapeutas` (Directorio de terapeutas, solo lectura)
- `/horarios` (Vista previa del horario)
- `/perfil` (Datos de la cuenta iniciada)
- `/ajustes` (Configuración de tonos y tamaño de texto)

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
- Crear los Enum y las tablas (`perfiles`, `pacientes`, `planes_tratamiento`).
- Crear funciones de seguridad y activar Row Level Security (RLS) para proteger los datos a nivel de base de datos.
