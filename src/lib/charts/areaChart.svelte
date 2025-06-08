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

	// Funciones helper usando composición más clara
	const quitarDuplicados = (datos) => {
		const agrupados = groups(datos, (d) => d.Titulo);
		return agrupados.map(([_, grupo]) => grupo[0]);
	};

	const crearResumen = (datos, variable) => {
		// Decidir si filtrar duplicados basado en la variable
		const presentaciones = ['Sexo', 'Tipo de Organización'].includes(variable)
			? datos
			: quitarDuplicados(datos);

		// Agrupar por fecha y obtener categorías únicas
		const fechasAgrupadas = flatGroup(presentaciones, (d) => d.Fecha);
		const categorias = [...new Set(datos.map((e) => e[variable]))];

		// Procesar cada fecha para crear datos acumulativos
		const resumenPorFecha = fechasAgrupadas.reduce((acc, [fecha, _]) => {
			const fechaActual = new Date(fecha);
			const presentacionesHastaFecha = presentaciones.filter(
				(e) => new Date(e.Fecha) <= fechaActual
			);

			// Contar por categoría
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

		// Convertir a array y ordenar
		return Object.values(resumenPorFecha).sort((a, b) => a.Fecha - b.Fecha);
	};

	// Estados reactivos usando runes de Svelte 5
	let divWidth = $state(300);
	let porcentaje = $state(false);
	let hoveredData = $state(null);
	let cursorPosition = $state(null);

	// Valores derivados optimizados
	const chartData = $derived(crearResumen(data, chartValue, 'Todos'));
	const keys = $derived([...new Set(data.map((d) => d[chartValue]))]);
	const startingPoint = $derived(chartValue === 'Sexo' ? 50 : 0);
	const stackValue = $derived(porcentaje ? 'Porcentaje' : 'Acumulados');

	// Datos para el stack chart
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

	// Escalas de D3
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

	// Generador de áreas
	const areaGenerator = $derived(
		area()
			.x((d) => xScale(new Date(d.data.fecha)))
			.y0((d) => yScale(d[0]))
			.y1((d) => yScale(d[1]))
			.curve(curveBumpX)
	);

	const meetings = $derived(chartData.map((d) => d.Fecha));

	// Helper para obtener datos en posición del cursor
	const getDataAtPosition = (position) => {
		if (!position || !chartData.length) return null;

		const date = xScale.invert(position);
		const index = bisector((d) => d.Fecha).center(chartData, date);
		return chartData[index] || null;
	};

	// Efecto para actualizar datos hover
	$effect(() => {
		hoveredData = getDataAtPosition(cursorPosition);
	});

	// Manejadores de eventos más limpios
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

	// Helper para formatear fechas
	const formatDate = (date) => {
		return new Intl.DateTimeFormat('es-ES', { dateStyle: 'short' }).format(new Date(date));
	};

	// Helpers para tooltip positioning
	const getTooltipTransform = (fecha) => {
		return xScale(fecha) > 100 ? 'calc(-100% - 10px)' : '10px';
	};

	const getTooltipStyle = (top, left, isTop = false) => {
		const transform = getTooltipTransform(hoveredData.Fecha);
		return `position: absolute; top: ${top}px; left: ${left}px; transform: translateX(${transform})${isTop ? ' translateY(-100%)' : ''}`;
	};
</script>

<div>
	<div class="controls">
		<button class:active={!porcentaje} onclick={() => togglePorcentaje(false)}>
			Número de charlas
		</button>
		<button class:active={porcentaje} onclick={() => togglePorcentaje(true)}>
			Porcentaje de charlas
		</button>
	</div>

	<div class="chart" bind:clientWidth={divWidth}>
		<svg
			style="height: 100%"
			width={divWidth}
			onpointermove={handlePointerMove}
			onpointerout={handlePointerOut}
			overflow="visible"
		>
			<!-- Capas del gráfico de área -->
			<g class="layers">
				{#each stackedData as layer (layer.key)}
					<path
						class="layer"
						d={areaGenerator(layer)}
						style="fill: var(--{colorDict[layer.key] ?? layer.key})"
					/>
				{/each}
			</g>

			<!-- Líneas y etiquetas -->
			<g class="annotations">
				<!-- Línea de referencia del 50% para sexo -->
				{#if porcentaje && chartValue === 'Sexo'}
					<text y={yScale(50)} x="5" alignment-baseline="middle">50%</text>
					<line
						x1="40"
						x2={divWidth}
						y1={yScale(50)}
						y2={yScale(50)}
						stroke="grey"
						stroke-width="2"
						stroke-dasharray="6"
					/>
				{/if}

				<!-- Líneas de fechas de reuniones -->
				{#each meetings as meeting (meeting.getTime())}
					<line
						x1={xScale(meeting)}
						x2={xScale(meeting)}
						y1={0}
						y2={300}
						stroke="white"
						stroke-width="3"
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

			<!-- Tooltip visual en SVG -->
			{#if hoveredData !== null && chartValue === 'Sexo'}
				<g class="tooltip-svg" style="transform: translateX({xScale(hoveredData.Fecha)}px)">
					<line
						x1="0"
						x2="0"
						y2="300"
						y1={yScale(hoveredData[stackValue].Mujer + hoveredData[stackValue].Hombre)}
						stroke="black"
						stroke-width="3"
					/>
					<circle cx="0" cy={yScale(hoveredData[stackValue].Mujer)} r="5" />
					<circle
						cx="0"
						cy={yScale(hoveredData[stackValue].Mujer + hoveredData[stackValue].Hombre)}
						r="5"
					/>
				</g>
			{/if}
		</svg>

		<!-- Tooltip HTML -->
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
	.chart {
		width: 100%;
		height: 350px;
		position: relative;
		padding-top: 2rem;
	}

	.layer {
		transition: d 0.5s ease;
	}

	text {
		font-size: 12px;
	}

	.meeting-label {
		transition: all 0.3s ease;
		font-weight: normal;
		opacity: 1;
	}

	.meeting-label.highlighted {
		font-weight: 900;
		opacity: 1;
	}

	.meeting-label.dimmed {
		opacity: 0.3;
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
		color: #222;
		background-color: rgba(255, 255, 255, 0.9);
		padding: 5px 10px;
		border-radius: 5px;
		backdrop-filter: blur(2px);
		font-size: 13px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		white-space: nowrap;
	}
</style>
