import { Inject } from '@nestjs/common';
import { ChainValue } from 'evm-chainlist';
import {
  METADATA_CHAINS_LIST,
  TARGET_CHAINS_LISTS
} from './constants';
import { generateInjectChainListToken } from './util';

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
 * @param {string} nameOrValues - the name parameter.
 * @return {Function} - the generated function comment.
 */
export function Chains(name: string);
export function Chains(values: ChainValue[]);
export function Chains(nameOrValues: string | ChainValue[]) {
  const name = Array.isArray(nameOrValues) ? generateInjectChainListToken(nameOrValues) : nameOrValues;
  
  return (target: object, key: string | symbol, index?: number) => {
    
    Inject(getChainListToken(name))(target, key, index);
    // init the list of name
    const list =
      Reflect.getMetadata(
        METADATA_CHAINS_LIST,
        TARGET_CHAINS_LISTS,
      ) || [];

    list.push({
      name,
      customized: Array.isArray(nameOrValues),
      values: Array.isArray(nameOrValues) ? nameOrValues : [],
    });

    // save the list of name
    Reflect.defineMetadata(
      METADATA_CHAINS_LIST,
      list,
      TARGET_CHAINS_LISTS,
    );
  };
}
