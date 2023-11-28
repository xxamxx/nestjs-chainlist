# Chainlist

`chainlist` for EVM-based Chains
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/your-username/your-project/blob/master/LICENSE)

## Description

the project is a library for interacting with metadata of the Chain. It provides a set of functions for reading metadata to the chain object, managing listings.

when your project need maintain multiple chain codes on some chain, it can help your mapping your chain metadata.

## Installation

```bash
npm i chainlist
```

or

```bash
yarn add chainlist
```

## Usage

Instantiate Chain and ChainList

```typescript
import { ChainList, buildChains } from 'chainlist';

const data = [{
  "name": "Ethereum Mainnet",
  "chain": "ETH",
  "icon": "ethereum",
  "rpc": [
    "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
    "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
    "https://api.mycryptoapi.com/eth"
  ],
  "features": [{ "name": "EIP155" }, { "name": "EIP1559" }],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://ethereum.org",
  "shortName": "eth",
  "chainId": 1,
  "networkId": 1,
  "code": "ethereum"
}, {
  "name": "Goerli",
  "title": "Ethereum Testnet Goerli",
  "chain": "ETH",
  "rpc": [
    "https://goerli.infura.io/v3/${INFURA_API_KEY}",
    "wss://goerli.infura.io/v3/${INFURA_API_KEY}",
    "https://rpc.goerli.mudit.blog/"
  ],
  "faucets": [
    "http://fauceth.komputing.org?chain=5&address=${ADDRESS}",
    "https://goerli-faucet.slock.it?address=${ADDRESS}",
    "https://faucet.goerli.mudit.blog"
  ],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://goerli.net/#about",
  "shortName": "gor",
  "chainId": 5,
  "networkId": 5,
  "status": "active",
  "testnet": true,
  "codes": {
    "internal": "goerli"
  }
}];

const chains = buildChains(data, {
  // specify index properties
  indexes: ['shortName', 'chain', 'codes.internal']
});
const list = new ChainList(chains);

const ethereum = list.get(1);
```

Get chain from ChainList

```typescript
// get ethereum
const ethereum = list.get(1);

console.log(ethereum.name); 
// output: Ethereum Mainnet

console.log(ethereum.isTestnet()); 
// output: false
```

```typescript
// get goerli
const goerli = list.get(5);

console.log(goerli.title); 
// output: Ethereum Testnet Goerli

console.log(goerli.isTestnet()); 
// output: true
```

Indexes, default indexes: chainId, networkId

```typescript
// get goerli by index
const goerli = list.get("goerli");

// match index value
console.log(goerli.is(5), goerli.is("ETH"), goerli.is("gor"), goerli.is("goerli")); 
// output: true true true

console.log(goerli.indexes()); 
// output: ['shortName', 'chain', 'codes.internal']

console.log(goerli.indexValues()); 
// output: ['gor', 'ETH', 'goerli']
```

Mange ChainList

```typescript
const list = new ChainList();
// add chain
list.add(new Chain({chainId: 1, code: 'eth'}, {indexes: ['code']}));
// get chain by code
list.get('eth')
// del chain by chainId
list.del(1)
```

## Examples

You can find more usage examples and code snippets in the examples directory.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request. Make sure to read the contribution guidelines before getting started.

## License

This project is licensed under the MIT License.
