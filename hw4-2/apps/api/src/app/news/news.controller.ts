import { Body, Controller, Get, Header, Post } from '@nestjs/common';

import { IsNotEmpty } from 'class-validator';

import Redis from 'ioredis';
const redis = new Redis();

export class CreateNewsDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

@Controller('news')
export class NewsController {
  @Get()
  async getNews() {
    return new Promise((resolve) => {
      const news = Object.keys([...Array(20)])
        .map((key) => Number(key) + 1)
        .map((n) => ({
          id: n,
          title: `Важная новость ${n}`,
          description: ((rand) =>
            [...Array(rand(1000))]
              .map(() =>
                rand(10 ** 16)
                  .toString(36)
                  .substring(rand(10))
              )
              .join(' '))((max) => Math.ceil(Math.random() * max)),
          createdAt: Date.now(),
        }));

      news.forEach((item) => {
        redis.hset(
          `news`,
          `news:${item['id']}`,
          JSON.stringify({
            id: item['id'],
            title: `Важная новость ${item['id']}`,
            description: ((rand) =>
              [...Array(rand(1000))]
                .map(() =>
                  rand(10 ** 16)
                    .toString(36)
                    .substring(rand(10))
                )
                .join(' '))((max) => Math.ceil(Math.random() * max)),
            createdAt: Date.now(),
          })
        );
        // redis.hset(`news:${item['id']}`, "id", item['id']);
        // redis.hset(`news:${item['id']}`, "title", `Важная новость ${n}`)
        // redis.hset(`news:${item['id']}`, "description", (rand => ([...Array(rand(1000))].map(() => rand(10**16).toString(36).substring(rand(10))).join(' ')))(max => Math.ceil(Math.random() * max)))
        // redis.hset(`news:${item['id']}`, "createdAt", Date.now())
      });

      setTimeout(() => {
        redis.hgetall('news', function (err, obj) {
          // console.dir(obj);
          return resolve(obj);
        });
        // resolve(news);
      }, 100);
    });
  }

  @Post()
  @Header('Cache-Control', 'none')
  create(@Body() peaceOfNews: CreateNewsDto) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Новость успешно создана', peaceOfNews);
        resolve({ id: Math.ceil(Math.random() * 1000), ...peaceOfNews });
      }, 100);
    });
  }
}
