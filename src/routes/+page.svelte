<script>
    // imports
    import TicTacToeSlat from "$lib/components/TicTacToeSlat.svelte";
    import { activeSlats, winnerSlats } from "$lib/store";

    // safety check
    $: {
        if ($activeSlats.length == 0) {
            activeSlats.update(() => [0]);
        }
    }

    // check winner 
    $: {
        if($winnerSlats.length == 9) {
            // TODO win  

        }
    }
</script>

<section class="px-3 scale-[1] md:scale-90 lg:scale-100 select-none">
    <TicTacToeSlat />
</section>
