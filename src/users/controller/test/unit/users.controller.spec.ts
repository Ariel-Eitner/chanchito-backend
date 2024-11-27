import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../users.controller';
import { UsersService } from '../../../service/users.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUserService: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

// Importa otros archivos de pruebas
import './users.controller.create.spec';
import './users.controller.error.spec';
