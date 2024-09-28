<script>
    export let data;

    import { csvParse } from "d3";
	import { onMount } from "svelte";

    let parsedData = []

    onMount(async () => {
        parsedData = await csvParse(data)
    })

</script>

{#if parsedData.length > 0}
<h3>Así somos</h3>


<p>Datos recopilados por <a href="https://observablehq.com/d/450f4d2787da3030">Irene de la Torre</a></p>
{/if}