import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ChainValue } from 'evm-chainlist';
import get from "lodash.get";
import { ChainsPipe } from './chains.pipe';
import { ChainParamDecoratorOptions } from './common';
import { assignCustomParameterMetadata, isNil } from './util';

type PartialChainParamDecoratorOptions = Partial<ChainParamDecoratorOptions>;

function createOptions(
  paramOrOptions: string | ChainParamDecoratorOptions, 
  listOrValuesOrOptions?: string | ChainValue[] | PartialChainParamDecoratorOptions, 
  options?: PartialChainParamDecoratorOptions
): ChainParamDecoratorOptions {
  let _options: PartialChainParamDecoratorOptions = {};

  if (isNil(options) && typeof(paramOrOptions) === 'object') {
    _options = Object.assign({}, paramOrOptions);
  }
  else if (isNil(options) && typeof(listOrValuesOrOptions) === 'object' && !Array.isArray(listOrValuesOrOptions)) {
    _options = Object.assign({}, listOrValuesOrOptions);
  }
  else {
    _options = Object.assign({}, options || {});
  }

  if (typeof(paramOrOptions) === 'string') {
    _options.param = paramOrOptions;
  }

  if (Array.isArray(listOrValuesOrOptions)) {
    _options.supportChains = listOrValuesOrOptions;
  }
  else if (typeof(listOrValuesOrOptions) === 'string') {
    _options.supportChainList = listOrValuesOrOptions;
  }

  return _options as ChainParamDecoratorOptions;
}


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
 * findOne(@ChainParam('chainId') chain: Chain)
 * ```
 * 
 * Extract `chainId` from `req.params`:
 * ```typescript
 * @Get(':chainId')
 * findOne(@ChainParam('chainId', { paramtype: 'params' }) chain: Chain)
 * ```
 * 
 * Extract `chainId` from `req.body`:
 * ```typescript
 * @Post('/')
 * create(@ChainParam('chainIds') chains: Chain[])
 * ```
 * 
 * Validate `chainId` through the list name or the chain values:
 * ```typescript
 * @Get('/')
 * findOne(@ChainParam('chainId', 'list name') chain: Chain)
 * 
 * @Get('/')
 * findOne(@ChainParam('chainId', [1 , 5, 56]) chain: Chain)
 * ```
 * @param {(string|ChainParamDecoratorOptions)} paramOrOptions The parameter name or options
 * @param {(string|ChainValue[]|ChainParamDecoratorOptions)} [listOrValuesOrOptions] The list name or chain values or options
 * @param {ChainParamDecoratorOptions} [options] decorator options
 */
export function ChainParam(param: string);
export function ChainParam(options: ChainParamDecoratorOptions);
export function ChainParam(param: string, options: PartialChainParamDecoratorOptions);
export function ChainParam(param: string, listName: string, options: PartialChainParamDecoratorOptions);
export function ChainParam(param: string, supportChains: ChainValue[], options: PartialChainParamDecoratorOptions);
export function ChainParam(paramOrOptions, listOrValuesOrOptions?, options?) {
  options = createOptions(paramOrOptions, listOrValuesOrOptions, options);

  if (!options.param) {
    throw new TypeError('`param` is required');
  }

  const pipes = [ChainsPipe, ...(options.pipes || [])];
  
  return (target: object, key: string | symbol, index?: number) => {
    const factory = function (_options: ChainParamDecoratorOptions, ctx: ExecutionContext) {
      const request = ctx.switchToHttp().getRequest();
      if (_options.paramtype) return get(get(request, _options.paramtype), _options.param);
      // handle default paramtype
      if (request.method === 'GET') return get(request.query, _options.param);
      else return get(request.body, _options.param);
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};
    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA, 
      assignCustomParameterMetadata(args, options.paramtype, index, factory, options, pipes), 
      target.constructor, 
      key
    );
  };
}


type ChainDecoratorOptions = Omit<ChainParamDecoratorOptions, 'paramtype'>;
type PartialChainDecoratorOptions = Partial<ChainDecoratorOptions>;

/**
 * Extracts the property of request(`query`) from the `req` object and populates 
 * the decorated parameter with the value of the property of request.
 * 
 * @example  
 * Extract `chain_id` from `req.query`:
 * ```typescript
 * @Get('/')
 * findOne(@QueryChain('chain_id') chain: Chain) {}
 * ```
 * @see {@link ChainParam}
 */
export declare function QueryChain(param: string);
export declare function QueryChain(options: ChainDecoratorOptions);
export declare function QueryChain(param: string, options: PartialChainDecoratorOptions);
export declare function QueryChain(param: string, listName: string, options: PartialChainDecoratorOptions);
export declare function QueryChain(param: string, supportChains: ChainValue[], options: PartialChainDecoratorOptions);

/**
 * Extracts the property of request(`body`) from the `req` object and populates 
 * the decorated parameter with the value of the property of request.
 * the property of request.
 * 
 * @example  
 * Extract `chainId` from `req.body`:
 * ```typescript
 * @Post('/')
 * create(@BodyChain('chainIds') chains: Chain[]) {}
 * ```
 * @see {@link ChainParam}
 */
export declare function BodyChain(param: string);
export declare function BodyChain(options: ChainDecoratorOptions);
export declare function BodyChain(param: string, options: PartialChainDecoratorOptions);
export declare function BodyChain(param: string, listName: string, options: PartialChainDecoratorOptions);
export declare function BodyChain(param: string, supportChains: ChainValue[], options: PartialChainDecoratorOptions);

/**
 * Extracts the property of request(`params`) from the `req` object and populates 
 * the decorated parameter with the value of the property of request.
 * 
 * @example  
 * Extract `chainId` from `req.params`:
 * ```typescript
 * @Get('/')
 * findOne(@ParamChain('chainId') chain: Chain) {}
 * ```
 * @see {@link ChainParam}
 */
export declare function ParamChain(param: string);
export declare function ParamChain(options: ChainDecoratorOptions);
export declare function ParamChain(param: string, options: PartialChainDecoratorOptions);
export declare function ParamChain(param: string, listName: string, options: PartialChainDecoratorOptions);
export declare function ParamChain(param: string, supportChains: ChainValue[], options: PartialChainDecoratorOptions);

/**
 * Extracts the property of request(`headers`) from the `req` object and populates 
 * the decorated parameter with the value of the property of request.
 * 
 * @example  
 * Extract `x-chain-id` from `req.headers`:
 * ```typescript
 * @Get('/')
 * findOne(@HeaderChain('x-chain-id') chain: Chain) {}
 * ```
 * @see {@link ChainParam}
 */
export declare function HeaderChain(param: string);
export declare function HeaderChain(options: ChainDecoratorOptions);
export declare function HeaderChain(param: string, options: PartialChainDecoratorOptions);
export declare function HeaderChain(param: string, listName: string, options: PartialChainDecoratorOptions);
export declare function HeaderChain(param: string, supportChains: ChainValue[], options: PartialChainDecoratorOptions);



[
  ['Body', 'body'], 
  ['Query', 'query'], 
  ['Param', 'params'], 
  ['Header', 'headers'],
].forEach(([name, paramtype]) => {
  const fn = function (paramOrOptions, listOrValuesOrOptions?, options?) {
    const _options = createOptions(paramOrOptions, listOrValuesOrOptions, options);
    _options.paramtype = paramtype;
    return ChainParam(_options);
  }
  Object.defineProperty(fn, "name", {value: `${name}Chain`});
  exports[`${name}Chain`] = fn;
});