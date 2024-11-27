import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from '../schemas/wallet.schema';

describe('WalletService', () => {
  let service: WalletService;
  let walletModel: Model<Wallet>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getModelToken('Wallet'), // Token para el modelo Wallet
          useValue: {
            // Mock de las funciones que uses en WalletService
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
            // Agrega más métodos mockeados según sea necesario
          },
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    walletModel = module.get<Model<Wallet>>(getModelToken('Wallet'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Añade más tests según sea necesario
});
