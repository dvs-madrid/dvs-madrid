<script>
    import './global.css';

    import { onMount } from 'svelte';

    import archieml from 'archieml';

	import ProxEvento from '$lib/webBlocks/proxEvento.svelte';
    import Charlas from '$lib/webBlocks/charlas.svelte';
    import Graficos from '$lib/webBlocks/graficos.svelte';
    import Personas from '$lib/webBlocks/personas.svelte';
    import Recursos from '$lib/webBlocks/recursos.svelte';

    let text = {};
    let ready = false

    onMount(async () => {
        const response = await fetch('data.txt');
        const archieFile = await response.text();
        text = archieml.load(archieFile);
        console.log(text);

        ready = true
    });
</script>

<main>
    {#if ready}
        <div style="margin-top: 100px">
            <h1>📊 {text.titulo}</h1>
            <p>{text.subtitulo}</p>
        </div>

        <ProxEvento date={text.prox}/>
        <Charlas charlas={text.charlas} />
        <Graficos data={text.data} />
        <Personas personas={text.personas} />
        <Recursos recursos={text.recursos} />
        

        <!-- footer -->
        <div>
            GitHub
        </div>

    {:else}
        <div><h1>Cargando...</h1></div>
    {/if}
</main>

<style>
    main {
        width: 100%;
        max-width: 920px;
        margin: auto
    }
</style>