/**
 * Created by Rain on 2020/3/26
 */
import { DynamicModule, Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigService } from '../../lib/config.service';
import { ConfigModule } from '../../lib/config.module';
import * as Joi from '@hapi/joi';

@Module({})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  static withEnvFile(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: join(__dirname, './config/development.yaml'),
        }),
      ],
    };
  }

  static withMultipleEnvFile(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [
            join(__dirname, './config/development.yaml'),
            join(__dirname, './config/development2.yaml'),
          ],
        }),
      ],
    };
  }

  static withSchemaValidation(envFilePath?: string): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath,
          validationSchema: Joi.object({
            PORT: Joi.number().required(),
            DATABASE_NAME: Joi.string().required(),
          }),
        }),
      ],
    };
  }

  getConfigService() {
    return this.configService;
  }
}
