import { Test, TestingModule } from '@nestjs/testing';
import { SmartCarController } from './smartCar.controller';

describe('SmartcarController', () => {
  let controller: SmartCarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmartCarController],
    }).compile();

    controller = module.get<SmartCarController>(SmartCarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
