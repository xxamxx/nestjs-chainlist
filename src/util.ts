import { CUSTOM_ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import * as crypto from 'crypto';
import { ChainValue } from 'evm-chainlist';

export function md5(data: string, encoding: 'hex' | 'base64' = 'hex') {
  const hash = crypto.createHash('md5');
  return hash.update(data).digest(encoding);
}

export function generateInjectChainListToken(values: ChainValue[]) {
  return md5(values.join(','));
}

export function isFunction(value): value is Function {
  return typeof(value) === 'function';
}

export function isNil(value) {
  return typeof(value) === 'undefined' || value === null;
}

export function assignCustomParameterMetadata(args, paramtype, index, factory, data, ...pipes) {
  return Object.assign(Object.assign({}, args), { [`${paramtype}${CUSTOM_ROUTE_ARGS_METADATA}:${index}`]: {
          index,
          factory,
          data,
          pipes,
      } });
}