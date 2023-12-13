import { Inject, Injectable, Optional } from '@nestjs/common';
import { Chain, Chains } from 'evm-chainlist';
import { ChainsOptions } from './common';
import { getChainsOptionsToken, getChainsStorageToken } from './tokens';

@Injectable()
export class ChainsService<T extends Chain = Chain> extends Chains<T> {
  constructor(
    @Optional() @Inject(getChainsStorageToken()) storage?: Map<string, T>,
    @Optional() @Inject(getChainsOptionsToken()) options: ChainsOptions = {data: []},
  ) {
    const {data, ...opts} = options;

    super(data, { ...opts, storage });
  }
}
