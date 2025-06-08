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

	let years = ['En total', ...[...new Set(data.map((d) => d.Curso))].reverse()];
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

<div style="display: flex; flex-wrap:wrap">
	{#if ready}
		<!-- global distribution -->
		<div class="container">
			<div
				style="display: flex;align-items:center;justify-content: center;column-gap:10px;margin-top:1rem"
			>
				{#each years as year}
					<button class={[selectedYear === year && 'active']} onclick={() => (selectedYear = year)}
						>{year}</button
					>
				{/each}
			</div>
			<p>
				{text} hemos realizado <b>{yearRecount.charlas} charlas</b> y han presentado
				<b>{yearRecount.ponentes} personas diferentes</b>. El porcentaje de ponentes se queda así:
			</p>
			<div style="height: 300px;display:flex;align-items: flex-end; justify-content: space-evenly">
				{#each genderDistribution as sex}
					<div class="column">
						<div
							style="height: {sex.percent}%; width: 100px;background-color:var(--{sex.genero});transition:all .3s"
						>
							<p class="percent">{Math.round(sex.percent)}%</p>
						</div>
						<p style="margin-top:1rem">{sex.genero}</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="container">
			<p>
				Pero la proporción no ha sido siempre igual, sino que ha ido evolucionando en cada meetup:
			</p>
			<!-- distribution by meeting -->
			<AreaChart {data} chartValue="Sexo" />
		</div>
	{/if}
</div>

<style>
	.column {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.column p {
		text-align: center;
		margin: 0;
		padding: 0;
	}

	.percent {
		position: relative;
		top: -20px;
	}
</style>
