import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { CLINIC_INFO } from './constants';

export function WelcomePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-teal-800">{CLINIC_INFO.name}</h1>
          <Link to="/login">
            <Button>Ingresar</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        <section className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
            Bienvenido a tu espacio <br/> de bienestar
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Accede a tus documentos y recursos personalizados de forma segura.
          </p>
          <div className="pt-4">
             <Link to="/login">
               <Button className="text-xl px-10 py-4 shadow-md">Ingresar ahora</Button>
             </Link>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
          <h3 className="text-2xl font-bold text-stone-800 mb-4">Quiénes somos</h3>
          <p className="text-lg text-stone-600 leading-relaxed">
            {CLINIC_INFO.description}
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-teal-50 p-8 rounded-2xl border border-teal-100">
            <h3 className="text-2xl font-bold text-teal-900 mb-4">Horarios de atención</h3>
            <p className="text-lg text-teal-800">
              {CLINIC_INFO.schedule}
            </p>
          </section>

          <section className="bg-stone-100 p-8 rounded-2xl border border-stone-200">
            <h3 className="text-2xl font-bold text-stone-800 mb-4">Contacto</h3>
            <ul className="text-lg text-stone-600 space-y-3">
              <li><span className="font-semibold">Teléfono:</span> {CLINIC_INFO.contact.phone}</li>
              <li><span className="font-semibold">Correo:</span> {CLINIC_INFO.contact.email}</li>
              <li><span className="font-semibold">Redes:</span> {CLINIC_INFO.contact.social}</li>
            </ul>
          </section>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-8 pb-6">
            <h3 className="text-2xl font-bold text-stone-800 mb-2">Ubicación</h3>
            <p className="text-lg text-stone-600">{CLINIC_INFO.location.address}</p>
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

      <footer className="bg-stone-900 text-stone-400 py-8 text-center">
        <p className="text-lg">© {new Date().getFullYear()} {CLINIC_INFO.name}. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
