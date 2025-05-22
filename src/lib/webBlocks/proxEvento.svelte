<script>
	import { onMount } from 'svelte';
	import { Temporal } from 'temporal-polyfill';

	let { date, link } = $props();

	let fecha = $state('');
	let timeToEvent = $state(undefined);

	function intervalString(interval) {
		if (interval.days <= -1) {
			return undefined;
		} else if (interval.days === 0 && interval.hours <= 0) {
			return 'Está siendo ahora';
		} else if (interval.days === 0) {
			return `Nos vemos en ${interval.hours} horas`;
		} else return `Nos vemos en ${interval.days} días`;
	}

	onMount(async () => {
		let hoy = Temporal.Now.zonedDateTimeISO();
		fecha = Temporal.ZonedDateTime.from(date + 'T17:00:00Z[Europe/Madrid]');

		console.log(hoy.toString(), fecha.toString());

		let interval = fecha.since(hoy, { largestUnit: 'day' });

		timeToEvent = intervalString(interval);
	});
</script>

<div class="date-container">
	<b>🗓️ Próximo evento:</b>
	{#if timeToEvent !== undefined}
		<div style="text-align: center;padding-top:2rem">
			<p class="date">{fecha.toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })}</p>
			<p class="countdown">¡{timeToEvent}!</p>
			<a href={link} class="tickets">Consigue tus entradas aquí 🎟️</a>
		</div>
	{:else}
		<div class="tbd">
			<p>Aún estamos decidiendo la fecha!</p>
			<p>
				Entérete en <a href="https://www.datavisualizationsociety.org/slack-community">Slack</a>
				<span style="display: inline-block;">(#location-madrid)</span>
			</p>
		</div>
	{/if}
</div>

<style>
	.date-container {
		background-color: #f0f0f0;
		padding: 2rem;
	}

	.date,
	.countdown {
		margin-bottom: 3rem;
	}

	.date {
		font-weight: bold;
		font-size: 1.1rem;
	}

	.countdown {
		font-size: 1.5rem;
	}

	.tickets {
		font-size: 1rem;
	}

	.tbd {
		text-align: center;
		padding: 2rem 0;
		font-size: 1.2rem;
	}

	.tbd a {
		text-decoration: underline;
		font-weight: bold;
		color: purple;
	}

	@media (width > 550px) {
		.date-container {
			padding: 3rem;
		}

		.date {
			font-size: 1.25rem;
		}

		.countdown {
			font-size: 1.7rem;
		}

		.tickets {
			font-size: 1.2rem;
		}
	}
</style>
