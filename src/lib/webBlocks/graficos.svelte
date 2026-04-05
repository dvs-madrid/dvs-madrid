<script>
	import { ascending } from 'd3';
	import { colorDict } from '$lib/utils/utils';

	import DistribucionXsexo from '$lib/charts/distribucionXsexo.svelte';
	import AreaChart from '$lib/charts/areaChart.svelte';

	let { data } = $props();

	function uniqueValues(column) {
		return [...new Set(data.map((d) => d[column]).sort((a, b) => ascending(a, b)))];
	}

	let selectedValue = $state(undefined);
</script>

{#snippet stackedCharts(type)}
	<div class="stacked-row">
		<div class="container">
			<h3 class="chart-label">
				{type === 'Tema' ? 'Charlas según temática:' : 'Charlas según ponente:'}
			</h3>
			<div class="values-container">
				{#each uniqueValues(type) as value}
					<button
						class="value"
						style="--accent-color:var(--{colorDict[value] ?? value})"
						onclick={() => (selectedValue = value)}
					>
						<span class="color-dot" style="background-color:var(--{colorDict[value] ?? value})"
						></span>
						{value}
					</button>
				{/each}
			</div>
		</div>
		<div class="container">
			<AreaChart {data} chartValue={type} {selectedValue} />
		</div>
	</div>
{/snippet}

<h2>Así somos</h2>
<h3>Charlas por género</h3>
<div>
	<DistribucionXsexo {data} />
	<div class="charts-stack">
		{@render stackedCharts('Tema')}
		{@render stackedCharts('Tipo de Organización')}
	</div>
</div>

<p class="attribution">
	Datos recopilados por Irene de la Torre, puedes ver más gráficos en su <a
		href="https://observablehq.com/d/450f4d2787da3030">notebook de Observable</a
	>
</p>

<style>
	.attribution a {
		text-decoration: underline;
		color: var(--dvs-purple);
	}

	.attribution a:hover {
		color: var(--dvs-dark-purple);
	}

	.attribution {
		font-size: 0.875rem;
		color: var(--grey);
	}

	.charts-stack {
		display: flex;
		flex-direction: column;
	}

	.stacked-row {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		margin-top: 5rem;
		align-self: stretch;
		gap: 2.5rem;
	}

	.charts-stack .container {
		gap: 0;
	}


	.values-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.4rem 0.6rem;
		margin-bottom: 1rem;
	}

	.value {
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.color-dot {
		height: 10px;
		width: 10px;
		display: inline-block;
		border-radius: 50%;
		flex-shrink: 0;
		border: 1px solid rgba(0, 0, 0, 0.4);
	}
</style>
