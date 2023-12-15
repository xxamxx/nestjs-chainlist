import { PipeTransform } from "@nestjs/common";
import { Chain, ChainValue, Metadata } from "evm-chainlist";

export type ChainsOptions = {
  data: Metadata[] | Chain[],
  lists?: Record<string, number[]>
  indexes?: string[],
}

/**
 * - param: Specifies the name of the parameter, must provide the param.
 * - paramtype: Specifies the type of the parameter (e.g., params, body, query, headers, or custom), defaults value through the request method.
 * - supportChainList: Specifies a list of supported chain names, defaults to undefined.
 * - supportChains: Specifies a list of supported chain values, defaults to `[]`.
 * - unsupportChains: Specifies a list of unsupported chain values, defaults to `[]`.
 * - validate: Specifies whether to validate the chain decorator options, defaults to `true`.
 * - pipes: Specifies an array of pipe transforms to apply to the chain decorator options, defaults to `[]`.
 */
export type ChainParamDecoratorOptions = {
  param: string;
  paramtype?: 'params' | 'body' | 'query' | 'headers' | string;
  supportChainList?: string;
  supportChains?: ChainValue[];
  unsupportChains?: ChainValue[];
  validate?: boolean;
  pipes?: PipeTransform[];
}