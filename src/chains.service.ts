import { Chain, ChainList, buildChains } from 'evm-chainlist';
import { Inject, Injectable } from '@nestjs/common';
import { getGlobalChainListToken } from './chains.decorator';
import { MODULE_OPTIONS_TOKEN } from './chains.module-definition';
import { ChainsOptions } from './common';

@Injectable()
export class ChainsService<T extends Chain = Chain> {
  private groups = new Map<string, ChainList<T>>();

  constructor(
    @Inject(getGlobalChainListToken()) private readonly globalChainList: ChainList<T>,
    @Inject(MODULE_OPTIONS_TOKEN) options?: ChainsOptions,
  ) {
    if (!options) return this;
    
    const {data, groups, builder, ...opts} = options;
    const chains = builder ? builder<T>(data, opts) : buildChains(data, opts) as T[];
    chains.forEach(chain => this.globalChainList.add(chain));

    if (groups) {
      Object.keys(groups).forEach(key => {
        if (!Array.isArray(groups[key]) || !groups[key]?.length) return;

        this.createChainList(key, groups[key]);
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
  createChainList(name, chainIds: number[]): ChainList<T> {
    const chains = new ChainList<T>();
    chainIds.forEach(chainId => this.globalChainList.get(chainId) && chains.add(this.globalChainList.get(chainId)));
    this.groups.set(name, chains);
    return chains;
  }

  /**
   * Retrieves the chains with a given name.
   *
   * @param {string} name - The name of the chains to retrieve.
   * @return {ChainList | undefined} - The chains with the given name, or undefined if not found.
   */
  getChainList(name): ChainList<T> | undefined {
    return this.groups.get(name);
  }

  getChain(value): T | undefined {
    return this.globalChainList.get(value);
  }
}
