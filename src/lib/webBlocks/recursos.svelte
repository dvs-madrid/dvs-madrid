<script>
	import { ascending } from "d3";

    export let recursos;
</script>


<div style="display: flex; flex-direction: column; gap: 1rem;margin-bottom: 50px">
    <h3>Recursos para visualizar datos</h3>

    <div style="display: grid;grid-template-columns: repeat(auto-fill, 300px);column-gap: 10px;row-gap: 20px; justify-content: space-between;">
        {#each Object.entries(recursos) as [key, recurso]}
            <div>
                <h4>{key}</h4>
                <ul>
                    {#each recurso.sort((a,b) => ascending(a.nombre,b.nombre)) as info}
                    {#if info.link}
                        <li><a href={info.link} target="_blank" >{info.nombre}</a></li>
                        {:else}
                        <li>{info.nombre}</li>
                    {/if}
                    {/each}
                </ul>
            </div>
        {/each}
    </div>

</div>