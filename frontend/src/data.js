export const profile = {
  name: 'Valeria Echeverry',
  role: 'Desarrolladora Full Stack · .NET & React',
  email: 'valeriaecheverry21@hotmail.com',
  phone: '+54 11 2396-1238',
  phoneHref: '+541123961238',
  whatsapp:
    'https://wa.me/541123961238?text=' +
    encodeURIComponent('Quiero contactarme por el servicio de desarrollo de software'),
  location: 'Buenos Aires, Argentina',
  github: 'https://github.com/valeriaecheverry21',
  githubUser: 'valeriaecheverry21',
  linkedin: 'https://www.linkedin.com/in/valeria-echeverry-7610b11b5/',
  summary:
    'Desarrolladora full stack con 9 años de experiencia en el ecosistema .NET (C#, SQL Server) y en frontend con React y Blazor. Mi recorrido va del soporte de sistemas al diseño de arquitecturas de microservicios (DDD/CQRS, API Gateway y BFF), microfrontends con Module Federation y aplicaciones web para el sector financiero. Experiencia en testing (xUnit, Moq, React Testing Library) y CI/CD con Jenkins y Azure DevOps; proyectos personales en Next.js y Go.',
}

export const experience = [
  {
    role: 'Desarrolladora Full Stack',
    company: 'KPMG Argentina',
    period: '03/2025 — Presente',
    items: [
      'Desarrollo aplicaciones internas en .NET 8 (Blazor y MVC) que automatizan procesos operativos de la firma.',
      'Automaticé tareas manuales de los equipos internos y reduje sus tiempos de ejecución.',
      'Optimizo el acceso a datos con LINQ y SQL, controlando cuándo se ejecuta cada consulta.',
    ],
  },
  {
    role: 'Desarrolladora de Aplicaciones',
    company: 'Baufest',
    period: '06/2020 — 02/2025',
    items: [
      'Migré de Salesforce a un CRM propio para los ejecutivos de un banco: microservicios .NET detrás de un API Gateway (Ocelot), con autenticación JWT, permisos por rol y un BFF para el frontend.',
      'Desarrollé el frontend del CRM en React con React Query y React Hook Form, con tests en React Testing Library.',
      'Diseñé los microservicios de Comercio Exterior con CQRS, para que los reportes pesados dejaran de competir con las transacciones críticas.',
      'Implementé microfrontends con Module Federation (Webpack 5), lo que permitió que cada equipo desplegara a su propio ritmo.',
      'Construí una API de reportes para una entidad financiera (.NET Core, DDD, Dapper) con descargas auditadas y streaming de archivos grandes.',
      'Desarrollé stored procedures en SQL Server con lógica de negocio para el proyecto de reportería.',
    ],
  },
  {
    role: 'Analista de Sistemas',
    company: 'Accenture',
    period: '10/2017 — 06/2020',
    items: [
      'Mantuve y evolucioné aplicaciones ASP.NET y C# sobre SQL Server y Sybase, de la interfaz a la consulta SQL.',
      'Automaticé con Python las tareas diarias repetitivas del equipo.',
    ],
  },
]

export const education = [
  {
    institution: 'Universidad Tecnológica Nacional',
    degree: 'Analista de Sistemas',
    period: '2017 — 2021',
    status: 'Completado',
  },
  {
    institution: 'Coderhouse',
    degree: 'React JS',
    period: '',
    status: 'Completado',
  },
  {
    institution: 'Coderhouse',
    degree: 'AI Engineering',
    period: '',
    status: 'Completado',
  },
  {
    institution: 'Coderhouse',
    degree: 'Desarrollo Web',
    period: '',
    status: 'Completado',
  },
]

export const skills = [
  { category: 'Backend', items: ['C#', '.NET 8 / .NET Core', 'ASP.NET MVC', 'APIs REST', 'Dapper', 'LINQ', 'Python', 'Go'] },
  { category: 'Arquitectura', items: ['Microservicios', 'DDD', 'CQRS', 'API Gateway (Ocelot)', 'BFF', 'Microfrontends (Module Federation)'] },
  { category: 'Frontend', items: ['React', 'React Query', 'React Hook Form', 'Next.js', 'Blazor', 'Material UI', 'Storybook'] },
  { category: 'Bases de datos', items: ['SQL Server (stored procedures)', 'Oracle PL/SQL', 'MySQL', 'Sybase'] },
  { category: 'Testing y DevOps', items: ['xUnit', 'Moq', 'React Testing Library', 'Git', 'Jenkins', 'Azure DevOps'] },
]

export const languages = ['Castellano (Nativo)', 'Inglés (Intermedio)']

export const projects = [
  {
    name: 'Burakku-Kohi',
    description:
      'E-commerce de café especial: catálogo de cafés de origen (Colombia, Etiopía, Brasil, etc.) y cafeteras (Aeropress, Chemex, Moka, etc.) con sugerencias de maridaje. React SPA.',
    tech: ['React', 'JavaScript', 'Firebase'],
    link: 'https://github.com/valeriaecheverry21/Burakku-Kohi',
  },
  {
    name: 'CatLin-Studio',
    description:
      'Sitio web profesional para un estudio de belleza que ofrece manicura, diseño de cejas, extensiones de pestañas y masajes. Combina un diseño moderno con una experiencia de usuario cuidada.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://github.com/valeriaecheverry21/CatLin-Studio',
  },
  {
    name: 'chatbot-whatsapp',
    description:
      'Aplicación web moderna y totalmente responsive que funciona en móvil, tablet y escritorio sin instalación nativa. Construida con tecnología web de vanguardia para máximo rendimiento.',
    tech: ['Go', 'Web'],
    link: 'https://github.com/valeriaecheverry21/chatbot-whatsapp',
  },
  {
    name: 'ProfileLedger',
    description:
      'API de perfil para Marketplace: consulta de información del usuario con niveles de puntos (Gold, Silver, Bronze), historial de compras paginado y detalle extendido con estado de pago y envío. Arquitectura en capas.',
    tech: ['Node.js', 'Express', 'REST API'],
    link: 'https://github.com/valeriaecheverry21/ProfileLedger',
  },
  {
    name: 'TeamRoster',
    description:
      'Panel de administración RRHH full-stack para la gestión de empleados (CRUD): listado responsive, creación con validaciones, edición de datos y eliminación con confirmación. Persistencia en SQLite con Sequelize.',
    tech: ['React', 'Node.js', 'Express', 'SQLite'],
    link: 'https://github.com/valeriaecheverry21/TeamRoster',
  },
]
