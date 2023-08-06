<script lang="ts">
    import PixelDisplay from "$lib/components/PixelDisplay.svelte";
    import { page } from "$app/stores";

    export let data;
</script>

{#if data.pixel === null}
    <section
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
    >
        <h1 class="text-center text-5xl font-bold">Pixel not found</h1>
        <p class="text-center text-lg mt-4">
            {data.error}
        </p>

        <a class="btn btn-neutral mt-6" href="/">Go To Home</a>
    </section>
{:else}
    <section class="flex justify-center items-center mt-6 lg:mt-10">
        <div class="w-3/4 max-w-screen-md">
            <PixelDisplay
                pixel={data.pixel}
                userId={$page.params.userId}
                owner={false}
            />
        </div>
    </section>
{/if}
