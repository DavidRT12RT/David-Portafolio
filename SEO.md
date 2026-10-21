# Guía SEO — David Arcos Portfolio

## Lo que ya hace el código

- **Dos idiomas con su propia dirección**: `/` en español y `/en` en inglés. Cada página tiene su título,
  descripción, canonical y tarjetas para redes, y las dos se anuncian entre sí con `hreflang`
  (`es`, `en` y `x-default` → `/`). El botón ES / EN cambia el texto al instante y actualiza la dirección.
- **sitemap.xml** con las dos direcciones y sus alternativas; **robots.txt** permite el rastreo y apunta al sitemap.
- **Datos estructurados** (Schema.org): `Person` (puesto, ciudad, idiomas, perfiles, el stack que muestran
  tus repositorios) y `WebSite`.
- **Open Graph y Twitter** con `/og-image.jpg` (1200×630).
- **Un solo `h1`** (tu nombre) y un `h2` por sala; los letreros que se repiten dentro de las pinturas no son encabezados.
- **Rendimiento**: el nombre del hero entra con una animación CSS (se pinta sin esperar al JavaScript); el 3D de
  las figuras se carga cuando el visitante empieza a moverse y el de las monedas cuando su bandeja se acerca; los
  teléfonos nunca descargan una pintura de más de 2560 px.

## Lo que te toca hacer a ti

### 1. Google Search Console (prioritario)
1. Entra a [search.google.com/search-console](https://search.google.com/search-console)
2. Añade la propiedad de dominio `david-arcos.com` (cubre también `www`) y verifícala con el registro DNS (TXT) que te den
3. Envía el sitemap: `https://www.david-arcos.com/sitemap.xml`
4. En "Inspección de URLs", solicita la indexación de `/` y de `/en`

### 2. Enlaces hacia el sitio
- Pon el enlace del portafolio en tu perfil de [LinkedIn](https://www.linkedin.com/in/david-arcos-melgarejo-722008322/)
  (sección de contacto y destacados) y en tu [GitHub](https://github.com/DavidRT12RT) (bio y sitio web)
- Si publicas artículos o proyectos, enlaza al portafolio; en inglés, enlaza a `/en`

### 3. Consistencia
- La dirección oficial es `https://www.david-arcos.com`. En Vercel → Settings → Domains, cambia la redirección de
  `david-arcos.com` a `www` de 307 (temporal) a 308 (permanente)
- Mantén el nombre "David Arcos Melgarejo" igual en títulos, LinkedIn y GitHub
- Si agregas páginas, añádelas a `app/sitemap.ts` con su versión en el otro idioma

### 4. Tiempo de indexación
Google puede tardar días o semanas en indexar o reindexar; tras enviar el sitemap suele acelerarse.
