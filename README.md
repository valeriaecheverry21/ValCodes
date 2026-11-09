# ValCodes

> Portfolio de **Valeria Echeverry** — Desarrolladora de software

Bienvenido/a al repositorio de **ValCodes**, el portfolio profesional de Valeria Echeverry. Un proyecto full-stack que combina un frontend moderno en **React** con un backend **serverless en Go**, integrado con el envío de correos a través de **Resend** para facilitar el contacto directo.

## 🚀 Tecnologías

| Área | Tecnologías |
|------|-------------|
| 🖥️ **Frontend** | React 19 · Vite · CSS3 · JavaScript (ES6+) |
| 🎬 **Animación & UX** | Motion · Lenis (scroll suave) · Sonner (notificaciones) |
| ⚙️ **Backend** | Go · Serverless Functions (Vercel) · net/http |
| ✉️ **Email** | Resend (API transaccional) |
| 🛠️ **Deploy** | Vercel · GitHub Actions |

## ✨ Características

- 🎨 **Tema claro / oscuro** con acento menta y terminal `profile.cs` que se escribe línea a línea.
- 📱 **Totalmente responsive** — con menú móvil animado.
- 📜 **Secciones completas**: Sobre mí, Experiencia, Habilidades, Educación, Proyectos y Contacto.
- ✉️ **Formulario de contacto funcional** que envía emails reales vía Resend.
- 🌐 **API serverless en Go** disponible en el mismo dominio.

### 🎬 Animaciones e interactividad

- **Navegación inteligente**: marca la sección activa, se oculta al bajar y reaparece al subir.
- **Hero animado**: entrada escalonada, terminal con inclinación 3D al mover el mouse y contadores animados.
- **Línea de tiempo** de experiencia que se dibuja a medida que hacés scroll.
- **Tarjetas con brillo** que sigue al cursor e inclinación 3D sutil.
- **Filtro de proyectos** por tecnología con transiciones animadas.
- **Barra de progreso** de lectura, botón "volver arriba" y scroll suave.

### ♿ UX y accesibilidad

- Validación del formulario en tiempo real, con mensajes claros y foco en el primer error.
- Notificaciones al enviar el formulario o copiar el email, con alternativa por WhatsApp si falla el envío.
- Respeta la preferencia del sistema **"reducir movimiento"** (desactiva animaciones y scroll suave).
- Enlace "Saltar al contenido", foco visible para navegación con teclado y atributos ARIA.

## 🤝 Conectemos

[![LinkedIn](https://img.shields.io/badge/linkedin-%234fffb0?style=for-the-badge&logo=linkedin&logoColor=%230b0e13)](https://www.linkedin.com/in/valeria-echeverry-7610b11b5/)
[![GitHub](https://img.shields.io/badge/github-%2300c2ff?style=for-the-badge&logo=github&logoColor=%230b0e13)](https://github.com/valeriaecheverry21)
[![Email](https://img.shields.io/badge/email-%23ff6b6b?style=for-the-badge&logo=gmail&logoColor=%230b0e13)](mailto:valeriaecheverry21@hotmail.com)

---

## 📁 Estructura

```
portfolio-valeria/
├── frontend/                  # Aplicación React (Vite) = el proyecto que se despliega en Vercel
│   ├── api/                   # Funciones serverless de Go (Vercel)
│   │   ├── contact.go         # POST /api/contact — envía emails vía Resend
│   │   └── health.go          # GET /api/health
│   ├── src/                   # Código React
│   │   ├── components/        # Secciones (Hero, Nav, Projects, Contact…)
│   │   │   ├── motion.jsx     # Componentes de animación reutilizables (Reveal, Stagger, SpotlightCard)
│   │   │   └── variants.js    # Variantes de animación compartidas
│   │   └── data.js            # Contenido del portfolio (experiencia, skills, proyectos)
│   └── vercel.json            # Config de Vercel (runtimes Go de las funciones)
└── backend/                   # API REST de Go (solo para desarrollo/servidor local)
```

## Stack

- **Frontend:** React 19 + Vite. Tema claro/oscuro, diseño responsive y animaciones con:
  - [Motion](https://motion.dev) — animaciones de entrada, scroll, hover y layout.
  - [Lenis](https://lenis.darkroom.engineering) — scroll suave.
  - [Sonner](https://sonner.emilkowal.ski) — notificaciones (toasts).
- **Backend:** Go, solo librería estándar (sin dependencias externas).

## Formulario de contacto: email y WhatsApp

Cuando alguien envía el formulario, la API reenvía el mensaje por **email (Resend)** y, si está configurado, también como **aviso de WhatsApp (CallMeBot)**. El envío se considera exitoso si llega por al menos uno de los dos canales.

Además, el formulario tiene un botón **"Enviar por WhatsApp"** que abre WhatsApp con el mensaje ya escrito. Funciona siempre, sin configurar nada.

La API valida los datos (largo del nombre y mensaje, formato del email), limita el tamaño de la petición y descarta bots con un campo oculto (*honeypot*).

### Variables de entorno

| Variable             | Descripción                                                       | Ejemplo                               |
|----------------------|-------------------------------------------------------------------|---------------------------------------|
| `RESEND_API_KEY`     | Clave API de Resend                                               | `re_xxxxxxxx`                         |
| `CONTACT_FROM_EMAIL` | Remitente. Debe ser un dominio verificado en Resend (para pruebas usá `onboarding@resend.dev`) | `Portfolio <noreply@tudominio.com>` |
| `CONTACT_TO_EMAIL`   | Destinatario de los mensajes del formulario                       | `valeriaecheverry21@hotmail.com`     |
| `CALLMEBOT_PHONE`    | (Opcional) Tu número de WhatsApp con código de país               | `+541123961238`                       |
| `CALLMEBOT_APIKEY`   | (Opcional) Clave que te da CallMeBot                               | `123456`                              |
| `ALLOWED_ORIGINS`    | (Opcional) Dominios que pueden llamar a la API, separados por coma. Vacío = todos | `https://valeriaecheverry21.github.io` |

Para desarrollo local, copiá `backend/.env.example` como `backend/.env` y completalo: el backend lo lee automáticamente al arrancar. El archivo `.env` no se sube a Git.

### Activar los avisos por WhatsApp (CallMeBot, gratis)

1. Entrá a la [guía de CallMeBot para WhatsApp](https://www.callmebot.com/blog/free-api-whatsapp-messages/) y agregá a tus contactos el número del bot que figura ahí.
2. Enviale por WhatsApp el mensaje: `I allow callmebot to send me messages`.
3. Te responde con tu **apikey**. Cargala en `CALLMEBOT_APIKEY` y tu número en `CALLMEBOT_PHONE`.

### Verificar la configuración

`GET /api/health` indica qué canales están configurados (sin mostrar las claves):

```json
{ "status": "ok", "channels": { "email": true, "whatsapp": true } }
```

Si un envío falla, el detalle del error queda en los logs del servidor (en Vercel: **Project → Logs**), no se le muestra al visitante.

> Con la clave gratuita de Resend y sin dominio verificado, usás `onboarding@resend.dev` como remitente y podés enviar **solo al email con el que registraste la cuenta**. Para enviar a cualquier dirección, verificá tu dominio en el panel de Resend y usalo como `CONTACT_FROM_EMAIL`.

## Puesta en marcha local

### Backend (Go) — para desarrollo

```bash
cd backend
cp .env.example .env               # completá RESEND_API_KEY (y CallMeBot si querés)
go run .
```

La API queda escuchando en `http://localhost:8080`.

| Método | Ruta            | Descripción                                    |
|--------|-----------------|------------------------------------------------|
| GET    | `/api/health`   | Estado del servicio                            |
| GET    | `/api/projects` | Proyectos (muestra)                           |
| GET    | `/api/experience` | Experiencia (muestra)                       |
| POST   | `/api/contact`  | Recibe `{name, email, message}` y envía el email vía Resend |

### Frontend (React)

```bash
cd frontend
npm install
npm run dev      # desarrollo, con proxy /api -> localhost:8080
npm run build    # build de producción
npm run preview  # sirve el build
```

Durante el desarrollo, Vite redirige las peticiones `/api/*` al backend local en `localhost:8080` (ver `vite.config.js`).

## Despliegue en Vercel

El proyecto se despliega como una sola app en Vercel: frontend React + funciones serverless de Go en `frontend/api/`.

### Opción A — importar desde GitHub (recomendada)

1. Subí el repositorio a GitHub.
2. En [vercel.com](https://vercel.com) → **Add New → Project → Import** tu repositorio.
3. En la config del proyecto:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (se detecta solo)
   - Build Command: `npm run build` (por defecto)
   - Output Directory: `dist` (por defecto)
4. En **Environment Variables**, agregá:
   - `RESEND_API_KEY`
   - `CONTACT_FROM_EMAIL` (opcional, default `onboarding@resend.dev`)
   - `CONTACT_TO_EMAIL` (opcional, default tu email)
   - `CALLMEBOT_PHONE` y `CALLMEBOT_APIKEY` (opcionales, para avisos por WhatsApp)
5. **Deploy.**

Vercel detecta automáticamente las funciones `api/*.go` como Serverless Functions, que quedan disponibles en `/api/health` y `/api/contact` en el mismo dominio.

### Opción B — CLI de Vercel

```bash
npm i -g vercel
cd frontend
vercel            # seguí el asistente; vercel.json ya configura las funciones Go
```

Luego para producción:

```bash
cd frontend
vercel --prod
```

## Nota sobre GitHub Pages

Este repo también tiene un workflow de GitHub Actions (`.github/workflows/deploy.yml`) que publica el frontend estático en GitHub Pages. GitHub Pages no puede ejecutar la API, así que para que el formulario funcione ahí:

1. Desplegá el proyecto en **Vercel** (la API queda en `https://<tu-proyecto>.vercel.app/api/...`).
2. En GitHub: **Settings → Secrets and variables → Actions → Variables**, creá `VITE_API_URL` con la URL de Vercel (ej. `https://<tu-proyecto>.vercel.app`).
3. Volvé a ejecutar el workflow. El frontend llamará a la API de Vercel.
