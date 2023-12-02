import { ConfigurableModuleBuilder, Provider } from '@nestjs/common';
import { ChainsService } from './';
import { getChainListToken, getChainsStorageToken } from "./chains.decorator";
import { ChainsOptions } from './common';
import { CHAINS_CONTEXT_LIST_METADATA, GLOBAL_CHAINS_CONTEXT_LIST_TARGET } from './constants';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ChainsOptions>()
    .setExtras<{ isGlobal?: boolean } & any>(
      { isGlobal: true },
      (definition, extras) => {
        
        const names =
        Reflect.getMetadata(
          CHAINS_CONTEXT_LIST_METADATA,
          GLOBAL_CHAINS_CONTEXT_LIST_TARGET,
        ) || [];

        const providers: Provider[] = [
          ...(definition.providers || []),
          
          {
            provide: getChainsStorageToken(),
            useValue: Object.seal(new Map()),
          },

          // init the chains service for manage all chains
          ChainsService,

          // init the chain list of decorator
          ...names.map((name) => ({
            provide: getChainListToken(name),
            useFactory: (service: ChainsService) => service.getChainList(name),
            inject: [ChainsService],
          })),
        ];
        const exports = [...(definition.exports || []), ...providers];

        return {
          ...definition,
          providers,
          exports,
          global: extras.isGlobal !== undefined ? extras.isGlobal : true,
        };
      },
    )
    .setClassMethodName('forRoot')
    .build();
