import { Metadata } from "evm-chainlist";

export type ChainsOptions = {
  data: Metadata[],
  indexes?: string[],
  groups?: Record<string, number[]>
  builder?: <T>(metadatas: Metadata[], options: any) => T[]
}