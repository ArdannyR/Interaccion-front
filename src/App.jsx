import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { RoleRoute } from './app/RoleRoute';

import { WelcomePage } from './features/landing/WelcomePage';
import { LoginForm } from './features/auth/LoginForm';

// Vistas Directora
import { DashboardDirectora } from './features/dashboard/DashboardDirectora';
import { PacientesList } from './features/pacientes/PacientesList';
import { PacienteForm } from './features/pacientes/PacienteForm';
import { PacienteDetail } from './features/pacientes/PacienteDetail';
import { TerapeutasList } from './features/terapeutas/TerapeutasList';
import { DocumentosList } from './features/documents/DocumentosList';

// Vistas Terapeuta
import { DashboardTerapeuta } from './features/dashboard/DashboardTerapeuta';
import { PacienteDetailTerapeuta } from './features/pacientes/PacienteDetailTerapeuta';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Rutas exclusivas para Directora */}
          <Route element={<RoleRoute allowedRoles={['directora']} />}>
            <Route path="/dashboard" element={<DashboardDirectora />} />
            <Route path="/pacientes" element={<PacientesList />} />
            <Route path="/pacientes/nuevo" element={<PacienteForm />} />
            <Route path="/pacientes/:id" element={<PacienteDetail />} />
            <Route path="/pacientes/:id/editar" element={<PacienteForm />} />
            <Route path="/terapeutas" element={<TerapeutasList />} />
            <Route path="/documentos" element={<DocumentosList />} />
          </Route>

          {/* Rutas exclusivas para Terapeuta */}
          <Route element={<RoleRoute allowedRoles={['terapeuta']} />}>
            <Route path="/mis-pacientes" element={<DashboardTerapeuta />} />
            <Route path="/pacientes/:id/ver" element={<PacienteDetailTerapeuta />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
