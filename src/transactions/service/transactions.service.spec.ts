import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from 'src/transactions/schemas/transaction.schema';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionModel: Model<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getModelToken('Transaction'), // Este es el token que NestJS usa para inyectar el modelo
          useValue: {
            // Proporcionar un mock del modelo
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
            // Agregar cualquier otro método mockeado que uses en el servicio
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionModel = module.get<Model<Transaction>>(
      getModelToken('Transaction'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Otros tests pueden ir aquí
});
