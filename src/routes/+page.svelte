<script>
	let { data } = $props();

	import './global.css';

	import ProxEvento from '$lib/webBlocks/proxEvento.svelte';
	import Charlas from '$lib/webBlocks/charlas.svelte';
	import Graficos from '$lib/webBlocks/graficos.svelte';
	import Personas from '$lib/webBlocks/personas.svelte';
	import Recursos from '$lib/webBlocks/recursos.svelte';
</script>

<main>
	<header class="hero">
		<div class="hero-badge">Data Visualization Society</div>
		<h1>DVS Madrid</h1>
		<div class="subtitle">
			<p>
				Esta es la página del grupo de <strong>visualización de datos de Madrid</strong>. Aquí
				puedes enterarte de las últimas charlas y de la próxima. Además también podrás encontrar
				información sobre nosotros y recursos interesantes relacionados con la visualización de
				datos.
			</p>
			<p>
				Para estar al día de las próximas charlas o proponer una puedes <a
					href="https://www.datavisualizationsociety.org/slack-community"
					>unirte a nuestro grupo de Slack de la Data Visualization Society</a
				>. Si echas en falta a alguna <strong>persona</strong> en el listado o quieres añadir
				cualquier
				<strong>recurso</strong>
				a la página puedes hacer una Pull Request en
				<a href="https://github.com/dvs-madrid/dvs-madrid" target="_blank">GitHub</a>
				o contactarme por <a href="https://x.com/adrimaqueda" target="_blank">Twitter/X</a> o
				<a href="https://bsky.app/profile/adrimaqueda.com" target="_blank">Bluesky</a>.
			</p>
		</div>
	</header>

	<ProxEvento date={data.prox.date} link={data.prox.link} />
	<Charlas charlas={data.charlas.map((d, i) => ({ ...d, id: i }))} />
	<Graficos data={data.graficos} />
	<Personas personas={data.personas} />
	<Recursos recursos={data.recursos} />

	<footer>
		<p>
			Hecho con Svelte por la comunidad de DVS Madrid &middot;
			<a href="https://github.com/dvs-madrid/dvs-madrid" target="_blank">GitHub</a>
		</p>
	</footer>
</main>

<style>
	main {
		max-width: 920px;
		margin: auto;
		padding-bottom: 3rem;
	}

	@media (width <= 930px) {
		main {
			margin: 0 16px;
		}
	}

	.hero {
		padding-top: 5rem;
		padding-bottom: 1rem;
	}

	.hero-badge {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #7b46d9;
		background: #f0e8ff;
		padding: 0.3rem 0.8rem;
		border-radius: 50px;
		margin-bottom: 1rem;
	}

	.subtitle a {
		text-decoration: underline;
		font-weight: 600;
		color: #5258b5;
	}

	.subtitle a:hover {
		color: #7b46d9;
	}

	footer {
		text-align: center;
		padding: 3rem 0 1rem;
		border-top: 1px solid #e8e8ee;
		margin-top: 3rem;
	}

	footer p {
		font-size: 0.85rem;
		color: #9b9db5;
	}

	footer a {
		color: #9b9db5;
		text-decoration: underline;
	}
</style>
