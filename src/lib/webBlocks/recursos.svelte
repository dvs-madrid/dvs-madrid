<script>
	import { ascending } from 'd3';

	let { recursos } = $props();
</script>

<section class="recursos-section">
	<h2>Recursos para visualizar datos</h2>

	<div class="recursos-grid">
		{#each Object.entries(recursos) as [key, recurso]}
			<div class="recurso-group">
				<h3>{key}</h3>
				<ul>
					{#each recurso.toSorted((a, b) => ascending(a.nombre, b.nombre)) as info}
						{#if info.link}
							<li><a href={info.link} target="_blank">{info.nombre}</a></li>
						{:else}
							<li>{info.nombre}</li>
						{/if}
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<style>
	.recursos-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
		font-size: 1.125rem;
	}

	.recursos-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		column-gap: 1.5rem;
		row-gap: 1rem;
	}

	@media (width < 600px) {
		.recursos-grid {
			grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
		}
	}

	.recurso-group {
		padding: 1rem 0;
	}

	a {
		color: var(--dvs-purple);
		text-decoration: none;
		font-weight: 400;
	}

	a:hover {
		text-decoration: underline;
		color: var(--dvs-dark-purple);
	}
</style>
