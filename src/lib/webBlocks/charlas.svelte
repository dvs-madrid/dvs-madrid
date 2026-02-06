<script>
	let { charlas } = $props();
	import { colorDict } from '$lib/utils/utils';
	import { fly } from 'svelte/transition';

	let cursos = $derived([...new Set(charlas.map((d) => d.curso))].sort());
	let selectedCurso = $state('24-25');

	let activeCharlas = $derived(charlas.filter((d) => d.curso === selectedCurso));
</script>

{#snippet tituloCompleto(charla)}
	<span class="charla-text">
		<span class="charla-titulo">{charla.titulo}</span>
		<span class="charla-ponentes">{charla.ponentes}</span>
	</span>
	<span
		class="tema {charla.tema}"
		style="background-color: var(--{colorDict[charla.tema] ?? charla.tema}, #aaa)"
		>{charla.tema}</span
	>
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
				{#if charla.link}
					<a href={charla.link} target="_blank" class="charla-link">
						{@render tituloCompleto(charla)}
						<svg
							class="yt-icon"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 576 512"
							fill="#e44"
							><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
							/></svg
						>
					</a>
				{:else}
					{@render tituloCompleto(charla)}
				{/if}
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
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.filter-label {
		font-size: 0.85rem;
		font-weight: 500;
		color: #9b9db5;
		margin-right: 0.25rem;
	}

	.charla-link {
		display: inline;
	}

	.charla-link:hover {
		text-decoration-color: #e44;
	}

	.charla-text {
		margin-right: 0.5rem;
	}

	.charla-titulo {
		font-weight: 500;
	}

	.charla-ponentes {
		color: #9b9db5;
	}

	.charla-ponentes::before {
		content: '(';
	}

	.charla-ponentes::after {
		content: ')';
	}

	.yt-icon {
		margin-left: 4px;
		margin-bottom: -2px;
		opacity: 0.7;
		transition: opacity 0.2s;
	}

	.charla-link:hover .yt-icon {
		opacity: 1;
	}

	.tema {
		display: inline-block;
		padding: 2px 10px;
		border-radius: 50px;
		font-size: 0.75rem;
		font-weight: 500;
		color: #eeeeee;
		vertical-align: middle;
	}

	.tema.Producto {
		color: #444;
	}

	.tema.Diseño,
	.tema.ONG {
		color: #333;
	}

	button {
		margin: 0;
	}
</style>
