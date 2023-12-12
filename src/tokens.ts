/**
 * Retrieves the token used for storing chains.
 *
 * @return {symbol} The token for chains storage.
 */
export function getChainsStorageToken() {
  return Symbol.for('chains#storage');
}

/**
 * Generates a token for the given name of the chains list
 *
 * @param {string} name - The name for the chain lsit
 * @return {symbol} - The generated token.
 */
export function getChainListToken(name) {
  return Symbol.for(`chains#list:${String(name)}`);
}


/**
 * Retrieves the token for the chains options.
 *
 * @return {symbol} The token for the chains options.
 */
export function getChainsOptionsToken() {
  return Symbol.for('chains#options');
}