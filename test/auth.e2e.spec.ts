import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;
  const [testEmail, testPassword] = ['khaled@gmail.com', '1234!@ASEase'];
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: testPassword })
      .expect(201);
    const { id, email } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(testEmail);
  });
  it('handles a signin request', async () => {
    let res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: testPassword })
      .expect(201);
    let { id, email } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(testEmail);

    const cookie = res.get('Set-Cookie');

    res = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    ({ id, email } = res.body);
    expect(id).toBeDefined();
    expect(email).toEqual(testEmail);
  });
});
