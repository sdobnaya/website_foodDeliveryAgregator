import '../../../styles/index.scss';

import dominoArray from './data/dominos.json';
import kfcArray from './data/kfc.json';
import macArray from './data/mac.json';

// Создаем класс для блюд
class Dish {
    #count = 0;

    constructor({id, price, title, img}){
        this.id = id; 
        this.price = price; 
        this.title = title; 
        this.img = img; 
    }

    getCount(){
        return this.#count;
    }

    setCount(number){
        if (typeof number !== 'number' && number < 0){
            throw new Error('Укажите корректное значение - число больше 0');
        }
        this.#count = number;
    }
}

// Формируем массивы с инфой для карточек
const dominoDishes = dominoArray.map((item) => new Dish(item));
const kfcDishes = kfcArray.map((item) => new Dish(item));
const macDishes = macArray.map((item) => new Dish(item));

// Создаем класс для карточек блюд
class dishCard {
    constructor (object){
        this.id = object.id; 
        this.price = object.price; 
        this.title = object.title; 
        this.img = object.img; 
        this.count = 0;
    }

    formCard(){
        // Обертка блюда - div 'dish'
        const cardWrap = document.createElement('div');
        cardWrap.setAttribute('class', 'dish');
        document.getElementById('tabs__content-id').appendChild(cardWrap);

        // Картинка блюда - img 'dish__image'
        const dishImg = document.createElement('img');
        dishImg.setAttribute('class', 'dish__image');
        dishImg.setAttribute('src', `${this.img}`);
        cardWrap.appendChild(dishImg);

        // Название блюда - img 'dish__title'
        const dishTitle = document.createElement('div');
        dishTitle.setAttribute('class', 'dish__title');
        dishTitle.textContent = `${this.title}`;
        cardWrap.appendChild(dishTitle);

        // Информация о блюде - div 'dish__info'
        const dishInfo = document.createElement('div');
        dishInfo.setAttribute('class', 'dish__info');
        cardWrap.appendChild(dishInfo);

        // Информация о цене блюда- div 'dish__price'
        const dishPrice = document.createElement('div');
        dishPrice.setAttribute('class', 'dish__price');
        dishPrice.textContent = `${this.price} BYN`;
        dishInfo.appendChild(dishPrice);

        // Информация о счетчеке - div 'counter'
        const counter = document.createElement('div');
        counter.setAttribute('class', 'counter');
        dishInfo.appendChild(counter);

        const counterBtnDecrease = document.createElement('button');
        counterBtnDecrease.setAttribute('class', 'counter__button counter__button counter__button--decrease');
        counterBtnDecrease.setAttribute('id', `-${this.id}`);
        counterBtnDecrease.setAttribute('style', 'display:none');
        counter.appendChild(counterBtnDecrease);
        
        // Значение счетчика - span 'counter__number'
        const counterNumber = document.createElement('span');
        counterNumber.setAttribute('class', 'counter__number');
        counterNumber.textContent = `${this.count}`;
        counter.appendChild(counterNumber);

        // Кнопка счетчика +
        const counterBtn = document.createElement('button');
        counterBtn.setAttribute('class', 'counter__button counter__button--increase');
        counterBtn.setAttribute('id', `${this.id}`);
        counter.appendChild(counterBtn);
    }

    setCount(number){
        if (typeof number !== 'number' && number < 0){
            throw new Error('Укажите корректное значение - число больше 0');
        }
        this.count = number;
    }

    getCount(){
        return this.count;
    }

    plusCount(){
        let prevCount = this.getCount();
        prevCount++;
        this.setCount(prevCount);
    }

    minusCount(){
        let prevCount = this.getCount();
        prevCount--;
        this.setCount(prevCount);
    }
}

// Чтобы загрузочная страница не пустовала 
dominoDishes.forEach((item) => {
    new dishCard(item).formCard();
});

// Массивы карточек с едой
const dominoDishCards = dominoDishes.map((item) => new dishCard (item)); 
const kfcDishCards = kfcDishes.map((item) => new dishCard (item));
const macDishCards = macDishes.map((item) => new dishCard (item));

// Вводим переменную для хранения контекста (по умолчанию лежит Домино, потому что сразу подгружаем его)
let cafeArray = dominoDishCards;

// Переменная для списка кнопок + на странице
let currentAddBtns;

// Переменная для списка кнопок - на странице
let currentDelBtns;

// Удаляем старые листенеры с кнопок
const removeOldListeners = () => {
    currentAddBtns.forEach((elem) => {
        elem.removeEventListener('click', increaseButtonListener);
    });

    currentDelBtns.forEach((elem) => {
        elem.removeEventListener('click', decreaseButtonListener);
    });
};

// Добавляем новые листенеры 
const addNewListeners = () => {
    currentAddBtns.forEach((elem) => {
        elem.addEventListener('click', increaseButtonListener);
    });

    currentDelBtns.forEach((elem) => {
        elem.addEventListener('click', decreaseButtonListener);
    });
};

// Функция для сбора кнопок (Вызываем ее сразу и каждый раз после смены вкладки ресторана)
let getBtns = () => {
    currentAddBtns = document.querySelectorAll('.counter__button--increase');

    currentDelBtns = document.querySelectorAll('.counter__button--decrease');

    // Удаляем старые листенеры и добавляем новые
    removeOldListeners();
    addNewListeners();
};

getBtns();

// Прикрепляем логику к действию пользователя - меняем меню от ресторана + собираем все кнопки
document.getElementById('domino-section-id').addEventListener('click', () => {
    
    document.getElementById('domino-section-id').setAttribute('class', 'active featured__item featured-item');

    document.getElementById('mac-section-id').removeAttribute('class');
    document.getElementById('mac-section-id').setAttribute('class', 'featured__item featured-item');

    document.getElementById('kfc-section-id').removeAttribute('class');
    document.getElementById('kfc-section-id').setAttribute('class', 'featured__item featured-item');
    
    document.getElementById('tabs__content-id').innerHTML = '';

    dominoDishes.forEach((item) => {
        new dishCard(item).formCard();
    });

    cafeArray = dominoDishCards;
    cafeName = 'Domino’s Pizza';
    isDeliveryFree = true;

    getBtns();

});

document.getElementById('mac-section-id').addEventListener('click', () => {

    document.getElementById('mac-section-id').setAttribute('class', 'active featured__item featured-item');

    document.getElementById('domino-section-id').removeAttribute('class');
    document.getElementById('domino-section-id').setAttribute('class', 'featured__item featured-item');

    document.getElementById('kfc-section-id').removeAttribute('class');
    document.getElementById('kfc-section-id').setAttribute('class', 'featured__item featured-item');


    document.getElementById('tabs__content-id').innerHTML = '';

    macDishes.forEach((item) => {
        new dishCard(item).formCard();
    });

    cafeArray = macDishCards;
    cafeName = 'McDonald’s';
    isDeliveryFree = false;

    getBtns();
});

document.getElementById('kfc-section-id').addEventListener('click', () => {

    document.getElementById('kfc-section-id').setAttribute('class', 'active featured__item featured-item');

    document.getElementById('domino-section-id').removeAttribute('class');
    document.getElementById('domino-section-id').setAttribute('class', 'featured__item featured-item');

    document.getElementById('mac-section-id').removeAttribute('class');
    document.getElementById('mac-section-id').setAttribute('class', 'featured__item featured-item');

    document.getElementById('tabs__content-id').innerHTML = '';
    
    kfcDishes.forEach((item) => {
        new dishCard(item).formCard();
    });

    cafeArray = kfcDishCards;
    cafeName = 'KFC';
    isDeliveryFree = true;

    getBtns();
});


// сам объект, с кнопкой которого совершили действие --- Dish {id: 2, price: 170, title: "Пицца Маргарита", img: "img/pizza-2.jpg"}
let globalObj; 

const increaseButtonListener = function (event) {
    for (let i = 0; i <= cafeArray.length-1; i++){
        if (cafeArray[i].id == this.getAttribute('id')){
            globalObj = cafeArray[i];
            cafeArray[i].plusCount();
            event.target.parentElement.childNodes[1].innerHTML = cafeArray[i].getCount();
            if (cafeArray[i].getCount() >= 1){
                event.target.parentElement.childNodes[0].removeAttribute('style');

                getBtns();

                countAllDishes();
            }
        }
    }
};

const decreaseButtonListener = function (event) {
    for (let i = 0; i <= cafeArray.length-1; i++){
        window.x = Math.abs(this.getAttribute('id'));
        if (cafeArray[i].id == Math.abs(this.getAttribute('id'))){
            window.x = Math.abs(this.getAttribute('id'));
            globalObj = cafeArray[i];
            cafeArray[i].minusCount();
            event.target.parentElement.childNodes[1].innerHTML = cafeArray[i].getCount();
            if (cafeArray[i].getCount() == 0){
                event.target.parentElement.childNodes[0].setAttribute('style', 'display:none');
                countAllDishes();
            }
        }
    }
};

let drawerDraft = [];

let globalTotalNuber = 0;

const countAllDishes = function () {
    let totalNumber = 0;
    cafeArray.forEach((element) => {
        if (element.count > 0){
            totalNumber++;
            document.getElementById('icon-button__badge__id').textContent = `${totalNumber}`;
        } 
    });
    globalTotalNuber = totalNumber;
};

getBtns();


//Работа с корзиной 

//Показать корзину
document.getElementById('drawer-button__id').addEventListener('click', () => {
    totalPrice = 0;
    document.getElementById('order-block__id').innerHTML = '';

    document.getElementById('overlay-drawer__id').setAttribute('class', 'overlay visible');
    hideDrawer();
    showOrder();
});

//Спрятать корзину
const hideDrawer = () => {
    document.getElementById('drawer-closing-button__id').addEventListener('click', () => {
        document.getElementById('overlay-drawer__id').removeAttribute('class');
        document.getElementById('overlay-drawer__id').setAttribute('class', 'overlay');
    });
};

//Для отображения названия ресторана и расчета стоимости доставки
let cafeName = 'Domino’s Pizza';
let isDeliveryFree = true;
let totalPrice = 0;

//Показать содержимое корзины
const showOrder = () => {
    document.getElementById('order-block__id').innerHTML = '';
    drawerDraft.length = 0;

    //Собираем все карточки, количество блюд в которых > 0
    cafeArray.forEach((element) => {
        if (element.count > 0){
            drawerDraft.push(element);
        } 
    });

    //Формируем визуал корзины
    document.getElementById('subtitle__id').textContent = `(${globalTotalNuber} наименования)`;
    document.getElementById('h2__id').textContent = `${cafeName}`;
    
    document.getElementById('order-block__id').innerHTML = '';

    //Для карточек
    drawerDraft.forEach((element) => {
        totalPrice += element.price*element.count;

        const divForItem = document.createElement('div');
        divForItem.setAttribute('class', 'order__item order-item');
        document.getElementById('order-block__id').appendChild(divForItem);

        const imgForItem = document.createElement('img');
        imgForItem.setAttribute('class', 'order-item__image');
        imgForItem.setAttribute('src', `${element.img}`);
        divForItem.appendChild(imgForItem);

        const ammountForItem = document.createElement('span');
        ammountForItem.setAttribute('class', 'order-item__quantity');
        ammountForItem.textContent = `${element.count} X`;
        divForItem.appendChild(ammountForItem);

        const divForInfo = document.createElement('div');
        divForInfo.setAttribute('class', 'order-item__info');
        divForItem.appendChild(divForInfo);

        const name = document.createElement('h3');
        name.setAttribute('class', 'order-item__title h3');
        name.textContent = `${element.title}`;
        divForInfo.appendChild(name);

        const price = document.createElement('div');
        price.setAttribute('class', 'order-item__price');
        price.textContent = `${element.price} BYN`;
        divForInfo.appendChild(price);

        const btn = document.createElement('button');
        btn.setAttribute('class', 'icon-button icon-button--red');
        divForItem.appendChild(btn);

        const btnImg = document.createElement('img');
        btnImg.setAttribute('src', 'img/icons/delete.svg');
        btn.appendChild(btnImg);

        if (isDeliveryFree){
            document.getElementById('delivery__id').textContent = 'бесплатная';
        } else {
            document.getElementById('delivery__id').textContent = '20 BYN';
            totalPrice += 20;
        }

        document.getElementById('confirm-btn__id').innerHTML = '';
        
        const span = document.createElement('span');
        span.setAttribute('class', 'button__label');
        span.setAttribute('id', 'button__label__id');
        span.textContent = "Оформить заказ";
        document.getElementById('confirm-btn__id').appendChild(span);

        const priceSpan = document.createElement('span');
        priceSpan.setAttribute('id', 'totalPrice');
        priceSpan.textContent = `(${totalPrice} BYN)`;
        document.getElementById('confirm-btn__id').appendChild(priceSpan);
    });
};

//Формируем запись в локальное хранилище
const formLocalStorage = () => {
    if (!localStorage.getItem('allOrders')){
        localStorage.setItem('allOrders', JSON.stringify([]));
    };   

    let allOrders = JSON.parse(localStorage.getItem('allOrders'));

    let theOrder = {
        restaurant : `${cafeName}`,
        checkout: new Date().toISOString(),
        orders: [],
    };

    drawerDraft.forEach((element) => {
        delete element.img;
        theOrder.orders.push(element);
    });

    allOrders.push(theOrder);

    localStorage.setItem('allOrders', JSON.stringify(allOrders));
};

//Привязываем логику к кнопке - Оформить заказ
document.getElementById('confirm-btn__id').addEventListener('click', ()=>{
    formLocalStorage();
    window.location.href = 'orders.html';    
});
