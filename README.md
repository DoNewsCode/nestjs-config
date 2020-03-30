# nest config module

参照官方 @nestjs/config

1. 删除 dotenv 支持，转向 js-yaml 支持
2. 官方结构过于复杂
3. load 功能关闭，官方只能加载配置，过于无用，直接配置文件就行，场景不明

代支持:

1. load 增加加载类的可能性，用于扩充 configService
2. configService 在读取时可能发生错误,因为key不存在,发生错误

## License

Nest is [MIT licensed](LICENSE).
