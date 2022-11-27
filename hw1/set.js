const set = new Set();

// Добавляем в set 10000 элементов
for (let index = 0; index < 10000; index++) {
  set.add(Math.ceil(Math.random() * 1000));
}

// Добавлениe, удалениe и поиск элемента
set.add(456);
console.log(Date.now());

el = set.has(456);
console.log(el, Date.now());

set.delete(456);
console.log(Date.now());
