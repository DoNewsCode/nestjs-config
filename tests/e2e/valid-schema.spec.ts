/**
 * Created by Rain on 2020/3/27
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as assert from 'assert';
import { join } from 'path';
import { AppModule } from '../src/app.module';
import { ConfigService } from '../../lib';

describe('envFilePath test', () => {
  let app: INestApplication;

  it(`should validate loaded env variables`, async () => {
    try {
      const module = await Test.createTestingModule({
        imports: [AppModule.withSchemaValidation()],
      }).compile();

      app = module.createNestApplication();
      await app.init();
    } catch (err) {
      assert.strictEqual(
        err.message,
        'Config validation error: "PORT" is required. "DATABASE_NAME" is required',
      );
    }
  });

  it(`should parse loaded env variables`, async () => {
    const module = await Test.createTestingModule({
      imports: [
        AppModule.withSchemaValidation(join(__dirname, 'validation.yaml')),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const configService = app.get(ConfigService);
    assert.strictEqual(configService.get<string>('PORT'), 4000);
    assert.strictEqual(configService.get<string>('DATABASE_NAME'), 'test');
  });
});
