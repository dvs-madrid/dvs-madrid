<script>
	import { onMount } from "svelte";
    import { timeDay, timeMonth } from 'd3-time'

    let { date } = $props();

    let fecha = $state('')
    let timeToEvent = $state(undefined)

    function interval(then, now) {
        if (then <= now) throw new Error("Time’s up!");
        let t = now;
        let months = timeMonth.count(t, then);
        if ((t = timeMonth.offset(t, months)) > then) t = timeMonth.offset(t, -1), --months;
        let days = timeDay.count(t, then);
        if ((t = timeDay.offset(t, days)) > then) t = timeDay.offset(t, -1), --days;
        return { months, days };
    }

    onMount(async () => {
        let today = new Date()

        fecha = new Intl.DateTimeFormat('es-ES', {dateStyle: 'full'}).format(new Date(date))
        timeToEvent = interval(new Date(date), today)
    })
    
</script>

<div  class="date-container">
    <b>🗓️ Próximo evento:</b>
    {#if timeToEvent?.days > 0}
    <div style="text-align: center;padding-top:2rem">
        <p class="date">{fecha}</p>
        <p class="countdown">¡Nos vemos en {timeToEvent.months} meses y {timeToEvent.days} días!</p>
        <p class="tickets">Consigue tus entradas aquí 🎟️</p>
    </div>
    {:else}
    <div class="tbd">
        <p>Aún estamos decidiendo la fecha!</p>
        <p>Entérete en <a href="https://www.datavisualizationsociety.org/slack-community">Slack</a> <span style="display: inline-block;">(#location-madrid)</span></p>
    </div>
    {/if}
</div>

<style>
    .date-container {
        background-color: #f0f0f0; 
        padding: 2rem;
    }

    .date, .countdown {
        margin-bottom: 3rem;
    }

    .date {
        font-weight: bold;
        font-size: 1.1rem
    }

    .countdown {
        font-size: 1.5rem
    }

    .tickets {
        font-size: 1rem
    }

    .tbd {
        text-align: center;
        padding: 2rem 0;
        font-size: 1.2rem
    }

    .tbd a {
        text-decoration: underline;
        font-weight: bold;
        color: purple
    }

    @media (width > 550px) {
        .date-container {
            padding: 3rem
        }

        .date {
            font-size: 1.25rem
        }

        .countdown {
            font-size: 1.7rem
        }

        .tickets {
            font-size: 1.2rem
        } 
    }
</style>