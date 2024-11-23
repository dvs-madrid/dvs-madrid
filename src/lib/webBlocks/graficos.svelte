<script>

    import { csvParse, groups, ascending } from "d3";
	import { onMount } from "svelte";
    import { colorDict } from '$lib/utils/utils'

    import DistribucionXsexo from '$lib/charts/distribucionXsexo.svelte';
    import AreaChart from "../charts/areaChart.svelte";

    let { data } = $props();

    let parsedData = $state([])
    let numCharlas = $state(0)
    let numPersonas = $state(0)

    onMount(async () => {
        parsedData = await csvParse(data)
        numPersonas = [...new Set(parsedData.map(d => d.Nombre))].length
        numCharlas = groups(parsedData, d => d.Titulo)
    })

    function uniqueValues(column) {
        return [...new Set(parsedData.map(d => d[column]).sort((a,b) => ascending(a,b)))]
    }

    let selectedValue = $state(undefined)

</script>

<!-- code block -->
{#snippet stackedCharts(type)}
 <div style="display: flex;flex-wrap:wrap;align-items: center;margin-top: 4rem">
     <div class="container">
         <!-- <p>La temática de las charlas también ha ido variando:</p> -->
         <div class="values-container">
             {#each uniqueValues(type) as value}
                 <p class="value" style="--accent-color:var(--{colorDict[value] ?? value})" onclick={() => selectedValue = value} >
                    <span style="background-color:var(--{colorDict[value] ?? value});height:1cap;width:1cap;display:inline-block"></span>
                    {value}
                </p>
             {/each}
         </div>
     </div>
     <div class="container">
         <AreaChart data={parsedData} chartValue={type} {selectedValue} />
     </div>
 </div>
{/snippet}


{#if parsedData.length > 0}
<h2>Así somos</h2>

<div>

    <div>
        <DistribucionXsexo data={parsedData} charlas={numCharlas.length} personas={numPersonas} />
    </div>

    <div style="display: flex;flex-direction:column">

    	{@render stackedCharts('Tema') }
     	{@render stackedCharts('Tipo de Organización') }

    </div>
</div>


<p>Datos recopilados por Irene de la Torre, puedes ver más gráficos en su <a href="https://observablehq.com/d/450f4d2787da3030">notebook de Observable</a></p>
{/if}

<style>
    a {
    	text-decoration: underline;
    }

    .container
</style>
