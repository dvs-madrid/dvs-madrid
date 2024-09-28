<script>
	import { onMount } from "svelte";
    import { timeDay, timeMonth } from 'd3-time'

    export let date;

    let fecha = ''
    let timeToEvent = undefined

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

<div style="background-color: #f0f0f0; padding: 3rem">
    <b>🗓️ Próximo evento:</b>
    {#if timeToEvent?.days > 0}
        <p>{fecha}</p>
        <p>{timeToEvent.days} días</p>
        <p>Consigue tus entradas aquí</p>
    {:else}
        <p>Aún estamos decidiendo la fecha! Entérete en slack</p>
    {/if}
</div>