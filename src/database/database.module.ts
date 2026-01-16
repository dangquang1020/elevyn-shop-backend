import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const DRIZZLE_DB = 'DRIZZLE_DB';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_DB,
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.get<string>('database.url');
        if (!connectionString) {
          throw new Error('DATABASE_URL is not defined in the configuration');
        }

        const queryClient = postgres(connectionString);
        return drizzle(queryClient, { schema });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DRIZZLE_DB],
})
export class DatabaseModule {}
