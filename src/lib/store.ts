// const count = writable(0);
// count.subscribe((value) => { console.log(value); }); // logs '0'
// count.set(1); // logs '1'
// count.update((n) => n + 1); // logs '2'

// imports
import { writable } from "svelte/store";

// types
export type SlatID = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type WSlat = {
  id: SlatID;
  shift: "X" | "O";
};

/**
 * Move of current player | X DEFAULT
 */
export const currentPlayerShift = writable<"X">("X");

/**
 * Current Active Slats
 */
export const activeSlats = writable<SlatID[]>([0]);

/**
 * Slats that are won
 */
export const winnerSlats = writable<WSlat[]>([]);
