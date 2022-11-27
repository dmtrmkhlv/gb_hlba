let arr = [];
let el = arr.indexOf(456);

// Добавляем в массив 10000 элементов
for (let index = 0; index < 10000; index++) {
  arr.push(Math.ceil(Math.random() * 1000));
}

// Добавлениe, удалениe и поиск элемента
arr.push(456);
el = arr.indexOf(456);
console.log(el, Date.now());

arr.find((element) => element == "456");
el = arr.indexOf(456);
console.log(el, Date.now());

arr.splice(el, 1);
el = arr.indexOf(456);
console.log(el, Date.now());
