<script>

    import { flatGroup, groups, area, stack, scaleLinear, scaleTime, max, extent, bisector } from "d3";
    import { colorDict } from '$lib/utils/utils'
    let { data, chartValue } = $props();

    function quitarDuplicados(datos) {
        const NewArray = groups(datos, (d) => d.Titulo);
        const array = [];

        NewArray.forEach((e, i) => {
            array.push(e[1][0]);
        });

        return array;
    }

    function crearResumen(datos, variable, tiempos) {
    // Filtrar duplicados si es necesario
    let presentaciones =
        variable === "Sexo" || variable === "Tipo de Organización"
            ? datos
            : quitarDuplicados(datos);

    // Agrupar los datos por fecha
    const array = flatGroup(presentaciones, (d) => d.Fecha);
    const mapa = flatGroup(datos, (e) => e[variable]);
    const categorias = mapa.map((d) => d[0]);
    const resumenPorFecha = {};

    array.forEach((d) => {
        const anteriores = presentaciones.filter(
            (e) => new Date(e.Fecha) <= new Date(d[0])
        );

        const tipos = flatGroup(anteriores, (e) => e[variable]);
        let totalPonentes = anteriores.length;  // Total de ponentes hasta la fecha
        let acumulados = {};

        // Inicializar el acumulado por categoría
        categorias.forEach(categoria => {
            acumulados[categoria] = 0; // Acumulado inicial para cada categoría
        });

        tipos.forEach(tipo => {
            const categoria = tipo[0];
            const cantidad = tipo[1].length;
            acumulados[categoria] += cantidad; // Sumar el total de cada categoría
        });

        // Crear el resumen para la fecha actual
        resumenPorFecha[d[0]] = {
            Fecha: new Date(d[0]),
            Acumulados: acumulados,
            Total: totalPonentes,
            Porcentaje: Object.fromEntries(
                Object.entries(acumulados).map(([key, value]) => [
                    key,
                    totalPonentes ? (value / totalPonentes) * 100 : 0 // Calcular porcentaje
                ])
            )
        };
    });

    // Filtrar por tiempos si se aplica
    let selection = Object.values(resumenPorFecha);
    if (tiempos !== "Todos" && tiempos !== "All") {
        selection = selection.filter(
            (d) =>
                d.Fecha >= metadata_tiempos[tiempos][0] &&
                d.Fecha <= metadata_tiempos[tiempos][1]
        );
    }

    return selection.sort((a, b) => a.Fecha - b.Fecha);
}

// chart things
let chartData = crearResumen(data, chartValue, "Todos")

let keys = $derived([...new Set(data.map(d => d[chartValue]))])

let divWidth = $state(300)
let startingPoint = chartValue === "Sexo" ? 50 : 0

let percentaje = $state(false)
let stackValue = $derived(percentaje ? "Porcentaje" : "Acumulados")


let stackedData = $derived(stack()
    .keys(keys)
    (chartData.map(d => {
        // Asegúrate de que d[stackValue] tenga las propiedades necesarias
        const values = d[stackValue];
        return {
            fecha: d.Fecha,
            // Usa la variable keys para acceder a los valores dinámicamente
            ...keys.reduce((acc, key) => {
                acc[key] = values[key] || 0; // Proporciona 0 si la clave no existe
                return acc;
            }, {})
        };
    })));

    let x = $derived(scaleTime()
        .domain(extent(data, d => new Date(d.Fecha)))
        .range([startingPoint, divWidth - 5]));

    let y = $derived(scaleLinear()
        .domain([0, max(stackedData[stackedData.length - 1], d => d[1])])
        .range([300, 5]));

    let areaGenerator = $derived(area()
        .x(d => x(new Date(d.data.fecha)))
        .y0(d => y(d[0]))
        .y1(d => y(d[1])));


    let meetings = $derived(chartData.map(d => d.Fecha))

    // hover stuff
    // Añade estas funciones y variables
    let hoveredData = $state(null);
    let cursorPosition = $state(null)

    function getDataAtPosition(position) {
        if (!position) return null;

        // Convierte la posición del cursor a una fecha usando la escala
        const date = x.invert(position);

        // Encuentra el índice más cercano en los datos
        const index = bisector(d => d.Fecha).center(chartData, date);

        // Devuelve los datos para esa fecha
        return chartData[index];
    }

    // Actualiza hoveredData cuando se mueve el cursor
    $effect(() => {
        hoveredData = getDataAtPosition(cursorPosition);
    });
</script>


<div>
    <div>
        <button class:active={percentaje === false} onclick={() => percentaje = false}>Número de charlas</button>
        <button class:active={percentaje === true} onclick={() => percentaje = true}>Porcentaje de charlas</button>
    </div>

    <div class="chart" bind:clientWidth={divWidth} >

        <svg style="height:100%" width={divWidth}
        	onpointermove={(event) => chartValue === 'Sexo' ? cursorPosition = event.layerX : null }
         	onpointerout={() => cursorPosition = null}
         >
            <g>
                {#each stackedData as layer, i}
                    <path class="layer" d={areaGenerator(layer)} style="fill:var(--{colorDict[layer.key] ?? layer.key})" />
                {/each}
            </g>

            <g>
                {#if percentaje && chartValue === "Sexo"}
                    <text y={y(50)} x=5 alignment-baseline="middle" >50%</text>
                    <line x1=40 x2={divWidth} y1={y(50)} y2={y(50)} stroke="black" stroke-width=1 />
                {/if}

                {#each meetings as meeting}
                    <line x1={x(meeting)} x2={x(meeting)} y1={0} y2={300} stroke="white" stroke-width=1  />
                    <text x={x(meeting)} y={320} alignment-baseline="baseline" text-anchor={x(meeting) < 20 ? 'start' : x(meeting) > divWidth - 20 ? 'end' : 'middle'} >
                        {new Intl.DateTimeFormat('es-ES', {dateStyle: 'short'}).format(new Date(meeting))}
                    </text>
                {/each}

            </g>

            {#if hoveredData !== null}
            	<g id="tooltip" style="transform:translateX({x(hoveredData.Fecha)}px)">
                	<line x1=0 x2=0 y2=300 y1={y(hoveredData[stackValue].Mujer + hoveredData[stackValue].Hombre)} stroke="black" />
                	<circle cx=0 cy=0 r=5 style="transform:translateY({y(hoveredData[stackValue].Mujer)}px)" />
                	<circle cx=0 cy=0 r=5 style="transform:translateY({y(hoveredData[stackValue].Mujer + hoveredData[stackValue].Hombre)}px)" />
             	</g>
            {/if}
        </svg>

    </div>
</div>


<style>
    .chart {
        width: 100%;
        height: 350px;
        position: relative;
    }

    .layer {
        transition: d .5s;
    }

    text {
        font-size: 12px
    }
</style>
