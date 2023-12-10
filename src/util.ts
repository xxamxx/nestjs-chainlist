import * as crypto from 'crypto';
import { ChainValue } from 'evm-chainlist';

export function md5(data: string, encoding: 'hex' | 'base64' = 'hex') {
  const hash = crypto.createHash('md5');
  return hash.update(data).digest(encoding);
}

export function generateInjectChainListToken(values: ChainValue[]) {
  return md5(values.join(','));
}