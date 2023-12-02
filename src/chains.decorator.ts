import { Inject } from '@nestjs/common';
import {
  CHAINS_CONTEXT_LIST_METADATA,
  GLOBAL_CHAINS_CONTEXT_LIST_TARGET
} from './constants';

export function getChainsStorageToken() {
  return 'chains:storage';
}

/**
 * Generates a token for the given name of the chains list
 *
 * @param {string} name - The name for the chain lsit
 * @return {string} - The generated token.
 */
export function getChainListToken(name) {
  return `chains:list#${String(name)}`;
}


/**
 * Provide Chains decorator for injecting an object of ChainList
 *
 * @param {string} name - the name parameter.
 * @return {Function} - the generated function comment.
 */
export function Chains(name) {
  return (target: object, key: string | symbol, index?: number) => {
    Inject(getChainListToken(name))(target, key, index);
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
