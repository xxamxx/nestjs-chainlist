import { Inject, Injectable } from '@nestjs/common';
import { Chain, Chains } from 'evm-chainlist';
import { getChainsStorageToken } from './chains.decorator';
import { MODULE_OPTIONS_TOKEN } from './chains.module-definition';
import { ChainsOptions } from './common';

@Injectable()
export class ChainsService<T extends Chain = Chain> extends Chains<T> {
  
  constructor(
    @Inject(getChainsStorageToken()) storage?: Map<string, T>,
    @Inject(MODULE_OPTIONS_TOKEN) options: ChainsOptions = {data: []},
  ) {
    const {data, ...opts} = options;

    super(data, { ...opts, storage });
  }
}
