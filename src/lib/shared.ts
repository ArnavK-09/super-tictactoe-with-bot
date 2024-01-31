/**
 * Shared Type
 */

export type XO = "X" | "O" | null;
export type _XO = "X" | "O";
export type SLAT = Array<Array<XO>>;

/**
 * Find Winner from Slat
 */
export const whoIsWinner = (slat: SLAT): XO => {
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
