<script>
	import { onMount } from 'svelte';
	import { ascending, groups } from 'd3';

	import AreaChart from '$lib/charts/areaChart.svelte';

	let { data } = $props();

	let ready = $state(false);
	let meetingDistribution = $state(undefined);
	let plot = $state(null);

	onMount(async () => {
		meetingDistribution = groups(data, (d) => d.Fecha).map((d) => ({
			meeting: d[0],
			resumen: groups(d[1], (d) => d.Sexo)
				.map((x) => ({
					genero: x[0],
					count: x[1].length,
					percent: (x[1].length / d[1].length) * 100
				}))
				.sort((a, b) => b.genero.localeCompare(a.genero))
		}));

		plot = meetingDistribution.map((d) => ({
			fecha: d.meeting
		}));

		ready = true;
	});

	let years = $derived(['En total', ...[...new Set(data.map((d) => d.Curso))].reverse()]);
	let selectedYear = $state('En total');

	let genderDistribution = $derived.by(() => {
		let yearData =
			selectedYear === 'En total' ? data : data.filter((d) => d.Curso === selectedYear);

		return groups(yearData, (d) => d.Sexo)
			.map((d) => ({
				genero: d[0],
				count: d[1].length,
				percent: (d[1].length / yearData.length) * 100
			}))
			.sort((a, b) => ascending(a.genero, b.genero));
	});

	let yearRecount = $derived.by(() => {
		let yearData =
			selectedYear === 'En total' ? data : data.filter((d) => d.Curso === selectedYear);

		let charlas = [...new Set(yearData.map((d) => d.Titulo))].length;
		let ponentes = [...new Set(yearData.map((d) => d.Nombre))].length;

		return {
			charlas,
			ponentes
		};
	});

	let text = $derived(
		selectedYear === 'En total' ? 'Desde que empezamos' : `En el curso ${selectedYear}`
	);
</script>

<div class="gender-section">
	{#if ready}
		<div class="row">
			<div class="container">
				<p class="summary">
					{text} hemos realizado <strong>{yearRecount.charlas} charlas</strong> y han presentado
					<strong>{yearRecount.ponentes} personas diferentes</strong>. El porcentaje de ponentes se
					queda así:
				</p>
				<div class="year-filters">
					{#each years as year (year)}
						<button
							class={[selectedYear === year && 'active']}
							onclick={() => (selectedYear = year)}>{year}</button
						>
					{/each}
				</div>
				<div class="bar-chart">
					{#each genderDistribution as sex (sex.genero)}
						<div class="column">
							<div
								class="bar"
								style="height: {sex.percent}%; background-color: var(--{sex.genero})"
							>
								<p class="percent">{Math.round(sex.percent)}%</p>
							</div>
							<p class="bar-label">{sex.genero}</p>
						</div>
					{/each}
				</div>
			</div>

			<div class="container">
				<p class="summary">
					Pero la proporción no ha sido siempre igual, sino que ha ido evolucionando en cada meetup:
				</p>
				<AreaChart {data} chartValue="Sexo" />
			</div>
		</div>
	{/if}
</div>

<style>
	.gender-section {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.year-filters {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		padding: 0 0 2rem 0;
	}

	.summary {
		margin-bottom: 0;
	}

	.bar-chart {
		height: 200px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		gap: 24px;
		align-self: stretch;
	}

	.column {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}

	.bar {
		width: 80px;
		border-radius: 6px 6px 0 0;
		transition: height 0.4s ease;
		position: relative;
	}

	.column p {
		text-align: center;
		margin: 0;
		padding: 0;
	}

	.percent {
		position: absolute;
		top: -28px;
		left: 0;
		right: 0;
		font-weight: 700;
		color: var(--black);
	}

	.bar-label {
		margin-top: 0.75rem !important;
		color: var(--grey);
		font-weight: 400;
		line-height: 20px;
		font-size: 1rem;
	}
</style>
