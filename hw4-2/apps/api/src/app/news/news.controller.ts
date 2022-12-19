import { Body, Controller, Get, Header, Param, Post } from '@nestjs/common';

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
      const authorArr = ['Иванов', 'Петров', 'Сидоров', 'Тютчев', 'Пушкин', 'Куприн', 'Давлатов', 'Фрейд', 'Гоголь', 'Зодчев', 'Самарский', 'Карпов', 'Самсонов', 'Лютиков', 'Пришвин', 'Агапов', 'Лосев', 'Ильин', 'Афанасьев', 'Акимов', 'Антонов', 'Вавилова', 'Зайцев', 'Исаев', 'Колесников', 'Котов', 'Мельников', 'Макаров', 'Морозов', 'Суворов', 'Титов', 'Трофимов', 'Фомина', 'Цветкова', 'Шилов', 'Юдин'];

      const news = Object.keys([...Array(20)])
        .map((key) => Number(key) + 1)
        .map((n) => ({
          id: n,
          title: `Важная новость ${n}`,
          author: authorArr[Math.floor(Math.random() * authorArr.length)],
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
            author: authorArr[Math.floor(Math.random() * authorArr.length)],
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
      });

      setTimeout(() => {
        redis.hgetall('news', function (err, obj) {
          const newObj = [];
          for (const key in obj) {
            newObj.push(JSON.parse(obj[key]))
          }
          return resolve(newObj);
        });
        // resolve(news);
      }, 100);
    });
  }

  @Get('test-redis/:searchtext')
  async testRedis(@Param('searchtext') searchtext: string) {
    redis.set('foo', searchtext);
    return await redis.get('foo');
  }

  @Get('top-ten')
  async topTen() {
    return new Promise((resolve) => {
      redis.hgetall('news', function (err, obj) {
        const newObj = [];
        const authorCount = [];
        for (const key in obj) {          
          newObj.push(JSON.parse(obj[key]))
          authorCount.push(JSON.parse(obj[key]).author)
        }

        const authorRate = {};       

        authorCount.forEach((item) => {
            if(authorRate[item]){
              authorRate[item] += 1;
            }
            else{
              authorRate[item] = 1
            }
        });

        let sortable = Object.keys(authorRate);

        sortable.sort(function(a, b) { return authorRate[b] - authorRate[a] });
                return resolve(`топ-10 авторов: ${sortable.slice(0,10).join(', ')}`);
              });
            })
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
