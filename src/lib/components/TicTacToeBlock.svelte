<script lang="ts">
    /* IMPORTS */
    import {
        activeSlats,
        type SlatID,
        currentPlayerShift,
        winnerSlats,
    } from "$lib/store";
    import { onMount } from "svelte";
    import TicTacToeItem from "./TicTacToeItem.svelte";
    import { createEventDispatcher } from "svelte";

    /* PROPS */
    export let id: SlatID;

    /* TYPES */
    type SLAT = Array<Array<XO>>;
    type XO = "X" | "O" | null;
    type _XO = "X" | "O";

    /* MAIN LOGIC */
    function executeMiniMaxAlgorithm(slat: SLAT, initFirst: boolean = true) { console.log("her",1 )
        // get shifts
        const freeShifts = getAllFreeShifts(slat);
        const ranks: number[] = [];
        console.log("her",2 )

        // check each shift is good and rank it
        freeShifts.forEach((x) => {
            // new board parralel if this move done
            const boardIfThisMoveDone = createSlatAfterShiftExecution(slat, x);

            // if this move can make game win
            if (checkIfGameIsOver(boardIfThisMoveDone))
                ranks.push(
                    encodeXOintoDigits(whoIsWinner(boardIfThisMoveDone)),
                );

            // recurursive rank
            const X = executeMiniMaxAlgorithm(slat, false);
            ranks.push(X as number);

            // break if winner found
            if (
                (whosNextTurn(slat) == "X" && X == 1) ||
                (whosNextTurn(slat) == "O" && X == -1)
            )
                return;
        });

        // get marks for minimax
        var marks = 0;
        if (whosNextTurn(slat) == "X") {
            marks = Math.max(...ranks);
        } else {
            marks = Math.min(...ranks);
        }
        console.log("her",4 )
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
    const countTerms = (array: Array<unknown>, whatToBeFind: any): number => {
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

    const whoIsWinner = (slat: SLAT): XO => {
        // possible win shifts
        const allWShifts = [
            [slat[0][0], slat[0][1], slat[0][2]],
            [slat[1][0], slat[1][1], slat[1][2]],
            [slat[2][0], slat[2][1], slat[2][2]],
            [slat[0][0], slat[1][0], slat[2][0]],
            [slat[0][1], slat[1][1], slat[2][1]],
            [slat[0][2], slat[1][2], slat[2][2]],
            [slat[0][0], slat[1][1], slat[2][2]],
            [slat[0][2], slat[1][1], slat[2][0]],
        ];
        let status = null;

        // check if some won
        allWShifts.forEach((shift) => {
            const [a, b, c] = shift;
            if (a && a === b && a === c) {
                status = a;
                return a;
            }
        });
        // else null
        return status;
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
            if ($currentPlayerShift == "X") {
                this.ai = "O";
            }
            if ($currentPlayerShift == "O") {
                this.ai = "X";
            }

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

        commandAItoMove() { console.log("her",4 )
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
                    // this.slat = createSlatAfterShiftExecution(this.slat, shift);
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
        // slat.initAIStep()
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

    onMount(() => console.log("READY"));
</script>

<section class={`brightness-90 aspect-square rounded-2xl p-1`}>
    {#if wWinShift}
        <div
            class="bg-zinc-950 rounded-2xl w-full h-full grid place-items-center"
        >
            <h2 class="font-extrabold text-6xl uppercase">{wWinShift}</h2>
        </div>
    {/if}
    {#if !wWinShift}
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
