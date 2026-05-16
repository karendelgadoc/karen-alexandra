import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — Karen Alexandra",
  description: "Cómo este sitio web trata tus datos personales.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
      <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-4">
        Legal
      </p>
      <h1 className="text-3xl font-light mb-10">Política de Privacidad</h1>

      <div className="space-y-8 text-sm text-[var(--muted)] leading-relaxed">
        <section>
          <h2 className="text-base font-normal text-[var(--charcoal)] mb-2">
            Responsable del tratamiento
          </h2>
          <p>
            Karen Alexandra Delgado — karendelgadoc2@gmail.com
            <br />
            Sitio web: karenalexandra.com
          </p>
        </section>

        <section>
          <h2 className="text-base font-normal text-[var(--charcoal)] mb-2">
            Cookies que usamos
          </h2>
          <p>
            Este sitio utiliza únicamente cookies estrictamente necesarias para
            el funcionamiento seguro del área de administración:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1">
            <li>
              <strong className="text-[var(--charcoal)]">pkce_verifier</strong>{" "}
              — Cookie temporal (5 minutos) que guarda el verificador PKCE
              durante el proceso de inicio de sesión con Google OAuth. Se elimina
              automáticamente al completar el inicio de sesión.
            </li>
            <li>
              <strong className="text-[var(--charcoal)]">admin_session</strong>{" "}
              — Cookie de sesión (7 días, HttpOnly) que autentica al administrador
              del sitio. Solo se crea tras iniciar sesión correctamente.
            </li>
          </ul>
          <p className="mt-3">
            No se usan cookies de análisis, publicidad ni rastreo de terceros.
          </p>
        </section>

        <section>
          <h2 className="text-base font-normal text-[var(--charcoal)] mb-2">
            Datos que recopilamos
          </h2>
          <p>
            Este sitio es un portfolio personal de solo lectura para visitantes.
            No recopilamos ningún dato personal de los visitantes: no hay
            formularios de registro, suscripción ni comentarios.
          </p>
          <p className="mt-2">
            El formulario de contacto, si está disponible, envía el mensaje
            directamente a nuestro correo sin almacenar datos en ninguna base
            de datos.
          </p>
        </section>

        <section>
          <h2 className="text-base font-normal text-[var(--charcoal)] mb-2">
            Servicios de terceros
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong className="text-[var(--charcoal)]">Google OAuth</strong>{" "}
              — usado exclusivamente para el inicio de sesión del administrador.
              Google puede registrar el evento de autenticación según su propia
              política de privacidad.
            </li>
            <li>
              <strong className="text-[var(--charcoal)]">Vercel</strong> —
              plataforma de alojamiento. Puede registrar IPs y métricas de
              acceso anónimas a nivel de infraestructura.
            </li>
            <li>
              <strong className="text-[var(--charcoal)]">InsForge</strong> —
              base de datos y almacenamiento de imágenes del sitio.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-normal text-[var(--charcoal)] mb-2">
            Tus derechos (RGPD)
          </h2>
          <p>
            Si resides en el Espacio Económico Europeo tienes derecho a acceder,
            rectificar o suprimir cualquier dato personal que pudiéramos tener
            sobre ti. Para ejercerlos, escríbenos a{" "}
            <a
              href="mailto:karendelgadoc2@gmail.com"
              className="text-[var(--charcoal)] underline underline-offset-2 hover:text-[var(--taupe)]"
            >
              karendelgadoc2@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-normal text-[var(--charcoal)] mb-2">
            Cambios en esta política
          </h2>
          <p>
            Podemos actualizar esta política en cualquier momento. La versión
            vigente siempre estará disponible en esta página.
          </p>
          <p className="mt-2 text-xs text-[var(--taupe)]">
            Última actualización: mayo 2026
          </p>
        </section>
      </div>
    </div>
  );
}
