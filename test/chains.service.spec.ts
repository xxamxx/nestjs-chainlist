import { Chain } from 'evm-chainlist';
import { ChainsService } from "../src/index";

describe('ChainsService', () => {
  let chainsService: ChainsService;

  beforeEach(async () => {
      chainsService = new ChainsService()
  });

  describe('getChain', () => {
    it('should return a chain', async () => {
      const chain = new Chain({
        name: 'Test Chain',
        chainId: 0,
      });
      jest.spyOn(chainsService, 'getChain').mockImplementation(() => chain);

      expect(await chainsService.getChain(1)).toBe(chain);
    });
  });
});
