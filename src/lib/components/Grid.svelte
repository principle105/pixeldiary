<script lang="ts">
    import type { Cell } from "$lib/types";
    import { GRID_HEIGHT, GRID_WIDTH } from "$lib/constants";

    export let currentColour: string = "#ffffff";
    export let cells: Cell[];
    export let height: number = GRID_HEIGHT;
    export let width: number = GRID_WIDTH;
    export let maxHeight: number;
    export let editMode: boolean = true;

    $: tileSize = maxHeight / height;

    const updateCell = (i: number) => (e: MouseEvent) => {
        if (e.buttons === 1) {
            cells[i] = currentColour;
        } else if (e.buttons === 2) {
            cells[i] = null;
        }
    };
</script>

{#if editMode}
    <div
        class="grid border-2 border-black rounded-md"
        style="grid-template-rows: repeat({height}, 1fr); grid-template-columns: repeat({width}, 1fr);
    width: {width * tileSize}vmin; height: {height * tileSize}vmin"
    >
        {#each cells as cell, i}
            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
            <div
                style="background: {cell ?? '#ffffff'}"
                class="cursor-pointer border-2 border-black transition-all duration-200 hover:scale-[1.18] ease-linear hover:border-[3px] hover:rounded-md hover:z-10"
                on:mouseover={updateCell(i)}
                on:mousedown={updateCell(i)}
                on:contextmenu={(e) => e.preventDefault()}
            />
        {/each}
    </div>
{:else}
    <div
        class="grid rounded-md"
        style="grid-template-rows: repeat({height}, 1fr); grid-template-columns: repeat({width}, 1fr);
    width: {width * tileSize}vmin; height: {height * tileSize}vmin"
    >
        {#each cells as cell, i}
            <div style="background: {cell ?? '#ffffff'}" />
        {/each}
    </div>
{/if}
