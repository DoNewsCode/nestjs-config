# nest config module

## 描述

参照官方 @nestjs/config

基于[js-yaml](https://github.com/nodeca/js-yaml)的[Nest](https://github.com/nestjs/nest)配置 module。

## Install

```bash
$ npm i @donews/nestjs-config
```

## 区别

1. 删除 dotenv 支持，转向 js-yaml 支持
2. 官方结构过于复杂
3. load 功能关闭，官方只能加载配置，过于无用，直接配置文件就行，场景不明

待支持:

1. load 增加加载类的可能性，用于扩充 configService
2. configService 在读取时可能发生错误,因为 key 不存在,发生错误

## Quick Start

1. 模块导入

```
import:[
    ConfigModule.forRoot(ConfigModuleOptions)
]
```

2. ConfigModuleOptions 对应的值

```typescript
export interface ConfigModuleOptions {
  // 是否将模块全局化
  isGlobal?: boolean;

  // 是否忽略环境变量配置文件
  ignoreEnvFile?: boolean;

  // 是否忽略检测 命令行输入的参数 检测
  ignoreCheckEnvVars?: boolean;

  // 配置文件地址，支持数组
  envFilePath?: string | string[];

  // 编码格式，暂时无效
  encoding?: string;

  // 校验参数 joi包
  validationSchema?: Joi.AnySchema;

  // joi 校验参数
  validationOptions?: ValidationOptions;
}
```

3. 使用

```typescript
class TestService {
  constructor(private readonly configService: ConfigService) {}
}
```

## License

Nest is [MIT licensed](LICENSE).
