<script lang="ts">
    import { page } from "$app/stores";
    import type { User } from "$lib/types";

    import heroLogo from "$lib/images/hero.png";

    let user = $page.data.session?.user as User;
</script>

<section>
    <div
        class="grid max-w-screen-xl w-[86%] xl:w-full py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12"
    >
        <div class="mr-auto place-self-center lg:col-span-7">
            <h1
                class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl"
            >
                Express Your Emotions Through Art
            </h1>
            <p
                class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl"
            >
                Unleash the power of pixel art and vibrant colors to create your
                daily masterpiece, reflecting your emotions in a positive and
                therapeutic way.
            </p>
            {#if user}
                <a class="btn btn-primary" href="/dashboard">Go to Dashboard</a>
            {:else}
                <a class="btn btn-primary" href="/auth/signin">Get Started</a>
            {/if}
        </div>
        <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src={heroLogo} alt="mockup" />
        </div>
    </div>
</section>
