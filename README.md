# Web grupo de Madrid de la Data Visualization Society 

Este es el repositorio que da vida a la web del grupo de la DVS en Madrid. 

Esta web está desarrollada con **Svelte 5 y SvelteKit**. Puedes proponer cualquier tipo de cambio haciendo una Pull Request.

https://dvs-madrid.netlify.app 


#### Cómo ver la web en local

Para poder visualizar esta web necesitarás tener la versión 22 de Node.js. Para facilitar su uso, está el archivo `.nvmrc` con la versión exacta en la que ha sido desarrollada. Si no lo tienes, te recomiendo tener instalado `NVM` en tu ordenador, lo que facilitará el moverte entre diferentes proyectos y diferentes versiones de `Node`. Si no tienes `NVM` instalado [aquí](https://medium.com/@priscillashamin/how-to-install-and-configure-nvm-on-mac-os-43e3366c75a6) puedes ver cómo hacerlo desde 0.

Una vez tengas instalado `NVM` abre la carpeta en la que tengas el proyecto en la terminal y ejecuta el comando para instalar la versión de Node de este proyecto

```
nvm install
```

Luego, para usar esa versión, ejecuta:

```
nvm use
```

Ahora ya podrás instalar las dependencias de este proyecto:

```
npm install
```

Y para ver los cambios que realizas en los archivos usa:

```
npm run dev
```

#### Cómo añadir recursos


Las diferentes secciones de la web se alimentan del archivo `data.txt` que se encuentra en la carpeta `static`. Los datos están escritos en el formato [ArchieML](https://archieml.org/) para simplificar la accesibilidad del proyecto.

En el archivo se encuentran diferentes secciones que se corresponden con las secciones de la web. Cada sección está encabezada por una palabra entre corchetes (por ejemplo, [charlas]) y dentro están los diferentes objetos que la compoenen. 

**Para añadir una nueva persona a la lista** se haría de la siguiente forma: habría que ir a la parte del documento encabezada por [personas] y añadir las diferentes propiedades que queramos. Como mínimo hay que añadir el nombre, además, actualmente también está pensado para mostrar página web, cuenta de twitter y de Bluesky. 

Un ejemplo sería:

```
nombre: Menganito de Tal
bsky: menganito.bsky.social
```

Si quieres añadir cualquier otra referencia puedes hacerlo, pero, ten en cuenta que para que se muestre tendrás que cambiar el código del componente `personas.svelte`.


**Para añadir nuevos recursos de dataviz** el procedimiento es similar al anterior. Tendrás que buscar en el documento el tipo de recurso que quieres añadir. Actualmente hay cursos, canales de Youtube, libros y herramientas. Pero se pueden añadir cuantas categorías queramos. Para añadir una nueva categoría simplemente hay que escribir un nuevo corchete que empiece por `recursos.` y después poner el nombre de la categoría. Por ejemplo, si quisieramos añadir la categoría *Películas*, sería `[recursos.Películas]`.

Todos los recursos tienen una estructura similar. Cada uno necesita tener un `nombre` y puede tener un `link`.