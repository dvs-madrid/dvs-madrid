# Web grupo de Madrid de la Data Visualization Society

Este es el repositorio que da vida a la web del grupo de la DVS en Madrid.

Esta web está desarrollada con **Svelte 5 y SvelteKit**. Puedes proponer cualquier tipo de cambio haciendo una Pull Request.

https://dvs-madrid.netlify.app

---

### Stack técnico

- **Svelte 5** + **SvelteKit 2** — Framework
- **Vite 7** — Bundler
- **D3.js** — Visualización de datos
- **ArchieML** — Formato de datos legible para humanos
- **Netlify** — Despliegue

### Arquitectura de datos

La web se alimenta de dos fuentes:

1. **Google Sheets** (servidor) — Datos detallados de charlas y ponentes para las gráficas. Se obtiene en `+page.server.ts` como CSV.
2. **`static/data.txt`** (servidor) — Próximo evento, personas y recursos. Escrito en formato [ArchieML](https://archieml.org/) y parseado en el servidor.

Todo el contenido se carga en el servidor (SSR), no hay fetch en el cliente.

---

### Cómo ver la web en local

Necesitarás tener **Node.js 24** instalado. El archivo `.nvmrc` contiene la versión exacta. Si no tienes `NVM` instalado, [aquí](https://medium.com/@priscillashamin/how-to-install-and-configure-nvm-on-mac-os-43e3366c75a6) puedes ver cómo hacerlo.

```
nvm install
nvm use
npm install
npm run dev
```

---

### Cómo añadir contenido

Las secciones de personas y recursos se editan en el archivo `static/data.txt`, escrito en formato [ArchieML](https://archieml.org/).

**Para añadir una nueva persona** ve a la sección `[personas]` y añade las propiedades. Como mínimo hay que añadir el nombre. Opcionalmente se puede incluir cuenta de Twitter/X (`tw`), Bluesky (`bsky`), web (`web`) y LinkedIn (`linkedin`).

```
nombre: Menganito de Tal
bsky: menganito.bsky.social
tw: menganito
```

**Para añadir nuevos recursos de dataviz** busca la categoría correspondiente (Cursos, Canales, Herramientas, Libros). Para crear una nueva categoría, escribe un nuevo corchete que empiece por `recursos.` seguido del nombre, por ejemplo `[recursos.Películas]`.

Cada recurso necesita un `nombre` y opcionalmente un `link`:

```
nombre: Nombre del recurso
link: https://ejemplo.com
```

**Para actualizar las charlas y los datos de los gráficos** hay que editar la [hoja de cálculo de Google Sheets](https://docs.google.com/spreadsheets/d/1hPkvrszhubYai9_wbDN-MWowaqom54KLw7p8_GhwJ4s/edit).
