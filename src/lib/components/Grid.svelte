<script lang="ts">
    import type { Cell } from "$lib/types";
    import { SIZE } from "$lib/constants";

    export let currentColour: string = "#ffffff";
    export let cells: Cell[];
    export let editMode: boolean = true;

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
        class="grid border-2 border-black rounded-md w-full h-full"
        style="grid-template-rows: repeat({SIZE}, 1fr); grid-template-columns: repeat({SIZE}, 1fr);"
    >
        {#each cells as cell, i}
            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
            <div
                style="background: {cell ?? '#ffffff'}"
                class="cursor-pointer aspect-square border-2 border-black transition-all duration-200 hover:scale-[1.18] ease-linear hover:border-[3px] hover:rounded-md hover:z-10"
                on:mouseover={updateCell(i)}
                on:mousedown={updateCell(i)}
                on:contextmenu={(e) => e.preventDefault()}
            />
        {/each}
    </div>
{:else}
    <div
        class="grid rounded-md w-full h-full"
        style="grid-template-rows: repeat({SIZE}, 1fr); grid-template-columns: repeat({SIZE}, 1fr);"
    >
        {#each cells as cell}
            <div
                style="background: {cell ?? '#ffffff'}"
                class="aspect-square"
            />
        {/each}
    </div>
{/if}
