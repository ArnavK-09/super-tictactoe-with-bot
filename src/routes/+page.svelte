<script lang="ts">
    // imports
    import TicTacToeSlat from "$lib/components/TicTacToeSlat.svelte";
    import { goto } from "$app/navigation";
    import { whoIsWinner, type SLAT } from "$lib/shared";
    import { activeSlats, winnerSlats } from "$lib/store";

    // safety check
    $: {
        if ($activeSlats.length == 0) {
            activeSlats.update(() => [0]);
        }
    }

    // check winner
    $: {
        if ($winnerSlats.length !== 0) {
            // get slat
            const slat: SLAT =  [
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ];

            // get moves
            $winnerSlats.forEach((x, i) => {
                if(x.id < 4) {
                    slat[0][x.id-1] = x.shift
                }else if(x.id < 7 && x.id > 3) {
                    slat[1][x.id-4] = x.shift
                }
                if(x.id < 10 && x.id > 6) {
                    slat[2][x.id-7] = x.shift
                }
            });
            // win
            const w = whoIsWinner(slat)
            if(w) goto(`/winner?w=${w}`);
        }
    }
</script>

<section class="px-3 scale-[1] md:scale-90 lg:scale-100 select-none">
    <TicTacToeSlat />
</section>
