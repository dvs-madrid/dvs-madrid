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

		let interval = fecha.since(hoy, { largestUnit: 'day' });

		timeToEvent = intervalString(interval);
	});
</script>

<div class="event-card">
	<div class="event-label">Próximo evento</div>
	{#if timeToEvent !== undefined}
		<div class="event-content">
			<p class="date">
				{fecha.toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })}
			</p>
			<p class="countdown">{timeToEvent}</p>
			<a href={link} class="tickets-btn">Consigue tus entradas aquí</a>
		</div>
	{:else}
		<div class="tbd">
			<p>Aún estamos decidiendo la fecha.</p>
			<p>
				Entérate en <a href="https://www.datavisualizationsociety.org/slack-community">Slack</a>
				<span class="channel">(#location-madrid)</span>
			</p>
		</div>
	{/if}
</div>

<style>
	.event-card {
		background: linear-gradient(135deg, #1a1c2e 0%, #2d2f55 100%);
		border-radius: 16px;
		padding: 2.5rem;
		margin-top: 1rem;
		color: white;
	}

	.event-label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 1.5rem;
	}

	.event-content {
		text-align: center;
		padding: 1rem 0;
	}

	.date {
		font-weight: 600;
		font-size: 1.15rem;
		color: white;
		margin-bottom: 0.5rem;
	}

	.countdown {
		font-size: 1.8rem;
		font-weight: 700;
		color: white;
		margin-bottom: 2rem;
		letter-spacing: -0.02em;
	}

	.tickets-btn {
		display: inline-block;
		background: #7b46d9;
		color: white;
		padding: 0.7rem 1.6rem;
		border-radius: 50px;
		font-weight: 600;
		font-size: 0.9rem;
		text-decoration: none;
		transition:
			background 0.25s,
			transform 0.15s,
			box-shadow 0.25s;
	}

	.tickets-btn:hover {
		background: #6a3bbf;
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(123, 70, 217, 0.4);
		text-decoration: none;
	}

	.tbd {
		text-align: center;
		padding: 1.5rem 0;
	}

	.tbd p {
		color: rgba(255, 255, 255, 0.85);
		font-size: 1.1rem;
		margin: 0.5rem 0;
	}

	.tbd a {
		color: #c4a8ff;
		text-decoration: underline;
		font-weight: 600;
	}

	.channel {
		display: inline-block;
		color: rgba(255, 255, 255, 0.5);
		font-size: 0.9rem;
	}

	@media (width > 550px) {
		.event-card {
			padding: 3rem;
		}

		.date {
			font-size: 1.3rem;
		}

		.countdown {
			font-size: 2.2rem;
		}
	}
</style>
