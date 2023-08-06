<script lang="ts">
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";
    import { page } from "$app/stores";
    import type { User, Pixel } from "$lib/types";
    import { areDatesOnSameDay } from "$lib/utils";
    import { PALETTES } from "$lib/constants";

    import { Doughnut } from "svelte-chartjs";
    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        ArcElement,
        CategoryScale,
    } from "chart.js";
    import type { Plugin } from "chart.js";

    import wavingHand from "$lib/images/waving-hand.png";
    import beginnerBadge from "$lib/images/beginner-badge.png";

    import PixelDisplay from "$lib/components/PixelDisplay.svelte";
    import Grid from "$lib/components/Grid.svelte";

    ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

    let user = $page.data.session?.user as User;
    let isPreviewModalOpen = false;
    let pixelPreview: Pixel | null = null;

    let highlight: string | null = null;

    let data = {
        labels: PALETTES.map((p) => p.name),
        datasets: [
            {
                data: user.drawings.reduce(
                    (acc, curr) => {
                        const index = PALETTES.findIndex(
                            (p) => p.name === curr.emotion
                        );
                        acc[index] += 1;
                        return acc;
                    },
                    Array.from({ length: PALETTES.length }, () => 0)
                ),
                backgroundColor: PALETTES.map((p) => p.colors[2]),
            },
        ],
    };

    const hoverLabelPlugin: Plugin<"doughnut"> = {
        id: "hoverLabel",
        afterDraw(chart) {
            const activeElements = chart.getActiveElements();

            if (activeElements.length === 0) return;

            const textLabel =
                chart.config.data.labels?.[activeElements[0].index];
            highlight = textLabel as string;
        },
        beforeEvent(chart, args, pluginOptions) {
            const event = args.event;

            if (event.type === "mousemove") {
                const activeElements = chart.getActiveElements();

                if (activeElements.length === 0) {
                    highlight = null;
                }
            }
        },
    };

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

    const getMissedDays = () => {
        const today = new Date();
        const creationDate = new Date(user.createdAt);

        const daysBetween = Math.floor(
            (today.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const missedDays = daysBetween - user.drawings.length;

        return missedDays;
    };

    $: pixelPreview?.public, handleChangeInPixelDisplay();
</script>

<div class="max-w-screen-xl mx-auto p-8 mb-5">
    <h1 class="text-4xl font-bold mb-10 flex gap-2 items-center">
        Hello {user.firstName}
        <img src={wavingHand} alt="Waving hand" class="w-10 h-10" />
    </h1>
    <div
        class="flex lg:items-center lg:justify-between flex-col lg:flex-row gap-5"
    >
        <div class="flex items-stretch">
            <div class="text-gray-400 text-xs my-auto">Badges<br />Earned</div>
            <div class="h-100 border-l mx-4" />
            <div class="flex flex-nowrap gap-1">
                <div class="tooltip" data-tip="Created an Account">
                    <img
                        src={beginnerBadge}
                        alt="Beginner badge"
                        class="h-9 w-9"
                    />
                </div>
            </div>
        </div>
        <div>
            <a
                class="btn {dailyPixelCompleted
                    ? 'btn-disabled'
                    : 'btn-primary'}"
                href="/create-pixel"
            >
                {dailyPixelCompleted
                    ? `Come back in ${getTimeLeft(today)}`
                    : "Draw today's pixel"}
            </a>
        </div>
    </div>

    <hr class="my-10" />

    <div class="flex gap-12 md:gap-20 flex-col md:flex-row">
        <div class="grow">
            <h2 class="text-2xl font-bold mb-4">Stats</h2>

            <div class="grid grid-rows-3 sm:grid-cols-2 gap-4">
                <div class="row-span-3 col-span-1">
                    <div class="p-7 bg-gray-100 rounded-xl">
                        <div
                            class="font-bold text-xl text-gray-800 leading-none mb-6"
                        >
                            Emotion Distribution
                        </div>

                        <div
                            class="max-w-[15rem] sm:max-h-[15rem] sm:max-w-[15rem] relative"
                        >
                            {#if user.drawings.length === 0}
                                <p>You have no drawings yet!</p>
                            {/if}

                            {#if highlight}
                                <div
                                    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pb-1.5"
                                >
                                    <h2 class="text-3xl font-bold">
                                        {user.drawings.filter(
                                            (d) => d.emotion === highlight
                                        ).length}
                                    </h2>
                                    <h3 class="opacity-80">{highlight}</h3>
                                </div>
                            {/if}
                            <Doughnut
                                {data}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    cutout: "70%",
                                    events: [
                                        "mousemove",
                                        "mouseout",
                                        "click",
                                        "touchstart",
                                        "touchmove",
                                    ],
                                    plugins: {
                                        tooltip: {
                                            enabled: false,
                                        },
                                        legend: {
                                            display: false,
                                            onLeave() {
                                                highlight = null;
                                            },
                                        },
                                    },
                                }}
                                plugins={[hoverLabelPlugin]}
                            />
                        </div>
                    </div>
                </div>
                <div
                    class="p-5 bg-yellow-100 rounded-xl text-gray-800 flex flex-col justify-center"
                >
                    <div class="font-bold text-2xl leading-none">
                        {user.streak}
                    </div>
                    <div class="mt-2">Day Streak</div>
                </div>
                <div
                    class="p-5 bg-purple-100 rounded-xl text-gray-800 flex flex-col justify-center"
                >
                    <div class="font-bold text-2xl leading-none">
                        {getMissedDays()}
                    </div>
                    <div class="mt-2">Missed Days</div>
                </div>
                <div
                    class="p-5 bg-green-100 rounded-xl text-gray-800 flex flex-col justify-center"
                >
                    <div class="font-bold text-2xl leading-none">
                        {user.drawings.length}
                    </div>
                    <div class="mt-2">Total Pixels</div>
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
            {#if monthlyPixels.length === 0}
                <div class="text-gray-500 text-sm mt-2">
                    You haven't drawn any pixels this month.
                </div>
            {/if}
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
