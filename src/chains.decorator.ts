import { Inject } from '@nestjs/common';
import {
  CHAINS_NAME_METADATA, 
  CHAINS_CONTEXT_LIST_METADATA,
  GLOBAL_CHAINS_CONTEXT_LIST_TARGET,
  S_GLOBAL_CHAINS,
} from './constants';

export function getGlobalChainsToken() {
  return S_GLOBAL_CHAINS;
}


/**
 * Generates a token for the given name of the chains list
 *
 * @param {string} name - The name for the chain lsit
 * @return {string} - The generated token.
 */
export function getChainsToken(name) {
  return `${CHAINS_NAME_METADATA}#${String(name)}`;
}


/**
 * Generates a function comment for the given function body.
 *
 * @param {string} name - the name parameter.
 * @return {Function} - the generated function comment.
 */
export function Chains(name) {
  return (target: object, key: string | symbol, index?: number) => {
    Inject(getChainsToken(name))(target, key, index);
    const list =
      Reflect.getMetadata(
        CHAINS_CONTEXT_LIST_METADATA,
        GLOBAL_CHAINS_CONTEXT_LIST_TARGET,
      ) || [];
    list.push(name);
    Reflect.defineMetadata(
      CHAINS_CONTEXT_LIST_METADATA,
      list,
      GLOBAL_CHAINS_CONTEXT_LIST_TARGET,
    );
  };
}
