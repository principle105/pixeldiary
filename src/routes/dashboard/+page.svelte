<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import type { User, Pixel } from "$lib/types";
    import wavingHand from "$lib/images/waving-hand.png";
    import { areDatesOnSameDay } from "$lib/utils";
    import html2canvas from "html2canvas";
    import toast from "svelte-french-toast";
    import PixelDisplay from "$lib/components/PixelDisplay.svelte";

    import Grid from "$lib/components/Grid.svelte";

    let user = $page.data.session?.user as User;
    let isPreviewModalOpen = false;
    let pixelPreview: Pixel | null = null;

    let today = new Date();

    // Ensuring that the date is updated every second
    onMount(() => {
        const interval = setInterval(() => {
            today = new Date();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });

    $: dailyPixelCompleted =
        user.lastDrawn && areDatesOnSameDay(new Date(user.lastDrawn), today);

    $: monthlyPixels = user.drawings.filter((d) => {
        return new Date(d.created).getMonth() === today.getMonth();
    });

    const handleChangeInPixelDisplay = async () => {
        if (!pixelPreview) return;

        const pixelIndex = user.drawings.findIndex(
            (d) => d.id === (pixelPreview as Pixel).id
        );

        if (pixelIndex === -1) return;

        const originalPixel = user.drawings[pixelIndex];
        if (originalPixel.public === pixelPreview.public) return;

        originalPixel.public = pixelPreview.public;

        const resp = await fetch("/api/update-pixel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: user.id,
                pixelId: pixelPreview.id,
                pixel: pixelPreview,
            }),
        });

        if (!resp.ok) {
            toast.error("Something went wrong!");
            return;
        }

        toast.success("Pixel visibility updated!");
    };

    const getTimeLeft = (date: Date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);

        const timeDifference = nextDay.getTime() - date.getTime();

        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        return `${hours}H ${minutes}M ${seconds}S`;
    };

    $: pixelPreview?.public, handleChangeInPixelDisplay();
</script>

<div class="max-w-screen-xl mx-auto p-8 mb-5">
    <h1 class="text-4xl font-bold mb-10 flex gap-2 items-center">
        Hello {user.firstName}
        <img src={wavingHand} alt="Waving hand" class="w-10 h-10" />
    </h1>
    <div class="flex items-center justify-between">
        <div class="flex items-stretch">
            <div class="text-gray-400 text-xs my-auto">Badges</div>
            <div class="h-100 border-l mx-4" />
            <div class="flex flex-nowrap gap-1">
                <!-- {#each streakPixels.slice(0, MAX_STREAK_SHOWN) as drawing}
                        <Grid
                            maxHeight={4}
                            cells={drawing.cells}
                            editMode={false}
                        />
                    {/each} -->
            </div>
        </div>
        <a
            class="btn {dailyPixelCompleted ? 'btn-disabled' : 'btn-primary'}"
            href="/create-pixel"
        >
            {dailyPixelCompleted
                ? `Come back in ${getTimeLeft(today)}`
                : "Draw today's pixel"}
        </a>
    </div>

    <hr class="my-10" />

    <div class="flex gap-12 md:gap-20 flex-col md:flex-row">
        <div class="grow">
            <h2 class="text-2xl font-bold mb-4">Stats</h2>

            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                    <div class="p-4 bg-green-100 rounded-xl">
                        <div
                            class="font-bold text-xl text-gray-800 leading-none"
                        >
                            Good day, <br />{user.firstName}
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
                        {user.streak}
                    </div>
                    <div class="mt-2">Day Streak</div>
                </div>
                <div class="p-4 bg-yellow-100 rounded-xl text-gray-800">
                    <div class="font-bold text-2xl leading-none">
                        {user.drawings.length}
                    </div>
                    <div class="mt-2">Total Pixels</div>
                </div>
                <div class="col-span-2">
                    <div class="p-4 bg-purple-100 rounded-xl text-gray-800">
                        <div class="font-bold text-xl leading-none">
                            {user.drawings.length}
                        </div>
                        <div class="mt-2">Total Pixels</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="grow">
            <h2 class="text-2xl font-bold mb-4">Your Pixels This Month</h2>
            <div class="flex flex-wrap rounded-xl">
                {#each monthlyPixels as drawing}
                    <button
                        class="bg-purple-300 w-10 h-10"
                        on:click={() => {
                            pixelPreview = JSON.parse(JSON.stringify(drawing));
                            isPreviewModalOpen = true;
                        }}
                    >
                        <Grid cells={drawing.cells} editMode={false} />
                    </button>
                {/each}
            </div>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={isPreviewModalOpen}>
    <div class="modal-box max-w-4xl">
        {#if pixelPreview !== null}
            <PixelDisplay bind:pixel={pixelPreview} userId={user.id} />
            <div class="modal-action">
                <button
                    class="btn"
                    on:click={() => (isPreviewModalOpen = false)}
                >
                    Close
                </button>
            </div>
        {/if}
    </div>
</div>
