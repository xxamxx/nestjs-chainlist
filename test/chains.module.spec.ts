import { Test } from '@nestjs/testing';
import { ChainsModule, ChainsService } from "../src/index";

describe('ChainsModule', () => {
  let chainsService: ChainsService;

  beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          ChainsModule.forRootAsync({
            isGlobal: true,
            useFactory: () => {
                return { 
                  data: [{
                    name: 'Test Chain',
                    chainId: 0,
                    testnet: true,
                  }, {
                    name: 'Test Chain 2',
                    chainId: 1,
                    testnet: false,
                  }, {
                    name: 'Test Chain 3',
                    chainId: 2,
                    testnet: false,
                  }], 
                  lists: {
                    'list1': [1, 2],
                    'list2': [0],
                  }
                };
            },
        }),
        ],
      }).compile();

      chainsService = moduleRef.get<ChainsService>(ChainsService);
  });

  describe('getChain', () => {
    test('should return Test Chain 2', async () => {
      const chain = chainsService.getChain(1);
      expect(chain.name).toBe('Test Chain 2');
    });

    test('should return undefined', async () => {
      const chain = chainsService.getChain(4);
      expect(chain).toBe(undefined);
    });
  });

  describe('getChainList', () => {
    test('should return list1', async () => {
      const list = chainsService.getChainList('list1');
      
      expect(list.getChainIds()).toStrictEqual([1, 2]);
    });

    test('should return list2', async () => {
      const list = chainsService.getChainList('list2');
      
      expect(list.getChainIds()).toStrictEqual([0]);
    });

    test('should return undefined', async () => {
      const list = chainsService.getChainList('list3');
      
      expect(list).toBe(undefined);
    });
  });
});
