import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ChainValue } from 'evm-chainlist';
import { get } from "lodash.get";
import { ChainsPipe } from './chains.pipe';
import { ChainDecoratorOptions } from './common';
import { assignCustomParameterMetadata } from './util';

type PartialChainDecoratorOptions = Partial<ChainDecoratorOptions>;

/**
 * Route handler request parameter decorator. Extracts the property of request
 * (`params` | `query` | `body` | `headers`) from the `req` object and populates the decorated
 * parameter with the value of the property of request. May also apply pipes to the bound
 * parameter.
 *
 * For example.
 * 
 * Extract `chainId` from `req.query`:
 * ```typescript
 * @Get('/')
 * findOne(@Chain('chainId') chain: Chain)
 * ```
 * 
 * Extract `chainId` from `req.params`:
 * ```typescript
 * @Get(':chainId')
 * findOne(@Chain('chainId', { paramtype: 'params' }) chain: Chain)
 * ```
 * 
 * Extract `chainId` from `req.body`:
 * ```typescript
 * @Post('/')
 * create(@Chain('chainIds') chains: Chain[])
 * ```
 * 
 * Validate `chainId` through the list name or the chain values:
 * ```typescript
 * @Get('/')
 * findOne(@Chain('chainId', 'list name') chain: Chain)
 * 
 * @Get('/')
 * findOne(@Chain('chainId', [1 , 5, 56]) chain: Chain)
 * ```
 * @param {string | ChainDecoratorOptions} paramOrOptions The parameter name or options
 * @param {[string | ChainValue[] | ChainDecoratorOptions]} listOrValuesOrOptions The list name or chain values or options
 * @param {[ChainDecoratorOptions]} options decorator options
 */
export function Chain(param: string);
export function Chain(options: ChainDecoratorOptions);
export function Chain(param: string, options: PartialChainDecoratorOptions);
export function Chain(param: string, listName: string, options: PartialChainDecoratorOptions);
export function Chain(param: string, supportChains: ChainValue[], options: PartialChainDecoratorOptions);
export function Chain(paramOrOptions: string | ChainDecoratorOptions, listOrValuesOrOptions?: string | ChainValue[] | PartialChainDecoratorOptions, options: PartialChainDecoratorOptions = {}) {
  options = Object.assign({}, options);
  if (typeof(paramOrOptions) === 'string') {
    options.param = paramOrOptions;
  }
  if (typeof(paramOrOptions) === 'object') {
    options = Object.assign(paramOrOptions, options);
  }

  if (Array.isArray(listOrValuesOrOptions)) {
    options.supportChains = listOrValuesOrOptions;
  }
  else if (typeof(listOrValuesOrOptions) === 'object') {
    options = Object.assign(listOrValuesOrOptions, options);
  }
  else if (typeof(listOrValuesOrOptions) === 'string') {
    options.supportChainList = listOrValuesOrOptions;
  }

  if (!options.param) {
    throw new TypeError('@Chain(): param argument is required');
  }

  const pipes = [ChainsPipe, ...(options.pipes || [])];
  const factory = (_options: ChainDecoratorOptions, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (_options.paramtype) return get(get(request, _options.paramtype), _options.param);
    // handle default paramtype
    if (request.method === 'GET') return get(request.query, _options.param);
    else return get(request.body, _options.param);
  }

  return (target: object, key: string | symbol, index?: number) => {
    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};
    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA, 
      assignCustomParameterMetadata(args, options.paramtype, index, factory, options, pipes), 
      target.constructor, 
      key
    );
  };
}
