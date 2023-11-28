import { ChainList, buildChains } from 'evm-chainlist';
import { Inject, Injectable } from '@nestjs/common';
import { getGlobalChainsToken } from './chains.decorator';
import { MODULE_OPTIONS_TOKEN } from './chains.module-definition';
import { ChainsOptions } from './common';

@Injectable()
export class ChainsService {
  private groups: Map<string, ChainList> = new Map<string, ChainList>();

  constructor(
    @Inject(getGlobalChainsToken()) private readonly globalChains: ChainList,
    @Inject(MODULE_OPTIONS_TOKEN) options?: ChainsOptions,
  ) {
    if (!options) return this;
    
    const {data, groups, ...opts} = options;
    const chains = buildChains(data, opts);
    chains.forEach(chain => this.globalChains.add(chain));

    if (groups) {
      Object.keys(groups).forEach(key => {
        if (!Array.isArray(groups[key]) || !groups[key]?.length) return;

        this.createChains(key, groups[key]);
      });
    }
  }

  /**
   * Creates a ChainList object and adds chains with the given chainIds to it.
   *
   * @param {string} name - The name of the chain group.
   * @param {number[]} chainIds - An array of chain IDs.
   * @return {ChainList} - The created ChainList object.
   */
  createChains(name, chainIds: number[]): ChainList {
    const chains = new ChainList();
    chainIds.forEach(chainId => this.globalChains.get(chainId) && chains.add(this.globalChains.get(chainId)));
    this.groups.set(name, chains);
    return chains;
  }

  /**
   * Retrieves the chains with a given name.
   *
   * @param {string} name - The name of the chains to retrieve.
   * @return {ChainList | undefined} - The chains with the given name, or undefined if not found.
   */
  getChains(name): ChainList | undefined {
    return this.groups.get(name);
  }
}
