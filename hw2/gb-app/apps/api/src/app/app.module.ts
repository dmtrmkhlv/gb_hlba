import { CacheModule, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';

@Module({
  imports: [CacheModule.register({ isGlobal: true }), NewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
