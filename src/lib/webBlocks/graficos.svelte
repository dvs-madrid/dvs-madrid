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

</script>

{#if parsedData.length > 0}
<h2>Así somos</h2>

<div>
    
    <div>
        <DistribucionXsexo data={parsedData} charlas={numCharlas.length} personas={numPersonas} />
    </div>

    <div style="display: flex;flex-direction:column">
        <div style="display: flex;flex-wrap:wrap;align-items: center;margin-top: 4rem">
            <div class="container">
                <p>La temática de las charlas también ha ido variando:</p>
                <div class="values-container">
                    {#each uniqueValues('Tema') as value}
                        <p class="value" style="--accent-color:var(--{colorDict[value] ?? value})">{value}</p>
                    {/each}
                </div>
            </div>
            <div class="container">
                <AreaChart data={parsedData} chartValue="Tema" />
            </div>
        </div>

        <div style="display: flex;flex-wrap:wrap;align-items: center;margin-top: 4rem">
            <div class="container">
                <p>Y la procedencia de los ponentes:</p>
                <div class="values-container">
                    {#each uniqueValues('Tipo de Organización') as value}
                        <p class="value" style="--accent-color:var(--{colorDict[value] ?? value})">{value}</p>
                    {/each}
                </div>
            </div>
            <div class="container">
                <AreaChart data={parsedData} chartValue="Tipo de Organización" />
            </div>
        </div>
    </div>
</div>


<p>Datos recopilados por Irene de la Torre, puedes ver más gráficos en su <a href="https://observablehq.com/d/450f4d2787da3030">notebook de Observable</a></p>
{/if}

<style>
    .values-container {
        display: flex; 
        gap: 10px;
        flex-wrap: wrap;
    }

    .value {
        border: solid 2px var(--accent-color);
        border-radius: 50px;
        padding: .33rem 1rem;
        margin: 0;
        cursor: pointer;
    }
</style>