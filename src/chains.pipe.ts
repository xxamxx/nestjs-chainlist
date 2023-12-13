
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Chain } from 'evm-chainlist';
import { ChainsService } from './chains.service';
import { ChainDecoratorOptions } from './common';

@Injectable()
export class ChainsPipe<T = any | any[], R extends Chain = Chain> implements PipeTransform<T, T extends Array<any> ? Array<R> : R> {
  private readonly chainsService: ChainsService;

  transform<T = any | any[], R extends Chain = Chain>(value: T, metadata: ArgumentMetadata): T extends Array<any> ? Array<R> : R {
    const options = metadata.data as unknown as ChainDecoratorOptions;
    let list = this.chainsService.createChainList(options.supportChains || []);
    if (options.supportChainList) {
      const _list = this.chainsService.getChainList(options.supportChainList);
      _list.forEach((chain) => list.add(chain));
    }

    if (options.unsupportChains?.length) {
      options.unsupportChains.forEach((chain) => list.del(chain));
    }

    if (Array.isArray(value)) {
      const invalidValues = value.filter((val) => !list.include(val));
      if (invalidValues.length > 0) {
        throw new BadRequestException(`Invalid chain values: ${invalidValues.join(', ')}`);
      }

      return value.map(val => this.chainsService.getChain(val)) as any;
    }
    else {
      if (!list.include(value as any)) {
        throw new BadRequestException(`Invalid chain value: ${value}`);
      }

      return this.chainsService.getChain(value) as any;
    }
  }
}