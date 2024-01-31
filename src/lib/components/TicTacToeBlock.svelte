<script lang="ts">
    /* IMPORTS */
    import {
        activeSlats,
        type SlatID,
        winnerSlats,
    } from "$lib/store";
    import { onMount } from "svelte";
    import TicTacToeItem from "./TicTacToeItem.svelte";
    import { createEventDispatcher } from "svelte";
    import type { XO, _XO, SLAT } from "$lib/shared";
    import { whoIsWinner } from "$lib/shared";

    /* PROPS */
    export let id: SlatID;

    /* MAIN LOGIC */
    function executeMiniMaxAlgorithm(slat: SLAT, initFirst: boolean = true) {
        // get shifts
        const freeShifts = getAllFreeShifts(slat);
        const ranks: number[] = [];

        // check each shift is good and rank it
        for (let x of freeShifts) {
            // new board parralel if this move done
            const boardIfThisMoveDone = createSlatAfterShiftExecution(slat, x);

            // if this move can make game win
            if (checkIfGameIsOver(boardIfThisMoveDone)) {
                ranks.push(
                    encodeXOintoDigits(whoIsWinner(boardIfThisMoveDone)),
                );
            }
               
            // recurursive rank
            const X = executeMiniMaxAlgorithm(boardIfThisMoveDone, false);
            ranks.push(X as number);
            
            // break if winner found
            if (
                (whosNextTurn(slat) == "X" && X == 1) ||
                (whosNextTurn(slat) == "O" && X == -1)
            ) {
                break;
            }
        }

        // get marks for minimax
        var marks = 0;
        if (whosNextTurn(slat) == "X") {
            marks = Math.max(...ranks);
        } else {
            marks = Math.min(...ranks);
        }
        // Returning action if called for the first time
        if (initFirst) return freeShifts[ranks.indexOf(marks)];
        else return marks;
    }

    /* HELP FUNCTIONS */
    const createSlatAfterShiftExecution = (
        slat: SLAT,
        shift: Array<number>,
    ) => {
        let executedBoard = [[...slat[0]], [...slat[1]], [...slat[2]]];
        executedBoard[shift[0]][shift[1]] = whosNextTurn(slat);
        return executedBoard;
    };
    const encodeXOintoDigits = (xo: XO): number => {
        if (xo == "X") return 1;
        else if (xo == "O") return -1;
        else return 0;
    };
    const getAllFreeShifts = (slat: SLAT) => {
        const freeShifts: Array<Array<number>> = [];

        // each free shifts
        [0, 1, 2].forEach((x) => {
            [0, 1, 2].forEach((y) => {
                if (slat[x][y] == null) freeShifts.push([x, y]);
            });
        });

        return freeShifts;
    };
    const countTerms = (array: Array<unknown>, whatToBeFind: string): number => {
        let n = 0;
        array.forEach((x) => {
            if (x == whatToBeFind) n++;
        });
        return n;
    };

    const whosNextTurn = (slat: SLAT): _XO => {
        // get all shifts in single array
        const allXOs = slat.reduce((x, y) => x.concat(y));
        // X First
        return countTerms(allXOs, "X") == countTerms(allXOs, "O") ? "X" : "O";
    };

    const checkIfGameIsOver = (slat: SLAT): boolean => {
        // get all shifts in single array
        const allXOs = slat.reduce((x, y) => x.concat(y));

        // if no more shift left
        if (allXOs.indexOf(null) == -1) return true;

        if (whoIsWinner(slat) != null) {
            return true;
        }

        // if ntg
        return false;
    };

    /* BOARD */
    class TicTacToeSlat {
        // types
        slat: SLAT;
        ai: XO = "O";

        // init
        constructor() {
            this.slat = [
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ];
        }

        initAIStep() {
            if (!checkIfGameIsOver(this.slat)) {
                if (this.ai == whosNextTurn(this.slat)) {
                    this.commandAItoMove();
                }
            }
        }

        commandAItoMove() {
            this.addShiftToBoard(
                executeMiniMaxAlgorithm(this.slat) as Array<number>,
            );
        }

        addShiftToBoard(shift: Array<number>) {
            if (checkIfGameIsOver(this.slat)) {
                this.submitWinner(whoIsWinner(this.slat) as _XO);
            } else {
                if (this.checkIfThisShiftIsFree(shift)) {
                    revampSlatWithSvelte(
                        createSlatAfterShiftExecution(this.slat, shift),
                        shift,
                    );
                }
            }
        }

        checkIfThisShiftIsFree(shift: Array<number>): boolean {
            return this.slat[shift[0]][shift[1]] == null;
        }

        submitWinner(w: _XO) {
            updateWinnerWithSvelte(w);
        }
    }

    /* New slat init */
    const slat = new TicTacToeSlat();

    /* Handler */
    const handlePlayerMove = (
        e: CustomEvent<{ move: XO; shift: Array<number> }>,
    ) => {
        if (e.detail) {
            slat.addShiftToBoard(e.detail.shift);
        }
    };

    /* Vars */
    let disabled = true;
    let wWinShift: XO;
    let mounted: boolean = false;
    const dispatch = createEventDispatcher();
    $: {
        if ($activeSlats.includes(id) || $activeSlats.includes(0)) {
            disabled = false;
        } else {
            disabled = true;
        }
    }
    $: {
        let wSlats = $winnerSlats.filter((x) => x.id == id);
        if (!(wSlats.length == 0)) {
            wWinShift = wSlats[0].shift;
        }
    }

    /* Svelte Helpers */
    function updateWinnerWithSvelte(shift?: XO) {
        // emit winner
        dispatch("submitWinner", {
            id: id,
            shift: whoIsWinner(slat.slat) ?? shift,
        });
    }
    function revampSlatWithSvelte(newSlat: SLAT, shift: number[]) {
        const ID = getItemIDbyShift(shift);
        $: slat.slat = newSlat; 
        slat.initAIStep();
        dispatch("changeSlatChild", ID as number);
        if (whoIsWinner(slat.slat) !== null) updateWinnerWithSvelte();
    }
    function getItemIDbyShift(shift: number[]): number {
        let id: number;
        if (shift[0] == 0) {
            id = shift[1] + 1;
        } else if (shift[0] == 1) {
            id = shift[1] + 4;
        } else if (shift[0] == 2) {
            id = shift[1] + 7;
        }
        return id;
    }

    // on mount
    onMount(() => {
        mounted = true;
    });
</script>

<section class={`brightness-90 aspect-square rounded-2xl p-1`}>
    {#if wWinShift}
        <div
            class="bg-zinc-950 rounded-2xl w-full h-full grid place-items-center"
        >
            <h2 class="font-extrabold text-6xl uppercase">{wWinShift}</h2>
        </div>
    {/if}
    {#if !mounted}
        <div
            class="bg-zinc-950 rounded-2xl w-full h-full grid place-items-center"
        >
            <h2 class="font-extrabold text-6xl uppercase">🔃</h2>
        </div>
    {/if}
    {#if !wWinShift && mounted}
        <div class="grid gap-2 grid-cols-3 divide-solid divide-zinc-500">
            {#each slat.slat as x, a}
                {#each x as y, b}
                    <TicTacToeItem
                        {disabled}
                        on:playerMoved={handlePlayerMove}
                        id={[a, b]}
                        value={y}
                    />
                {/each}
            {/each}
        </div>
    {/if}
</section>
