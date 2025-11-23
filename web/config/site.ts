export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Admitidos | Conoce todos los resultados de admisión",
  description:
    "Conoce todos los resultados de exámenes de admisión. Encuentra si has ingresado y analiza las estadísticas por cada carrera.",
  navItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Universidades",
      href: "/universidades",
    },
    {
      label: "Resultados",
      href: "/resultados",
    },
    {
      label: "Estadísticas",
      href: "/estadisticas",
    },
  ],
  navMenuItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Universidades",
      href: "/universidades",
    },
    {
      label: "Resultados",
      href: "/resultados",
    },
    {
      label: "Estadísticas",
      href: "/estadisticas",
    },
  ],
  links: {
    github: "https://github.com/jhairguzman",
    twitter: "https://twitter.com/jhairguzman",
    docs: "/docs",
    discord: "",
    sponsor: "",
  },
};
