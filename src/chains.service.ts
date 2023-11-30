import { Inject, Injectable } from '@nestjs/common';
import { Chain, ChainList, Chains } from 'evm-chainlist';
import { getGlobalChainListToken } from './chains.decorator';
import { MODULE_OPTIONS_TOKEN } from './chains.module-definition';
import { ChainsOptions } from './common';

@Injectable()
export class ChainsService<T extends Chain = Chain> extends Chains {
  @Inject(getGlobalChainListToken()) protected readonly globalChainList: ChainList<T>;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) options: ChainsOptions = {data: []},
  ) {
    const {data, ...opts} = options;

    super(data, opts);
  }
}
