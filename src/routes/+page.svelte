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
	<header class="hero inline">
		<div class="hero-badge">Conecta con fans de la visualización de datos</div>
		<h1>Data Visualization Society <span class="accent">Madrid</span></h1>
		<div class="subtitle">
			<p>
				Bienvenidos a la página del grupo de
				<strong>visualización de datos de Madrid</strong> (comúnmente conocido también como DVS Madrid).
				Aquí puedes enterarte de nuestros próximos eventos o saber más de las charlas que hemos organizado.
				También podrás encontrar información sobre nosotros y recursos interesantes relacionados con gráficos,
				infografía o datos.
			</p>
		</div>
	</header>

	<ProxEvento date={data.prox.date} link={data.prox.link} />
	<div class="inline">
		<p>
			Para estar al día de las próximas charlas o proponer una puedes <a
				href="https://www.datavisualizationsociety.org/slack-community"
				>unirte a nuestro grupo de Slack de la Data Visualization Society</a
			>. Si echas en falta a alguna <strong>persona</strong> en el listado o quieres añadir
			cualquier
			<strong>recurso</strong>
			a la página puedes hacer una Pull Request en
			<a href="https://github.com/dvs-madrid/dvs-madrid" target="_blank">GitHub</a>
			o contactarnos por <a href="https://x.com/adrimaqueda" target="_blank">Twitter/X</a> o
			<a href="https://bsky.app/profile/adrimaqueda.com" target="_blank">Bluesky</a>.
		</p>
	</div>
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
		max-width: var(--max-fullwidth);
		margin: auto;
		padding-bottom: 3rem;
	}

	@media (width <= 930px) {
		main {
			margin: 0 16px;
		}
	}

	.inline {
		width: 100%;
		max-width: var(--max-inline);
	}

	.hero {
		padding-top: 5rem;
		padding-bottom: 1rem;
	}

	.hero-badge {
		display: inline-block;
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 16px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--grey);
		margin-bottom: 1rem;
	}

	h1 .accent {
		color: var(--dvs-green);
		font-style: italic;
		font-weight: 400;
	}

	.subtitle a {
		text-decoration: underline;
	}

	.subtitle a:hover {
		color: var(--dvs-dark-purple);
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
