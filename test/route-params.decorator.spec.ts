import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { assignCustomParameterMetadata } from 'src/util';
import { BodyChain, ChainParam, HeaderChain, ParamChain, QueryChain } from '../src/route-params.decorator';

describe('Route Params Decorator', () => {
  ([
    [ChainParam, undefined],
    [BodyChain  , 'body'   ],
    [QueryChain , 'query'  ],
    [ParamChain , 'params' ],
    [HeaderChain, 'headers'],
  ] as [Function, string][]).forEach(([decorator, paramtype]: [Function, string]) => {
    describe(`@${decorator.name}()`, () => {
      const target = {};
      const key = 'test';
      const index = 0;
      function applyChainDecorator(...args) {
        return decorator.apply(null, args)(target, key, index);
      }
    
      function getDefineMetadataArgs(options) {
        if (!options.paramtype) options.paramtype = paramtype;
        return [
          ROUTE_ARGS_METADATA,
          assignCustomParameterMetadata(
            {},
            options.paramtype,
            index,
            expect.any(Function),
            options,
            expect.any(Array)
          ),
          target.constructor,
          key
        ]
      }  
    
      beforeEach(() => {
        if (jest.isMockFunction(Reflect.defineMetadata)) (Reflect.defineMetadata as any).mockReset();
        else Reflect.defineMetadata = jest.fn();
      });
    
      test('should throw an error if options.param is not defined', () => {
        expect(() => {
          decorator(undefined);
        }).toThrow(TypeError);
      });
    
      test('should return a function that sets metadata', () => {
        const options = { param: 'param1' } as any;
        Reflect.getMetadata = jest.fn().mockReturnValueOnce(undefined);
    
        applyChainDecorator(options);
    
        expect(Reflect.getMetadata).toHaveBeenCalledWith(ROUTE_ARGS_METADATA, target.constructor, key);
        expect(Reflect.defineMetadata).toHaveBeenCalledWith(...getDefineMetadataArgs(options));
      });
    
      test('should set options.param if paramOrOptions is a string', () => {
        const paramOrOptions = 'param1';
        
        applyChainDecorator(paramOrOptions);
    
        expect(Reflect.defineMetadata).toHaveBeenCalledWith(...getDefineMetadataArgs({
          param: paramOrOptions
        }));
      });
    
      test('should set options when paramOrOptions is an object', () => {
        const paramOrOptions = { param: 'param1' } as any;
        
        applyChainDecorator(paramOrOptions);
    
        expect(Reflect.defineMetadata).toHaveBeenCalledWith(...getDefineMetadataArgs(paramOrOptions));
      });
    
      test('should set options.supportChains if listOrValuesOrOptions is an array', () => {
        const listOrValuesOrOptions = ['chain1', 'chain2'];
    
        applyChainDecorator('param1', listOrValuesOrOptions);
    
        expect(Reflect.defineMetadata).toHaveBeenCalledWith(...getDefineMetadataArgs({
          param: 'param1',
          supportChains: listOrValuesOrOptions
        }));
      });
    
      test('should set options when listOrValuesOrOptions is an object', () => {
        const listOrValuesOrOptions = { param: 'param2' } as any;
    
        applyChainDecorator('param1', listOrValuesOrOptions);
    
        expect(Reflect.defineMetadata).toHaveBeenCalledWith(...getDefineMetadataArgs({
          ...listOrValuesOrOptions,
          param: 'param1'
        }));
      });
    
      test('should set options.supportChainList if listOrValuesOrOptions is a string', () => {
        const options = {} as any;
        const listOrValuesOrOptions = 'list1';
    
        applyChainDecorator('param1', listOrValuesOrOptions, options);
    
        expect(Reflect.defineMetadata).toHaveBeenCalledWith(...getDefineMetadataArgs({
          supportChainList: listOrValuesOrOptions,
          param: 'param1'
        }));
      });
    });
  })
})