<script>
    export let data; 
    export let chartValue;

    import { flatGroup, groups, area, stack, scaleLinear, scaleTime, max, extent } from "d3"

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

    $: keys = [...new Set(data.map(d => d[chartValue]))]

    let divWidth = 300
    let startingPoint = chartValue === "Sexo" ? 50 : 0

    let percentaje = false
    $: stackValue = percentaje ? "Porcentaje" : "Acumulados"

    
$: stackedData = stack()
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
    }));

    $: x = scaleTime()
        .domain(extent(data, d => new Date(d.Fecha)))
        .range([startingPoint, divWidth]);

    $: y = scaleLinear()
        .domain([0, max(stackedData[stackedData.length - 1], d => d[1])])
        .range([300, 0]);

    $: areaGenerator = area()
        .x(d => x(new Date(d.data.fecha)))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]));


    $: meetings = chartData.map(d => d.Fecha)
</script>


<div>
    <div>
        <button on:click={() => percentaje = false}>Mostrar en absoluto</button>
        <button on:click={() => percentaje = true}>Mostrar como porcentaje</button>
    </div>
    
    <div class="chart" bind:clientWidth={divWidth}>
    
        <svg style="height:100%" width={divWidth}>
            <g>
                {#each stackedData as layer, i}
                    <path class="layer" d={areaGenerator(layer)} style="fill:var(--{layer.key})" />
                {/each}
            </g>
    
            <g>
                {#if percentaje && chartValue === "Sexo" }
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
        </svg>
    
    </div>
</div>


<style>
    .chart {
        width: 100%;
        height: 350px;
    }

    .layer {
        transition: d .5s;
    }

    text {
        font-size: 12px
    }

</style>