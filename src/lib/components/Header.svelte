<script lang="ts">
    import type { User } from "$lib/types";
    import IoIosArrowDown from "svelte-icons/io/IoIosArrowDown.svelte";
    import { signOut } from "@auth/sveltekit/client";

    import logo from "$lib/images/logo-small.png";

    export let user: User;
</script>

<header class="flex justify-between items-center w-[86%] mx-auto py-8">
    <a href="/" class="flex items-center gap-4">
        <img src={logo} alt="Pixel Diary logo" class="h-14" />
        <span class="text-3xl font-semibold">Pixel Diary</span>
    </a>

    {#if user}
        <div class="relative">
            <div class="dropdown dropdown-bottom dropdown-end">
                <button class="flex gap-3.5 items-center cursor-pointer m-1">
                    {#if user?.image}
                        <img
                            src={user.image}
                            alt="{user.firstName}'s avatar"
                            class="w-10 h-10 rounded-full"
                        />
                    {/if}
                    <div class="font-medium text-[1.08rem] hidden sm:block">
                        {user.firstName}
                    </div>
                    <div class="h-5 w-5">
                        <IoIosArrowDown />
                    </div>
                </button>
                <ul
                    class="dropdown-content z-[1] menu p-3 shadow bg-base-100 rounded-box w-52 text-base"
                >
                    <li>
                        <a href="/dashboard">Dashboard</a>
                    </li>
                    <li>
                        <a href="/settings">Settings</a>
                    </li>
                    <li>
                        <button on:click={signOut}>Sign Out</button>
                    </li>
                </ul>
            </div>
        </div>
    {:else}
        <a href="/auth/signin" data-sveltekit-preload-data="off">Sign in</a>
    {/if}
</header>
