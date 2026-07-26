import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'better-sqlite3',
  database: 'db.sqlite',
  autoLoadEntities: true,
  synchronize: true, //dev only
  logging: false,
};
