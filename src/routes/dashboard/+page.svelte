<script lang="ts">
    import { page } from "$app/stores";
    import type { User } from "$lib/types";
    import wavingHand from "$lib/images/waving-hand.png";
    import { areDatesOnSameDay } from "$lib/utils";

    import Grid from "$lib/components/Grid.svelte";

    const MAX_STREAK_SHOWN = 15;

    let user = $page.data.session?.user as User;
    const today = new Date();

    $: dailyPixelCompleted =
        user.lastDrawn && areDatesOnSameDay(new Date(user.lastDrawn), today);

    $: monthlyPixels = user.drawings.filter((d) => {
        return new Date(d.created).getMonth() === today.getMonth();
    });
    $: streakPixels = user.drawings.slice(-user.streak);
</script>

<div class="max-w-screen-xl mx-auto">
    <div class="bg-white rounded-3xl p-8 mb-5">
        <h1 class="text-4xl font-bold mb-10 flex gap-2 items-center">
            Hello {user.firstName}
            <img src={wavingHand} alt="Waving hand" class="w-10 h-10" />
        </h1>
        <div class="flex items-center justify-between">
            <div class="flex items-stretch">
                <div class="text-gray-400 text-xs">
                    {user.streak} Day<br />Streak
                </div>
                <div class="h-100 border-l mx-4" />
                <div class="flex flex-nowrap gap-1">
                    {#each streakPixels.slice(0, MAX_STREAK_SHOWN) as drawing}
                        <Grid
                            maxHeight={4}
                            cells={drawing.cells}
                            editMode={false}
                        />
                    {/each}
                    {#if streakPixels.length > MAX_STREAK_SHOWN}
                        <div class="h-9 w-9 flex items-center justify-center">
                            <div
                                class="bg-gray-200 rounded-md flex items-center justify-center p-1.5 text-xs"
                            >
                                +{streakPixels.length - MAX_STREAK_SHOWN}
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
            <a
                class="btn {dailyPixelCompleted
                    ? 'btn-disabled'
                    : 'btn-primary'}"
                href="/create-pixel"
            >
                {dailyPixelCompleted ? "Done for today" : "Draw today's pixel"}
            </a>
        </div>

        <hr class="my-10" />

        <div class="grid grid-cols-2 gap-x-20">
            <div>
                <h2 class="text-2xl font-bold mb-4">Stats</h2>

                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <div class="p-4 bg-green-100 rounded-xl">
                            <div
                                class="font-bold text-xl text-gray-800 leading-none"
                            >
                                Good day, <br />Kristin
                            </div>
                            <div class="mt-5">
                                <button
                                    type="button"
                                    class="inline-flex items-center justify-center py-2 px-3 rounded-xl bg-white text-gray-800 hover:text-green-500 text-sm font-semibold transition"
                                >
                                    Start tracking
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 bg-yellow-100 rounded-xl text-gray-800">
                        <div class="font-bold text-2xl leading-none">
                            {user.drawings.length}
                        </div>
                        <div class="mt-2">Total Pixels</div>
                    </div>
                    <div class="p-4 bg-yellow-100 rounded-xl text-gray-800">
                        <div class="font-bold text-2xl leading-none">5,5</div>
                        <div class="mt-2">Tracked hours</div>
                    </div>
                    <div class="col-span-2">
                        <div class="p-4 bg-purple-100 rounded-xl text-gray-800">
                            <div class="font-bold text-xl leading-none">
                                Your daily plan
                            </div>
                            <div class="mt-2">5 of 8 completed</div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h2 class="text-2xl font-bold mb-4">Your Pixels This Month</h2>
                <div class="flex flex-wrap rounded-xl">
                    {#each monthlyPixels as drawing}
                        <a href="/pixel/{drawing.id}">
                            <Grid
                                maxHeight={6}
                                cells={drawing.cells}
                                editMode={false}
                            />
                        </a>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
