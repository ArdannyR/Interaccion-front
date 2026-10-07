import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { CLINIC_INFO } from './constants';

export function WelcomePage() {
  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 bg-linear-to-br from-(--color-primary-50) via-(--color-background) to-(--color-primary-100)/40 -z-20 pointer-events-none" />
      <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-(--color-primary-300)/20 rounded-full blur-3xl animate-float -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-(--color-primary-400)/20 rounded-full blur-3xl animate-float -z-10 pointer-events-none" style={{ animationDelay: '-10s' }} />

      <header className="bg-(--color-surface)/80 backdrop-blur-md border-b border-(--color-border) sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-(--color-primary-700) to-(--color-primary-500)">
            {CLINIC_INFO.name}
          </h1>
          <Link to="/login">
            <Button>Ingresar</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16 animate-fade-up">
        <section className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-(--color-primary-800) to-(--color-primary-600) leading-tight pb-2">
            Bienvenido a tu espacio <br/> de bienestar
          </h2>
          <p className="text-xl text-(--color-text-muted) max-w-2xl mx-auto leading-relaxed">
            Accede a tus recursos personalizados de forma segura.
          </p>
          <div className="pt-4">
             <Link to="/login">
               <Button className="text-xl px-10 py-4 shadow-xl">Ingresar ahora</Button>
             </Link>
          </div>
        </section>

        <section className="bg-(--color-surface)/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/40">
          <h3 className="text-2xl font-bold text-(--color-text-main) mb-4">Quiénes somos</h3>
          <p className="text-lg text-(--color-text-muted) leading-relaxed">
            {CLINIC_INFO.description}
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-linear-to-br from-(--color-primary-50) to-(--color-primary-100) p-8 rounded-2xl shadow-md border border-(--color-primary-200)">
            <h3 className="text-2xl font-bold text-(--color-primary-900) mb-4">Horarios de atención</h3>
            <p className="text-lg text-(--color-primary-800) font-medium">
              {CLINIC_INFO.schedule}
            </p>
          </section>

          <section className="bg-(--color-surface)/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/40">
            <h3 className="text-2xl font-bold text-(--color-text-main) mb-4">Contacto</h3>
            <ul className="text-lg text-(--color-text-muted) space-y-3">
              <li><span className="font-semibold text-(--color-primary-700)">Teléfono:</span> {CLINIC_INFO.contact.phone}</li>
              <li><span className="font-semibold text-(--color-primary-700)">Correo:</span> {CLINIC_INFO.contact.email}</li>
              <li><span className="font-semibold text-(--color-primary-700)">Redes:</span> {CLINIC_INFO.contact.social}</li>
            </ul>
          </section>
        </div>

        <section className="bg-(--color-surface)/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 overflow-hidden">
          <div className="p-8 pb-6">
            <h3 className="text-2xl font-bold text-(--color-text-main) mb-2">Ubicación</h3>
            <p className="text-lg text-(--color-text-muted)">{CLINIC_INFO.location.address}</p>
          </div>
          <div className="w-full h-[400px]">
            <iframe 
              src={CLINIC_INFO.location.mapUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación"
            ></iframe>
          </div>
        </section>
      </main>

      <footer className="bg-(--color-surface)/80 backdrop-blur-md border-t border-(--color-border) py-8 text-center mt-12">
        <p className="text-lg text-(--color-text-muted)">© {new Date().getFullYear()} {CLINIC_INFO.name}. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
