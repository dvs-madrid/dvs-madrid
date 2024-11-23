<script>
	import { onMount } from "svelte";
    import { groups } from "d3";

    import AreaChart from "$lib/charts/areaChart.svelte";

    let { data, charlas, personas } = $props();

    let ready = $state(false)
    let globalDistribution = $state(undefined)
    let meetingDistribution = undefined

    onMount( async () => {
        globalDistribution = groups(data, d => d.Sexo).map(d => ({
            genero: d[0],
            count: d[1].length,
            percent: d[1].length / data.length * 100
        }))

        meetingDistribution = groups(data, d => d.Fecha).map(d => ({
            meeting: d[0],
            resumen: groups(d[1], d => d.Sexo).map(x => ({
                genero: x[0],
                count: x[1].length,
                percent: x[1].length / d[1].length * 100
            })).sort((a,b) => b.genero.localeCompare(a.genero))
        }))

        ready = true
    })
</script>


<div style="display: flex; flex-wrap:wrap">
{#if ready}

<!-- global distribution -->
<div class="container">
    <p>Desde que empezamos hemos realizado {charlas} charlas y han presentado {personas} personas diferentes. El porcentaje de presentadores según su sexo se queda así:</p>
    <div style="height: 300px;display:flex;align-items: flex-end; justify-content: space-evenly">
        {#each globalDistribution as sex}
        <div class="column">
            <div style="height: {sex.percent}%; width: 100px;background-color:var(--{sex.genero})">
                <p class="percent">{Math.round(sex.percent)}%</p>
            </div>
            <p style="margin-top:1rem">{sex.genero}</p>
        </div>
        {/each}
    </div>
</div>

<div class="container">
    <p>Pero la proporción no ha sido siempre igual, sino que ha ido evolucionando en cada meetup:</p>
    <!-- distribution by meeting -->
    <AreaChart {data} chartValue="Sexo" />
</div>

{/if}
</div>


<style>

    .column {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .column p {
        text-align: center;
        margin: 0;
        padding: 0;
    }

    .percent {
        position: relative;
        top: -20px;

    }
</style>
