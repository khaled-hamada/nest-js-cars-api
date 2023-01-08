import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('auth service', () => {
  let authService: AuthService;
  // create a fake copy of the users service
  let fakeUserService: Partial<UsersService>;
  const [testEmail, testPassword] = ['asd@asd.com', 'asdf'];
  const users: User[] = [];
  beforeEach(async () => {
    fakeUserService = {
      find: (email: string) => {
        return Promise.resolve(users.filter((user) => user.email === email));
      },
      create: (email: string, password: string): Promise<User> => {
        users.push({ id: Math.floor(Math.random() * 999999), email, password });
        return Promise.resolve(users[users.length - 1]);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });
  afterEach(() => jest.clearAllMocks());

  it('can create an instance of auth service', () => {
    expect(authService).toBeDefined();
  });

  it('create a new user with a slated and hashed password', async () => {
    const pass = 'asdf';
    const user: User = await authService.signup(testEmail, pass);
    expect(user.password).not.toEqual(pass);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(salt.length).toEqual(16);
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    expect(authService.signup(testEmail, testPassword)).rejects.toThrow(
      new BadRequestException('email in use'),
    );
  });

  it('throws an error if user is not registered in the database while sigin in', () => {
    expect(authService.signIn(testEmail + '1', testPassword)).rejects.toThrow(
      new NotFoundException('user not found'),
    );
  });

  it('throws an error if user is registered in the database while signing in with wrong pass', () => {
    expect(authService.signIn(testEmail, testPassword + 5)).rejects.toThrow(
      new BadRequestException('bad user credentials'),
    );
  });

  it('sign in user with correct credentials', async () => {
    const loggedUser = await authService.signIn(testEmail, testPassword);
    expect(loggedUser).toBeDefined();
    expect(loggedUser.email).toEqual(testEmail);
  });
});
