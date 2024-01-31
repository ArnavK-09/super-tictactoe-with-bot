<script lang="ts">
    // imports
    import {
        activeSlats,
        winnerSlats,
        type SlatID,
        type WSlat,
    } from "$lib/store";
    import TicTacToeBlock from "./TicTacToeBlock.svelte";

    // logic
    let allSlats: SlatID[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // handle player move
    function changeSlatChild(e: CustomEvent<number>) {
        activeSlats.update(() => {
            let wSlats = $winnerSlats.filter((x) => x.id == e.detail);
            if (!(wSlats.length == 0)) return [0] as SlatID[];
            else return [e.detail] as SlatID[];
        });
    }

    // handle win of block
    function submitWinner(e: CustomEvent<WSlat>) {
        winnerSlats.update((x) => {
            let wSlats = $winnerSlats.filter((x) => x.id == e.detail.id);
            if (wSlats.length == 0) return [...x, e.detail];
            else return x;
        });
        activeSlats.update((x) => {
            const y = x;
            const i = y.indexOf(e.detail.id);
            y[i] == undefined;
            return y;
        });
        if ($activeSlats.length == 0) {
            activeSlats.update(() => [0]);
        }
    }
</script>

<div class="aspect-square grid gap-4 w-fit h-fit max-h-full max-w-full grid-cols-3">
    {#each allSlats as stat}
        <TicTacToeBlock
            on:submitWinner={submitWinner}
            on:changeSlatChild={changeSlatChild}
            id={stat}
        />
    {/each}
</div>
