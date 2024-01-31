<script lang="ts">
    // imports
    import { currentPlayerShift } from "$lib/store";
    import { createEventDispatcher } from "svelte";

    // props
    export let value: "X" | "O" | null = null;
    export let id: Array<number>;
    export let disabled: boolean = false;

    // new event dispatcher
    const dispatch = createEventDispatcher();

    /**
     * Emit player move
     */
    const playerMoved = () => {
        dispatch("playerMoved", {
            move: $currentPlayerShift,
            shift: id,
        });
    };
</script>

<button
    {disabled}
    type="button"
    on:click={playerMoved}
    class={`${
        value ? "text-white" : "text-transparent"
    } shadow disabled:bg-zinc-800 hover:scale-105 transition select-none bg-zinc-950 text-3xl px-3 aspect-square flex justify-center align-middle rounded-2xl text-white font-bold text-center`}
>
    {value ?? "~"}
</button>
