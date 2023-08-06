<script lang="ts">
    import { page } from "$app/stores";
</script>

{#if $page.status === 404}
    <section class="py-32 px-4 mx-auto max-w-screen-xl lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl">
                404
            </h1>
            <p class="mb-4 text-3xl tracking-tight font-bold md:text-4xl">
                It looks like you're lost...
            </p>
            <p class="mb-4 text-lg text-gray-400">
                the page you are looking for does not exist.
            </p>
            <a href="/" class="btn btn-primary"> Go Back Home </a>
        </div>
    </section>
{/if}
