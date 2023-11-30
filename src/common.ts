import { Chain, Metadata } from "evm-chainlist";

export type ChainsOptions = {
  data: Metadata[] | Chain[],
  lists?: Record<string, number[]>
  indexes?: string[],
}