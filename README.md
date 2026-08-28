# ValCodes

> Portfolio de **Valeria Echeverry** — Desarrolladora de software

Bienvenido/a al repositorio de **ValCodes**, el portfolio profesional de Valeria Echeverry. Un proyecto full-stack que combina un frontend moderno en **React** con un backend **serverless en Go**, integrado con el envío de correos a través de **Resend** para facilitar el contacto directo.

## 🚀 Tecnologías

| Área | Tecnologías |
|------|-------------|
| 🖥️ **Frontend** | React 19 · Vite · CSS3 · JavaScript (ES6+) |
| ⚙️ **Backend** | Go · Serverless Functions (Vercel) · net/http |
| ✉️ **Email** | Resend (API transaccional) |
| 🛠️ **Deploy** | Vercel · GitHub Actions |

## ✨ Características

- 🎨 **Diseño dark moderno** con acento menta y terminal animada tipo `profile.cs`.
- 📱 **Totalmente responsive** — se adapta a móvil, tablet y escritorio.
- 📜 **Secciones completas**: Sobre mí, Experiencia, Habilidades, Proyectos y Educación.
- ✉️ **Formulario de contacto funcional** que envía emails reales vía Resend.
- 🌐 **API serverless en Go** disponible en el mismo dominio.
- ⚡ **Animaciones de scroll** con `IntersectionObserver`.

## 🤝 Conectemos

[![LinkedIn](https://img.shields.io/badge/linkedin-%234fffb0?style=for-the-badge&logo=linkedin&logoColor=%230b0e13)](https://www.linkedin.com/in/valeria-echeverry-7610b11b5/)
[![GitHub](https://img.shields.io/badge/github-%2300c2ff?style=for-the-badge&logo=github&logoColor=%230b0e13)](https://github.com/valeriaecheverry21)
[![Email](https://img.shields.io/badge/email-%23ff6b6b?style=for-the-badge&logo=gmail&logoColor=%230b0e13)](mailto:valeriaecheverryzl@hotmail.com)

---

## 📁 Estructura

```
portfolio-valeria/
├── frontend/                  # Aplicación React (Vite) = el proyecto que se despliega en Vercel
│   ├── api/                   # Funciones serverless de Go (Vercel)
│   │   ├── contact.go         # POST /api/contact — envía emails vía Resend
│   │   └── health.go          # GET /api/health
│   ├── src/                   # Código React
│   └── vercel.json            # Config de Vercel (runtimes Go de las funciones)
└── backend/                   # API REST de Go (solo para desarrollo/servidor local)
```

## Stack

- **Frontend:** React 19 + Vite. Estilo oscuro con acento menta, terminal animada, diseño responsive, animaciones de scroll (IntersectionObserver).
- **Backend:** Go, solo librería estándar (sin dependencias externas).

## Emails con Resend

El formulario de contacto envía emails de verdad mediante la API de **Resend** (<https://resend.com>). Requiere variables de entorno:

| Variable             | Descripción                                                       | Ejemplo                               |
|----------------------|-------------------------------------------------------------------|---------------------------------------|
| `RESEND_API_KEY`     | Clave API de Resend (obligatoria)                                 | `re_xxxxxxxx`                         |
| `CONTACT_FROM_EMAIL` | Remitente. Debe ser un dominio verificado en Resend (para pruebas usá `onboarding@resend.dev`) | `noreply@tudominio.com` |
| `CONTACT_TO_EMAIL`   | Destinatario de los mensajes del formulario                       | `valeriaecheverryzl@hotmail.com`     |

> Con la clave gratuita de Resend y sin dominio verificado, usás `onboarding@resend.dev` como remitente y podés enviar **solo al email con el que registraste la cuenta**. Para enviar a cualquier dirección, verificá tu dominio en el panel de Resend y usalo como `CONTACT_FROM_EMAIL`.

## Puesta en marcha local

### Backend (Go) — para desarrollo

```bash
cd backend
set RESEND_API_KEY=re_xxxx          # Windows PowerShell: $env:RESEND_API_KEY = "re_xxxx"
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

Este repo también tiene un workflow de GitHub Actions (`.github/workflows/deploy.yml`) que publica el frontend estático en GitHub Pages, pero el formulario de contacto no enviará emails ahí (no hay servidor ni funciones serverless). Para el envío de emails usá el despliegue en **Vercel**.
