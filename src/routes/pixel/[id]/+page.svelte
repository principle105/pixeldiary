<script lang="ts">
    import type { User } from "$lib/types";
    import { page } from "$app/stores";
    import Grid from "$lib/components/Grid.svelte";

    let user = $page.data.session?.user as User;

    const drawing = user.drawings.find((d) => d.id === $page.params.id);
</script>

{#if !drawing}
    <p>Not found</p>
{:else}
    {@const date = new Date(drawing.created).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })}
    <section class="flex flex-col items-center mt-10">
        <Grid maxHeight={50} cells={drawing.cells} editMode={false} />

        <h1 class="text-center text-3xl mt-6">{date}</h1>

        <button class="btn btn-neutral" on:click={() => history.back()}>
            Back
        </button>
    </section>
{/if}
