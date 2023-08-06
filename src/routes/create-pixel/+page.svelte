<script lang="ts">
    import toast from "svelte-french-toast";
    import { page } from "$app/stores";
    import type { Cell, User } from "$lib/types";
    import { SIZE, PALETTES } from "$lib/constants";
    import { areDatesOnSameDay } from "$lib/utils";

    import Grid from "$lib/components/Grid.svelte";

    let cbosenPaletteIndex: number | null = null;
    let currentColour: string | null = null;

    const initialCells: Cell[] = Array.from(
        { length: SIZE * SIZE },
        () => null
    );

    let cells: Cell[] = [...initialCells];
    let isClearModalOpen = false;
    let user = $page.data.session?.user as User;

    $: dailyPixelCompleted =
        user.lastDrawn &&
        areDatesOnSameDay(new Date(user.lastDrawn), new Date());
    $: canClear = JSON.stringify(cells) !== JSON.stringify(initialCells);

    const setColour = (colour: string) => () => {
        currentColour = colour;
    };

    const clearGrid = () => {
        isClearModalOpen = false;
        cells = [...initialCells];

        toast.success("Grid cleared!");
    };

    const savePixel = async () => {
        const resp = await fetch("/api/save-pixel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: user.id,
                cells,
                emotion: PALETTES[cbosenPaletteIndex as number].name,
            }),
        });

        if (!resp.ok) {
            toast.error("Something went wrong!");
            return;
        }

        toast.success("Palette saved!");

        window.location.href = "/dashboard";
    };
</script>

{#if dailyPixelCompleted}
    <section>
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div class="mx-auto max-w-screen-sm text-center">
                <h2
                    class="mb-6 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl"
                >
                    You've already drawn your daily pixel!
                </h2>
                <a class="btn btn-active btn-primary" href="/dashboard">
                    Back to Dashboard
                </a>
            </div>
        </div>
    </section>
{:else if cbosenPaletteIndex === null}
    <section class="w-5/6 mx-auto">
        <div class="mt-6 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-3">
                Choose Your Emotion
            </h1>
            <p class="mb-9">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
                ullam placeat at nostrum?
            </p>
        </div>
        <div class="max-w-screen-lg mx-auto">
            <div class="grid sm:grid-rows-2 sm:grid-cols-4 gap-2.5">
                {#each PALETTES as palette, i}
                    <button
                        style="background: {palette.colors[1]}"
                        class="p-6 md:p-8 flex justify-center items-center rounded-lg hover:brightness-90 transition-all duration-300"
                        on:click={() => {
                            cbosenPaletteIndex = i;
                            currentColour =
                                PALETTES[cbosenPaletteIndex].colors[0];
                        }}
                    >
                        <div class="text-lg md:text-xl">
                            <span>{palette.emoji}</span>
                            <span class="font-semibold">{palette.name}</span>
                        </div>
                    </button>
                {/each}
            </div>
        </div>
    </section>
{:else}
    <section
        class="flex items-center justify-center flex-col m-auto mt-6 text-center w-5/6"
    >
        <h1 class="text-4xl md:text-5xl font-bold mb-3">
            Draw Your Daily Pixel
        </h1>
        <p class="mb-9">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ullam
            placeat at nostrum?
        </p>

        <div class="flex md:relative flex-col sm:flex-row w-full sm:w-auto">
            <div
                class="w-full h-full sm:h-[24rem] sm:w-[24rem] md:h-[25rem] md:w-[25rem] lg:h-[30rem] lg:w-[30rem]"
            >
                <Grid
                    currentColour={currentColour ||
                        PALETTES[cbosenPaletteIndex].colors[0]}
                    bind:cells
                />
            </div>
            <div
                class="md:absolute md:right-0 md:top-1/2 md:translate-x-full md:-translate-y-1/2 pt-6 sm:pl-10 sm:pt-0"
            >
                <div
                    class="grid grid-rows-2 grid-cols-4 sm:grid-cols-2 sm:grid-rows-4 w-full h-full"
                >
                    {#each PALETTES[cbosenPaletteIndex].colors as colour}
                        <button
                            style="background: {colour}"
                            class="{colour === currentColour &&
                                'scale-[1.15] z-10'} transition-transform duration-150 ease-linear cursor-pointer aspect-square"
                            on:click={setColour(colour)}
                        />
                    {/each}
                </div>
                <div class="flex mt-4 gap-2">
                    <button
                        class="btn btn-error"
                        disabled={!canClear}
                        on:click={() => (isClearModalOpen = true)}
                    >
                        Clear
                    </button>
                    <button class="btn btn-success" on:click={savePixel}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    </section>

    <div class="modal" class:modal-open={isClearModalOpen}>
        <div class="modal-box">
            <h3 class="font-bold text-lg">
                Are you sure you want to clear the canvas?
            </h3>
            <p class="py-4">
                Clearing the canvas is an irreversible action which will delete
                all your progress.
            </p>
            <div class="modal-action">
                <button class="btn" on:click={() => (isClearModalOpen = false)}>
                    Close
                </button>
                <button class="btn btn-error" on:click={clearGrid}>Clear</button
                >
            </div>
        </div>
    </div>
{/if}
