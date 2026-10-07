import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { SettingsProvider } from './features/settings/SettingsContext';
import { RoleRoute } from './app/RoleRoute';

import { WelcomePage } from './features/landing/WelcomePage';
import { LoginForm } from './features/auth/LoginForm';

// Layouts
import { AppLayout } from './app/AppLayout';

// Vistas Directora
import { PacientesList } from './features/pacientes/PacientesList';
import { PacienteForm } from './features/pacientes/PacienteForm';
import { PacienteDetail } from './features/pacientes/PacienteDetail';
import { PlanForm } from './features/pacientes/PlanForm';
import { TerapeutasList } from './features/terapeutas/TerapeutasList';
import { TerapeutaDetail } from './features/terapeutas/TerapeutaDetail';
import { HorariosView } from './features/horarios/HorariosView';
import { PerfilView } from './features/perfil/PerfilView';
import { AjustesView } from './features/settings/AjustesView';

// Vistas Terapeuta
import { TerapeutaComingSoon } from './features/dashboard/TerapeutaComingSoon';

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginForm />} />

            {/* Rutas exclusivas para Directora */}
            <Route element={<RoleRoute allowedRoles={['directora']} />}>
              <Route element={<AppLayout />}>
                <Route path="/pacientes" element={<PacientesList />} />
                <Route path="/pacientes/nuevo" element={<PacienteForm />} />
                <Route path="/pacientes/:id" element={<PacienteDetail />} />
                <Route path="/pacientes/:id/editar" element={<PacienteForm />} />
                <Route path="/pacientes/:id/plan/nuevo" element={<PlanForm />} />
                <Route path="/pacientes/:id/plan/:planId/editar" element={<PlanForm />} />
                <Route path="/terapeutas" element={<TerapeutasList />} />
                <Route path="/terapeutas/:id" element={<TerapeutaDetail />} />
                <Route path="/horarios" element={<HorariosView />} />
                <Route path="/perfil" element={<PerfilView />} />
                <Route path="/ajustes" element={<AjustesView />} />
                <Route path="*" element={<Navigate to="/pacientes" replace />} />
              </Route>
            </Route>

            {/* Rutas exclusivas para Terapeuta */}
            <Route element={<RoleRoute allowedRoles={['terapeuta']} />}>
              <Route path="/tu-espacio" element={<TerapeutaComingSoon />} />
              <Route path="*" element={<Navigate to="/tu-espacio" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
