<script>
	let { charlas } = $props();
	import { colorDict } from '$lib/utils/utils';

	let cursos = [...new Set(charlas.map((d) => d.curso))].sort();
	let selectedCurso = $state('24-25');

	let activeCharlas = $derived(charlas.filter((d) => d.curso === selectedCurso));
</script>

<div style="display: flex; flex-direction: column; gap: 1rem;margin-bottom: 50px">
	<h2>De qué hemos hablado</h2>

	<div>
		<p>
			Curso:
			{#each cursos as curso}
				<button onclick={() => (selectedCurso = curso)} class:active={selectedCurso === curso}
					>{curso}</button
				>
			{/each}
		</p>
	</div>

	<ul>
		{#each activeCharlas as charla}
			<li>
				{#if charla.link}
					<a href={charla.link} target="_blank"
						>{charla.titulo}
						<span
							class="tema {charla.tema}"
							style="background-color: var(--{colorDict[charla.tema] ?? charla.tema})"
							>{charla.tema}</span
						>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 576 512"
							fill="red"
							style="margin-left: 5px;margin-bottom: -2px;"
							><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
							/></svg
						>
					</a>
				{:else}
					{charla.titulo}
					<span
						class="tema {charla.tema}"
						style="background-color: var(--{colorDict[charla.tema] ?? charla.tema})"
						>{charla.tema}</span
					>
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	a:hover {
		text-decoration-color: red;
	}

	button {
		margin: 0 0.25rem;
	}

	.tema {
		padding: 3px 10px;
		border-radius: 50px;
		font-size: 80%;
		color: #eeeeee;
	}

	.tema.Producto {
		color: #666;
	}

	.tema.Diseño,
	.tema.ONG {
		color: #444;
	}
</style>
