<script>
	let { charlas } = $props();
	import { colorDict } from '$lib/utils/utils';
	import { fly } from 'svelte/transition';

	let cursos = $derived([...new Set(charlas.map((d) => d.curso))].sort());
	let selectedCurso = $state('25-26');

	let activeCharlas = $derived(charlas.filter((d) => d.curso === selectedCurso));
</script>

{#snippet tituloCompleto(charla)}
	<div class="inline charla">
		<div class="wrapper-tema">
			<p
				class="tema {charla.tema}"
				style="background-color: var(--{colorDict[charla.tema] ?? charla.tema}, #aaa)"
			>
				{charla.tema}
			</p>
		</div>
		{#if charla.link}
			<a href={charla.link} target="_blank" rel="noopener" class="charla-text">
				<span class="charla-titulo">{charla.titulo}</span>
				<span class="charla-ponentes">{charla.ponentes}</span>
				<svg
					class="yt-icon"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 576 512"
					fill="#e44"
					aria-label="Ver en YouTube"
					><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
						d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
					/></svg
				>
			</a>
		{:else}
			<p class="charla-text">
				<span class="charla-titulo">{charla.titulo}</span>
				<span class="charla-ponentes">{charla.ponentes}</span>
			</p>
		{/if}
	</div>
{/snippet}

<section class="charlas-section">
	<h2>De qué hemos hablado</h2>

	<div class="filters">
		<span class="filter-label">Curso:</span>
		{#each cursos as curso (curso)}
			<button onclick={() => (selectedCurso = curso)} class:active={selectedCurso === curso}
				>{curso}</button
			>
		{/each}
	</div>

	<ul>
		{#each activeCharlas as charla, i (charla.id)}
			<li in:fly={{ y: 30, delay: i * 60, duration: 300 }}>
				{@render tituloCompleto(charla)}
			</li>
		{/each}
	</ul>
</section>

<style>
	.charlas-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.filters {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		padding: 0 0.125rem;
	}

	.filter-label {
		color: var(--grey);
		font-size: 1.125rem;
	}

	.charla {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 0.5rem;
		align-self: stretch;
	}

	.charla-text {
		margin-right: 0.5rem;
	}

	.charla-titulo {
		font-weight: 700;
	}

	.charla-ponentes {
		color: var(--black);
	}

	.charla-ponentes::before {
		content: '(';
	}

	.charla-ponentes::after {
		content: ')';
	}

	a.charla-text {
		text-decoration: none;
		color: inherit;
	}

	a.charla-text:hover {
		text-decoration: underline;
		text-decoration-color: #e44;
	}

	.yt-icon {
		height: 0.9em;
		width: auto;
		margin-left: 4px;
		vertical-align: -0.05em;
		opacity: 0.7;
		transition: opacity 0.2s;
	}

	a.charla-text:hover .yt-icon {
		opacity: 1;
	}

	.wrapper-tema {
		min-width: 10.6rem;
		display: flex;
		justify-content: flex-end;
	}

	.tema {
		display: inline-block;
		padding: 0.1875rem 0.5rem;
		border-radius: var(--radius-nonui);
		border: 1px solid rgba(0, 0, 0, 0.3);
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 700;
		color: var(--black);
		vertical-align: middle;
	}

	.tema.Programación,
	.tema.Diseño {
		color: var(--white);
	}

	button {
		margin: 0;
	}

	@media (width < 600px) {
		.charla {
			flex-direction: column;
		}

		.wrapper-tema {
			min-width: auto !important;
		}

		.wrapper-tema .tema {
			margin-bottom: 0;
		}

		.charla .charla-text {
			margin-bottom: 2rem !important;
			margin-right: 0;
		}
	}
</style>
