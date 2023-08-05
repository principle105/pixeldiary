<script lang="ts">
    import { Toaster } from "svelte-french-toast";
    import { page } from "$app/stores";
    import type { User } from "$lib/types";

    import Header from "../lib/components/Header.svelte";

    import "./global.css";

    let user = $page.data.session?.user as User;
</script>

<Header {user} />

<main>
    <slot />
</main>

<Toaster />
