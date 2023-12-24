# Nest.js Chainlist

[chainlist](https://github.com/xxamxx/chainlist) module for Nest framework (node.js)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/your-username/your-project/blob/master/LICENSE)

> ⚠️ This package is still in the development stage, please do not use it in the production environment!!!

## Features

- ChainsModule  

    ```typescript
    import { ChainsModule } from 'nestjs-chainlist';

    @Module({
        imports: [
            ChainsModule.forRootAsync({
                isGlobal: true,
                useFactory: (configService: ConfigService) => {
                    const data = configService.get('chains') as any[];
                    const lists = configService.get('chain_lists') as Record<string, number[]>;

                    return { data, lists };
                },
                inject: [ConfigService],
            }),
        ]
    })
    export class TestModule {}
    ```

- ChainsService  
    Provide ChainsService to access all chain and list.  
    it was extends to Chains class, see [chainlist](https://github.com/xxamxx/chainlist) for details.

    ```typescript
    import { ChainsService } from 'nestjs-chainlist';

    export class TestService {
        constructor(
        @Inject() 
        private readonly chainsService: ChainsService,
        ){}
    }
    ```

- @Chains() decorator  

    ```typescript
    import { Chains } from 'nestjs-chainlist';

    export class TestService {
        constructor(
        @Chains('list name') 
        private readonly chainlist: ChainList,
        ){}
    }
    ```

- Route params decorator  
    Extract `chain_id` from `req.query`:

    ```typescript
    @Get('/')
    findOne(@QueryChain('chain_id') chain: Chain) {}
    ```

    Extract `chainId` from `req.body`:

    ```typescript
    @Post('/')
    create(@BodyChain('chainIds') chains: Chain[]) {}
    ```

    Extract `chainId` from `req.params`:

    ```typescript
    @Get('/')
    findOne(@ParamChain('chainId') chain: Chain) {}
    ```

    Extract `x-chain-id` from `req.headers`:

    ```typescript
    @Get('/')
    findOne(@HeaderChain('x-chain-id') chain: Chain) {}
    ```

## Installation

```bash
npm i nestjs-chainlist
```

or

```bash
yarn add nestjs-chainlist
```

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request. Make sure to read the contribution guidelines before getting started.

## License

This project is licensed under the MIT License.
