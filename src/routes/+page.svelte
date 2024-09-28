<script>
    import { onMount } from 'svelte';
    import archieml from 'archieml';
	import ProxEvento from '../lib/proxEvento.svelte';
    import Videos from '../lib/videos.svelte';
    import Graficos from '../lib/graficos.svelte';

    let text = {};
    let ready = false

    onMount(async () => {
        const response = await fetch('text.txt');
        const archieFile = await response.text();
        text = archieml.load(archieFile);
        console.log(text);

        ready = true
    });
</script>

<main>
    {#if ready}
        <div>
            <h1>{text.titulo}</h1>
            <p>{text.subtitulo}</p>
        </div>

        <ProxEvento date={text.prox}/>
        <Videos videos={text.videos} />
        <Graficos data={text.data} />
        

    {:else}
        <div><h1>Cargando...</h1></div>
    {/if}
</main>

<style>
    * {
        font-family: sans-serif;
    }

    * :global(h4) {
        margin-bottom: 0;
        padding-bottom: 5px;
        border-bottom: 2px solid #eee
    }

    main {
        width: 100%;
        max-width: 920px;
        margin: auto
    }
</style>