<script lang="ts">
    import Grid from "$lib/components/Grid.svelte";
    import type { Pixel } from "$lib/types";
    import html2canvas from "html2canvas";
    import toast from "svelte-french-toast";

    export let userId: string;
    export let pixel: Pixel;
    export let owner: boolean = true;

    let component: HTMLElement;

    const saveAsImage = async () => {
        toast.promise(
            html2canvas(component).then((canvas) => {
                const a = document.createElement("a");
                a.href = canvas.toDataURL("image/png");
                a.download = `pixel-${pixel.id}.png`;
                a.click();
            }),
            {
                loading: "Processing...",
                success: "Image downloaded!",
                error: "Could not download image.",
            }
        );
    };

    const copyShareLinkToClipboard = async () => {
        pixel.public = true;

        const url = `${window.location.origin}/pixel/${userId}/${pixel.id}`;

        // Copying the URL to the clipboard
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    const date = new Date(pixel.created).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
</script>

<div class="grid gap-7 w-full justify-between grid-cols-9">
    <div
        class="border-4 border-base-300 rounded-sm overflow-hidden col-span-9 sm:col-span-4"
    >
        <div bind:this={component}>
            <Grid cells={pixel.cells} editMode={false} />
        </div>
    </div>
    <div class="col-span-9 sm:col-span-5">
        <div class="flex justify-between">
            <h3 class="font-bold text-3xl mb-0.5">
                {pixel.emotion}
            </h3>
            {#if owner}
                <label class="swap">
                    <input type="checkbox" bind:checked={pixel.public} />
                    <div class="swap-on">📢 Public</div>
                    <div class="swap-off">🔒 Private</div>
                </label>
            {/if}
        </div>
        <p class="mb-4">
            {date}
        </p>
        <p class="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic,
            laboriosam laudantium praesentium nisi nulla culpa eligendi
            doloremque asperiores. Dignissimos, corrupti.
        </p>

        <button class="btn btn-neutral btn-sm !text-xs" on:click={saveAsImage}>
            Download
        </button>
        <button
            class="btn btn-neutral btn-sm !text-xs"
            on:click={copyShareLinkToClipboard}
        >
            Copy Share Link
        </button>
    </div>
</div>
