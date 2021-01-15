/**
 * Created by Rain on 2020/3/25
 */
import { ValidationOptions } from '@hapi/joi';
import { DynamicModule, FactoryProvider, Module } from '@nestjs/common';
import * as fs from 'fs';
import { load } from 'js-yaml';
import { ConfigModuleOptions } from './interfaces';
import { ConfigService } from './config.service';
import {
  CONFIGURATION_TOKEN,
  VALIDATED_ENV_LOADER,
  VALIDATED_ENV_PROPNAME,
} from './config.constants';

@Module({
  providers: [
    {
      provide: CONFIGURATION_TOKEN,
      useFactory: () => ({}),
    },
    ConfigService,
  ],
  exports: [ConfigService],
})
export class ConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    let validatedEnvConfig: Record<string, any> | undefined = undefined;

    // 忽略 配置文件
    if (!options.ignoreEnvFile) {
      // 是否有检查文档
      if (options.validationSchema) {
        // 加载配置文件
        let config = this.loadConfigFile(options);
        // 是否忽略process.env上的参数校验
        if (!options.ignoreCheckEnvVars) {
          config = {
            ...process.env,
            ...config,
          };
        }
        const validationOptions = this.getSchemaValidationOptions(options);
        const {
          error,
          value: validatedConfig,
        } = options.validationSchema.validate(config, validationOptions);

        if (error) {
          throw new Error(`Config validation error: ${error.message}`);
        }
        validatedEnvConfig = validatedConfig;
      } else {
        validatedEnvConfig = this.loadConfigFile(options);
      }
    }

    const providers: FactoryProvider[] = [];
    // 将值 赋值进  内部缓存
    if (validatedEnvConfig) {
      const validatedEnvConfigLoader = {
        provide: VALIDATED_ENV_LOADER,
        useFactory: (innerCache: Record<string, any>) => {
          innerCache[VALIDATED_ENV_PROPNAME] = validatedEnvConfig;
          if (validatedEnvConfig !== undefined) {
            for (const key of Object.keys(validatedEnvConfig)) {
              innerCache[key] = validatedEnvConfig[key];
            }
          }
        },
        inject: [CONFIGURATION_TOKEN],
      };
      providers.push(validatedEnvConfigLoader);
    }

    return {
      module: ConfigModule,
      global: options.isGlobal,
      providers: providers,
      exports: [ConfigService, ...providers],
    };
  }

  private static loadConfigFile(options: ConfigModuleOptions) {
    const envFilePaths: string[] = Array.isArray(options.envFilePath)
      ? options.envFilePath
      : [options.envFilePath || process.cwd() + '/config/default.yaml'];

    let config: ReturnType<typeof load> = {};
    for (const envFilePath of envFilePaths) {
      if (fs.existsSync(envFilePath)) {
        config = Object.assign(
          load(fs.readFileSync(envFilePath, { encoding: 'utf8' })),
          config,
        );
      }
    }
    return config;
  }

  private static getSchemaValidationOptions(
    options: ConfigModuleOptions,
  ): ValidationOptions {
    if (options.validationOptions) {
      if (typeof options.validationOptions?.allowUnknown === 'undefined') {
        options.validationOptions.allowUnknown = true;
      }
      return options.validationOptions || {};
    }
    return {
      abortEarly: false,
      allowUnknown: true,
    };
  }
}
