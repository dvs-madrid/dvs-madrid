<script>
	let { data } = $props();

	import './global.css';

	import { onMount } from 'svelte';

	import archieml from 'archieml';

	import ProxEvento from '$lib/webBlocks/proxEvento.svelte';
	import Charlas from '$lib/webBlocks/charlas.svelte';
	import Graficos from '$lib/webBlocks/graficos.svelte';
	import Personas from '$lib/webBlocks/personas.svelte';
	import Recursos from '$lib/webBlocks/recursos.svelte';

	let text = $state(undefined);
	let ready = $state(false);

	onMount(async () => {
		const response = await fetch('data.txt');
		const archieFile = await response.text();
		text = archieml.load(archieFile);

		ready = true;
	});
</script>

<main>
	{#if ready}
		<div style="margin-top: 100px">
			<h1>📊 DVS Madrid</h1>
			<div class="subtitle">
				<p>
					Esta es la página del grupo de <b>visualización de datos de Madrid</b>. Aquí puedes
					enterarte de las últimas charlas y de la próxima. Además también podrás encontrar
					información sobre nosotros y recursos interesantes relacionados con la visualización de
					datos.
				</p>
				<p>
					Para estar al día de las próximas charlas o proponer una puedes <a
						style="font-weight: bold;"
						href="https://www.datavisualizationsociety.org/slack-community"
						>unirte a nuestro grupo de Slack de la Data Visualization Society</a
					>. Si echas en falta a alguna <b>persona</b> en el listado o quieres añadir cualquier
					<b>recurso</b>
					a la página puedes hacer una Pull Request en
					<a href="https://github.com/dvs-madrid/dvs-madrid" target="_blank">GitHub</a>
					o contactarme por <a href="https://x.com/adrimaqueda" target="_blank">Twitter/X</a> o
					<a href="https://bsky.app/profile/adrimaqueda.com" target="_blank">Bluesky</a>.
				</p>
			</div>
		</div>

		<ProxEvento date={text.prox.date} link={text.prox.link} />
		<Charlas charlas={data.charlas} />
		<Graficos data={data.graficos} />
		<Personas personas={text.personas} />
		<Recursos recursos={text.recursos} />
	{:else}
		<div><h1>Cargando...</h1></div>
	{/if}
</main>

<style>
	main {
		max-width: 920px;
		margin: auto;
	}

	@media (width <= 930px) {
		main {
			margin: 10px;
		}
	}

	.subtitle a {
		text-decoration: underline;
	}
</style>
