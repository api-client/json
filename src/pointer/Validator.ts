/**
 * Checks if the token is a valid array token and throws an error when it's not.
 *
 * @param token The token to validate
 * @param size The size of the array
 */
export function validArrayToken(token: string, size: number): void {
  if (token === "-") {
    return;
  }

  const error = new Error("Invalid pointer");
  const { length } = token;

  if (length > 1 && token[0] === "0") {
    throw error;
  }

  const idx = +token;

  if (Number.isNaN(idx)) {
    throw error;
  }

  if (Math.abs(idx).toString() !== token) {
    throw error;
  }

  if (idx < 0) {
    throw error;
  }

  if (idx > size) {
    throw error;
  }
};
