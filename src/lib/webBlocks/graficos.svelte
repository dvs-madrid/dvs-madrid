<script>
	import { ascending } from 'd3';
	import { colorDict } from '$lib/utils/utils';

	import DistribucionXsexo from '$lib/charts/distribucionXsexo.svelte';
	import AreaChart from '../charts/areaChart.svelte';

	let { data } = $props();

	function uniqueValues(column) {
		return [...new Set(data.map((d) => d[column]).sort((a, b) => ascending(a, b)))];
	}

	let selectedValue = $state(undefined);
</script>

<!-- code block -->
{#snippet stackedCharts(type)}
	<div style="display: flex;flex-wrap:wrap;align-items: center;margin-top: 4rem">
		<div class="container">
			<p>{type === 'Tema' ? 'Charlas según temática:' : 'Charlas según ponente:'}</p>
			<div class="values-container">
				{#each uniqueValues(type) as value}
					<p
						class="value"
						style="--accent-color:var(--{colorDict[value] ?? value})"
						onclick={() => (selectedValue = value)}
					>
						<span
							style="background-color:var(--{colorDict[value] ??
								value});height:1cap;width:1cap;display:inline-block"
						></span>
						{value}
					</p>
				{/each}
			</div>
		</div>
		<div class="container">
			<AreaChart {data} chartValue={type} {selectedValue} />
		</div>
	</div>
{/snippet}

<h2>Así somos</h2>

<div>
	<div>
		<DistribucionXsexo {data} />
	</div>

	<div style="display: flex;flex-direction:column">
		{@render stackedCharts('Tema')}
		{@render stackedCharts('Tipo de Organización')}
	</div>
</div>

<p>
	Datos recopilados por Irene de la Torre, puedes ver más gráficos en su <a
		href="https://observablehq.com/d/450f4d2787da3030">notebook de Observable</a
	>
</p>

<style>
	a {
		text-decoration: underline;
	}

	.values-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		margin-bottom: 1rem;
	}

	.value {
		margin: 0;
	}
</style>
