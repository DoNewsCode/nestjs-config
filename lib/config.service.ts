/**
 * Created by Rain on 2020/3/26
 */
import { Inject, Injectable } from '@nestjs/common';
import get from 'lodash.get';
import { CONFIGURATION_TOKEN } from './config.constants';

function isUndefined(value: any): boolean {
  return typeof value === 'undefined';
}

@Injectable()
export class ConfigService {
  constructor(
    @Inject(CONFIGURATION_TOKEN)
    private readonly internalConfig: Record<string, any> = {},
  ) {}

  /**
   * Get a configuration value (either custom configuration or process environment variable)
   * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
   * It returns a default value if the key does not exist.
   * @param propertyPath
   * @param defaultValue
   */
  get<T = any>(propertyPath: string): T | undefined;
  /**
   * Get a configuration value (either custom configuration or process environment variable)
   * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
   * It returns a default value if the key does not exist.
   * @param propertyPath
   * @param defaultValue
   */
  get<T = any>(propertyPath: string, defaultValue: T): T;
  /**
   * Get a configuration value (either custom configuration or process environment variable)
   * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
   * It returns a default value if the key does not exist.
   * @param propertyPath
   * @param defaultValue
   */
  get<T = any>(propertyPath: string, defaultValue?: T): T | undefined {
    const processValue = process.env?.[propertyPath];
    if (!isUndefined(processValue)) {
      return (processValue as unknown) as T;
    }
    const internalValue = get(this.internalConfig, propertyPath);
    return isUndefined(internalValue) ? defaultValue : internalValue;
  }
}
