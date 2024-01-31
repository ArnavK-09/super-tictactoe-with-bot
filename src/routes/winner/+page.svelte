<script>
    // imports
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    //  vars
    let winner = "";

    onMount(async () => {
        // get query
        const url = new URL(window?.location.href);
        const w = url.searchParams.get("w");

        if (w == "X") {
            winner = "You";
        } else if (w == "O") {
            winner = "Bot";
        } else {
            goto("/");
        }
    });
</script>

<section
    class="overflow-x-hidden w-screen h-auto min-h-screen grid place-items-center"
>
    <div class="text-center">
        <h1 class="text-7xl break-words">Winner Is:</h1>
        <h2 class="break-all text-9xl w-full bg-white/5 rounded-full ext-center py-1">
            {winner}
        </h2>
        <a
            aria-label="restart"
            href="/"
            class="text-center underline font-normal mt-12 text-2xl opacity-85"
            >Play Again?</a
        >
    </div>
</section>
