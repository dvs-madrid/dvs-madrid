<script>
	import {
		flatGroup,
		groups,
		area,
		stack,
		scaleLinear,
		scaleTime,
		max,
		extent,
		bisector,
		curveBumpX
	} from 'd3';
	import { colorDict } from '$lib/utils/utils';

	let { data, chartValue } = $props();

	const quitarDuplicados = (datos) => {
		const agrupados = groups(datos, (d) => d.Titulo);
		return agrupados.map(([_, grupo]) => grupo[0]);
	};

	const crearResumen = (datos, variable) => {
		const presentaciones = ['Sexo', 'Tipo de Organización'].includes(variable)
			? datos
			: quitarDuplicados(datos);

		const fechasAgrupadas = flatGroup(presentaciones, (d) => d.Fecha);
		const categorias = [...new Set(datos.map((e) => e[variable]))];

		const resumenPorFecha = fechasAgrupadas.reduce((acc, [fecha, _]) => {
			const fechaActual = new Date(fecha);
			const presentacionesHastaFecha = presentaciones.filter(
				(e) => new Date(e.Fecha) <= fechaActual
			);

			const conteosPorCategoria = flatGroup(presentacionesHastaFecha, (e) => e[variable]);
			const acumulados = categorias.reduce((catAcc, categoria) => {
				const grupo = conteosPorCategoria.find(([cat]) => cat === categoria);
				catAcc[categoria] = grupo ? grupo[1].length : 0;
				return catAcc;
			}, {});

			const totalPonentes = presentacionesHastaFecha.length;

			acc[fecha] = {
				Fecha: fechaActual,
				Acumulados: acumulados,
				Total: totalPonentes,
				Porcentaje: Object.fromEntries(
					Object.entries(acumulados).map(([key, value]) => [
						key,
						totalPonentes ? (value / totalPonentes) * 100 : 0
					])
				)
			};

			return acc;
		}, {});

		return Object.values(resumenPorFecha).sort((a, b) => a.Fecha - b.Fecha);
	};

	let divWidth = $state(300);
	let porcentaje = $state(false);
	let hoveredData = $state(null);
	let cursorPosition = $state(null);

	const chartData = $derived(crearResumen(data, chartValue, 'Todos'));
	const keys = $derived([...new Set(data.map((d) => d[chartValue]))]);
	const startingPoint = $derived(chartValue === 'Sexo' ? 50 : 0);
	const stackValue = $derived(porcentaje ? 'Porcentaje' : 'Acumulados');

	const stackedData = $derived(
		stack().keys(keys)(
			chartData.map((d) => ({
				fecha: d.Fecha,
				...keys.reduce((acc, key) => {
					acc[key] = d[stackValue][key] || 0;
					return acc;
				}, {})
			}))
		)
	);

	const xScale = $derived(
		scaleTime()
			.domain(extent(data, (d) => new Date(d.Fecha)))
			.range([startingPoint, divWidth - 5])
	);

	const yScale = $derived(
		scaleLinear()
			.domain([
				0,
				stackedData.length > 0 ? max(stackedData[stackedData.length - 1], (d) => d[1]) : 100
			])
			.range([300, 5])
	);

	const areaGenerator = $derived(
		area()
			.x((d) => xScale(new Date(d.data.fecha)))
			.y0((d) => yScale(d[0]))
			.y1((d) => yScale(d[1]))
			.curve(curveBumpX)
	);

	const meetings = $derived(chartData.map((d) => d.Fecha));

	const getDataAtPosition = (position) => {
		if (!position || !chartData.length) return null;

		const date = xScale.invert(position);
		const index = bisector((d) => d.Fecha).center(chartData, date);
		return chartData[index] || null;
	};

	$effect(() => {
		hoveredData = getDataAtPosition(cursorPosition);
	});

	const handlePointerMove = (event) => {
		if (chartValue === 'Sexo') {
			cursorPosition = event.layerX;
		}
	};

	const handlePointerOut = () => {
		cursorPosition = null;
	};

	const togglePorcentaje = (valor) => {
		porcentaje = valor;
	};

	const formatDate = (date) => {
		return new Intl.DateTimeFormat('es-ES', { dateStyle: 'short' }).format(new Date(date));
	};

	const getTooltipTransform = (fecha) => {
		return xScale(fecha) > 100 ? 'calc(-100% - 10px)' : '10px';
	};

	const getTooltipStyle = (top, left, isTop = false) => {
		const transform = getTooltipTransform(hoveredData.Fecha);
		return `position: absolute; top: ${top}px; left: ${left}px; transform: translateX(${transform})${isTop ? ' translateY(-100%)' : ''}`;
	};
</script>

<div class="chart-wrapper">
	<div class="controls">
		<button class:active={!porcentaje} onclick={() => togglePorcentaje(false)}> Cantidad </button>
		<button class:active={porcentaje} onclick={() => togglePorcentaje(true)}> Porcentaje </button>
	</div>

	<div class="chart" bind:clientWidth={divWidth}>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<svg
			style="height: 100%"
			width={divWidth}
			onpointermove={handlePointerMove}
			onpointerout={handlePointerOut}
			overflow="visible"
		>
			<g class="layers">
				{#each stackedData as layer (layer.key)}
					<path
						class="layer"
						d={areaGenerator(layer)}
						style="fill: var(--{colorDict[layer.key] ?? layer.key})"
					/>
				{/each}
			</g>

			<g class="annotations">
				{#if porcentaje && chartValue === 'Sexo'}
					<text y={yScale(50)} x="5" alignment-baseline="middle" class="ref-label">50%</text>
					<line
						x1="40"
						x2={divWidth}
						y1={yScale(50)}
						y2={yScale(50)}
						stroke="#9b9db5"
						stroke-width="1.5"
						stroke-dasharray="4 3"
					/>
				{/if}

				{#each meetings as meeting (meeting.getTime())}
					<line
						x1={xScale(meeting)}
						x2={xScale(meeting)}
						y1={0}
						y2={300}
						stroke="white"
						stroke-width="2.5"
					/>
					<text
						x={xScale(meeting)}
						y={320}
						alignment-baseline="baseline"
						text-anchor={xScale(meeting) < 20
							? 'start'
							: xScale(meeting) > divWidth - 20
								? 'end'
								: 'middle'}
						class="meeting-label"
						class:highlighted={hoveredData?.Fecha === meeting}
						class:dimmed={hoveredData !== null && hoveredData?.Fecha !== meeting}
					>
						{formatDate(meeting)}
					</text>
				{/each}
			</g>

			{#if hoveredData !== null && chartValue === 'Sexo'}
				<g class="tooltip-svg" style="transform: translateX({xScale(hoveredData.Fecha)}px)">
					<line
						x1="0"
						x2="0"
						y2="300"
						y1={yScale(hoveredData[stackValue].Mujer + hoveredData[stackValue].Hombre)}
						stroke="#1a1c2e"
						stroke-width="2"
					/>
					<circle cx="0" cy={yScale(hoveredData[stackValue].Mujer)} r="4" fill="#1a1c2e" />
					<circle
						cx="0"
						cy={yScale(hoveredData[stackValue].Mujer + hoveredData[stackValue].Hombre)}
						r="4"
						fill="#1a1c2e"
					/>
				</g>
			{/if}
		</svg>

		{#if hoveredData !== null && chartValue === 'Sexo'}
			<div class="tooltip-container">
				<div
					class="tooltip-text"
					style={getTooltipStyle(
						yScale(hoveredData[stackValue].Mujer) + 5,
						xScale(hoveredData.Fecha)
					)}
				>
					{Math.round(hoveredData[stackValue].Mujer)}{porcentaje ? '%' : ''}
				</div>

				<div
					class="tooltip-text"
					style={getTooltipStyle(
						yScale(hoveredData[stackValue].Mujer + hoveredData[stackValue].Hombre) - 5,
						xScale(hoveredData.Fecha),
						true
					)}
				>
					{Math.round(hoveredData[stackValue].Hombre)}{porcentaje ? '%' : ''}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.chart-wrapper {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
		align-self: stretch;
	}

	.controls {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.chart {
		width: 100%;
		height: 350px;
		position: relative;
	}

	.layer {
		transition: d 0.5s ease;
		opacity: 1;
		stroke: black;
		stroke-width: 0.5px;
		-index: -10;
	}

	.layer:hover {
		opacity: 1;
		z-index: 10;
	}

	text {
		font-size: 11px;
		font-family: 'Inter', system-ui, sans-serif;
	}

	.ref-label {
		fill: #9b9db5;
		font-weight: 500;
	}

	.meeting-label {
		transition: all 0.25s ease;
		color: var(--grey);
		font-weight: 400;
		line-height: 20px;
		font-size: 0.875rem;
		opacity: 0.5;
	}

	.meeting-label.highlighted {
		font-weight: 800;
		opacity: 1;
		fill: var(--black);
		font-size: 1rem;
		stroke: var(--white);
		paint-order: stroke fill !important;
		stroke-width: 5px;
	}

	.meeting-label.dimmed {
		opacity: 0.25;
	}

	.tooltip-svg {
		pointer-events: none;
	}

	.tooltip-container {
		position: absolute;
		height: calc(100% - 2rem - 50px);
		width: 100%;
		bottom: 50px;
		pointer-events: none;
	}

	.tooltip-text {
		color: #1a1c2e;
		background-color: rgba(255, 255, 255, 0.92);
		padding: 4px 10px;
		border-radius: 6px;
		backdrop-filter: blur(4px);
		font-size: 12px;
		font-weight: 600;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		white-space: nowrap;
	}
</style>
