import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;
  const [testEmail, testPassword] = ['asd@asd.com', 'asdf'];

  beforeEach(async () => {
    const users: User[] = [
      {
        id: 1,
        email: testEmail,
        password: testPassword,
      },
    ];
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve(users.find((user) => user.id === id)),
      find: (email: string) =>
        Promise.resolve(users.filter((user) => user.email === email)),
      // remove: (id: numer) => {
      //   const user = users.find((user) => user.id === id);
      //   if
      // },
      // update: () => {},
    };

    fakeAuthService = {
      // signup: () => {},
      // signIn: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users with a given email', async () => {
    const users = await controller.findAllUsers(testEmail);
    expect(users.length).toBeGreaterThanOrEqual(1);
    expect(users[0].email).toEqual(testEmail);
  });

  it('find a user with a given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('should throw an error if the user is not found', async () => {
    const user = await controller.findUser('5');
    expect(user).toBeUndefined();
  });
});
