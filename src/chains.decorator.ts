import { Inject } from '@nestjs/common';
import { ChainValue } from 'evm-chainlist';
import {
  METADATA_CHAINS_LIST,
  TARGET_CHAINS_LISTS
} from './constants';
import { getChainListToken } from './tokens';
import { generateInjectChainListToken } from './util';


/**
 * Provide Chains decorator for injecting an object of ChainList by the given name
 *
 * @param {string} name - The list name.
 * @return {Function} - The decorator function.
 */
export function Chains(name: string);
/**
 * Provide Chains decorator for injecting an object of ChainList by a list of chain values
 *
 * @param {ChainValue[]} values - An array of chain values.
 * @return {(target: object, key: string | symbol, index?: number) => void} - The decorator function.
 */
export function Chains(values: ChainValue[]);
/**
 * Generates a decorator function that can be used to add a chain name or a list of chain values to a target object.
 *
 * @param {string | ChainValue[]} nameOrValues - The name of the chain list or an array of chain values.
 * @return {(target: object, key: string | symbol, index?: number) => void} - The decorator function.
 */
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
