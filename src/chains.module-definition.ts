import { ConfigurableModuleBuilder, Provider } from '@nestjs/common';
import { ChainsService } from './';
import { ChainsOptions } from './common';
import { METADATA_CHAINS_LIST, TARGET_CHAINS_LISTS } from './constants';
import { getChainListToken, getChainsOptionsToken, getChainsStorageToken } from "./tokens";

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ChainsOptions>({
    optionsInjectionToken: getChainsOptionsToken(),
  })
    .setExtras<{ isGlobal?: boolean } & any>(
      { isGlobal: true },
      (definition, extras) => {
        
        const list = Reflect.getMetadata(
            METADATA_CHAINS_LIST,
            TARGET_CHAINS_LISTS,
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
          ...list.map((option) => ({
            provide: getChainListToken(option.name),
            useFactory: (service: ChainsService) => option.customized 
              ? service.createChainList(option.values)
              : service.getChainList(option.customized),
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
