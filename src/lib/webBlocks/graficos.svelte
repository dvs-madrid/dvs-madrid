<script>
    export let data;

    import { csvParse, groups } from "d3";
	import { onMount } from "svelte";
    import DistribucionXsexo from '$lib/charts/distribucionXsexo.svelte';
    import AreaChart from "../charts/areaChart.svelte";

    let parsedData = []
    let numCharlas = 0
    let numPersonas = 0

    onMount(async () => {
        parsedData = await csvParse(data)
        numPersonas = [...new Set(parsedData.map(d => d.Nombre))].length
        numCharlas = groups(parsedData, d => d.Titulo)
    })

</script>

{#if parsedData.length > 0}
<h3>Así somos</h3>

<div>
    <div>
        <h4>{numPersonas} personas</h4>
        <DistribucionXsexo data={parsedData} />
    </div>
    <div>
        <h4>{numCharlas.length} charlas</h4>
        <div style="display: flex;">
            <AreaChart data={parsedData} chartValue="Tema" />
            <AreaChart data={parsedData} chartValue="Tipo de Organización" />
        </div>
    </div>
</div>


<p>Datos recopilados por <a href="https://observablehq.com/d/450f4d2787da3030">Irene de la Torre</a></p>
{/if}