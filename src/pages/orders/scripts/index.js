import '../../../styles/index.scss';

// Создаем класс для карточек блюд
class Checkout {
    #orders;
    #checkoutTime;
    #restaurant;

    constructor ({orders, checkout, restaurant}){
        this.#orders = orders; 
        this.#checkoutTime = checkout; 
        this.checktime = checkout; // чтобы отследить передачу данных в класс
        this.#restaurant = restaurant; 
        this.ifOrderFinished = false; 

        // Валидация данных
        if (!Array.isArray(this.#orders)){
            throw new Error ('Передано не корректное значение вместо списка заказов');
        }

        this.#orders.forEach((element) => {
            if (element.id <= 0 || element.price <= 0 || element.title.length < 5 || element.title.length > 30 || element.price <= 0){
                throw new Error ('В списке заказов передан не корректный параметр');
            };
        });

        if (typeof this.#restaurant !== 'string'){
            throw new Error ('Вместо названия ресторана указан не корректный параметр');
        }
    }

    // Методы
    finishOrder(){
        this.ifOrderFinished = true;
    }
    getRestaurant(){
        return this.#restaurant;
    }

    getOrders(){
        return this.#orders;
    }

    getFormattedDate(){
        let orderDate = this.#checkoutTime;

        orderDate = Array.from(orderDate);

        orderDate = orderDate.slice(0,10);
        let dateDay = orderDate.slice(8,10).join('');
        let dateMonth = orderDate.slice(5,7).join('');
        let dateYear = orderDate.slice(0,4).join('');

        switch (dateMonth) {
            case '01':
                dateMonth = 'января';
                break;
            case '02':
                dateMonth = 'февраля';
                break;
            case '03':
                dateMonth = 'марта';
                break;
            case '04':
                dateMonth = 'апреля';
                break;
            case '05':
                dateMonth = 'мая';
                break;
            case '06':
                dateMonth = 'июня';
                break;
            case '07':
                dateMonth = 'июля';
                break;
            case '08':
                dateMonth = 'августа';
                break;
            case '09':
                dateMonth = 'сентября';
                break;
            case '10':
                dateMonth = 'октября';
                break;
            case '11':
                dateMonth = 'ноября';
                break;
            case '12':
                dateMonth = 'декабря';
                break;
        }

        let totalDate = `${dateDay} ${dateMonth} ${dateYear}`;

        return totalDate;
    }

    getFormattedTime(){
        let detail = null;
        let orderTime = this.#checkoutTime;

        orderTime = Array.from(orderTime);
        orderTime = orderTime.slice(11, 16); 
        let orderHour = orderTime.slice(0, 2).join('');
        orderHour = +orderHour;

        if (orderHour >= 12) {
            orderHour= orderHour - 12;
            orderHour= `0${orderHour}`;
            detail = 'PM';
        } else {
            detail = 'AM';
        }        

        let orderMins = orderTime.slice(2, 7).join('');

        let totalTime = `${orderHour}${orderMins} ${detail}`;

        return totalTime;
    }

    getCheckoutTime(){
        // Переводим текущее время в формат подходящий для вычислений
        let theCurrentTime = new Date().toISOString();

        theCurrentTime = Array.from(theCurrentTime).slice(11, 16);

        let theCurrentHour = theCurrentTime.slice(0, 2).join('');
        let detail = null;

        if (theCurrentHour >= 12) {
            theCurrentHour= theCurrentHour - 12;
            theCurrentHour= `0${theCurrentHour}`;
            detail = 'PM';
        }

        detail = 'AM';

        let theCurrentMins = theCurrentTime.slice(3, 7).join('');

        theCurrentTime = `${theCurrentHour}${theCurrentMins}`;
        theCurrentHour = +theCurrentHour*60;
        theCurrentMins = +theCurrentMins;

        // Текущее время в минутах
        theCurrentTime = theCurrentHour + theCurrentMins;

        // Переводим время заказа в формат подходящий для вычислений
        let theOrderTime = this.getFormattedTime();

        theOrderTime = Array.from(theOrderTime);

        // Час заказа в минутах
        let theOrderHour = +theOrderTime.slice(0, 2).join('')*60;

        let theOrderMins = +theOrderTime.slice(3, 6).join('');

        // Время заказа в минутах
        theOrderTime = theOrderHour+theOrderMins;

        // Вычисление оставшегося времени
        let remainingTime = 1 - (theCurrentTime - theOrderTime);  // использовать 60 для работы или 10 для проверки доставленных заказов

        if (remainingTime <= 0){
            this.ifOrderFinished = true;
        }

        this.ifOrderFinished = false;

        return remainingTime;
    }

    getCheckoutTimePercent(){
        let timePassed = 60 - this.getCheckoutTime();

        let percentage = (timePassed * 100)/60;

        return `${percentage}%`;
    }
};

let ordersArray;

// Читаем локальное хранилище и прокидываем объекты массива в класс Чекаут
( function () {
    ordersArray = JSON.parse(localStorage.getItem('allOrders'));

    ordersArray = ordersArray.map((item) => new Checkout(item));
    
    localStorage.setItem('check', '1');
})();


// Формируем отображение заказов
( function () {
    ordersArray.forEach((element) => {
        if (element.getCheckoutTime() <= 0){
            element.ifOrderFinished = true;
            element.finishOrder();
        }

        // Для не законченных закзов
        if (element.ifOrderFinished === false){

            // Обертка блока - div 'coming-up__item coming-up-item'
            const blockWrap = document.createElement('div');
            blockWrap.setAttribute('class', 'coming-up__item coming-up-item');
            document.getElementById('comingUp').appendChild(blockWrap);

            // Обертка хедера - div 'coming-up-item__header'
            const headerWrap = document.createElement('div');
            headerWrap.setAttribute('class', 'coming-up-item__header');
            blockWrap.appendChild(headerWrap);

            // Хедер - h4 'h4'
            const header = document.createElement('h4');
            header.setAttribute('class', 'h4');
            header.textContent = `${element.getRestaurant()}`;
            headerWrap.appendChild(header);

            // Бирка - div 'badge badge--orange'
            const badge = document.createElement('div');
            badge.setAttribute('class', 'badge badge--orange');
            if (element.getCheckoutTime() > 30){
                badge.textContent = 'Готовка';
            } else {
                badge.textContent = 'Доставка';
            }
            headerWrap.appendChild(badge);

            // Обертка инфо блока - div 'coming-up-info'
            const infoWrap = document.createElement('div');
            infoWrap.setAttribute('class', 'coming-up-info');
            blockWrap.appendChild(infoWrap);

            // Иконка таймера - img 
            const img = document.createElement('img');
            img.setAttribute('src', '/src/assets/icons/clock16.svg');
            infoWrap.appendChild(img);

            // Инфо контент - div 'coming-up-info__content'
            const infoContent = document.createElement('div');
            infoContent.setAttribute('class', 'coming-up-info__content');
            infoWrap.appendChild(infoContent);

            // Заглушка текста
            const infoText = document.createElement('div');
            infoText.textContent = 'Заказ будет доставлен через';
            infoContent.appendChild(infoText);

            // Время доставки
            const infoTime = document.createElement('div');
            infoTime.setAttribute('class', 'coming-up-info__title');
            infoTime.textContent = `${element.getCheckoutTime()} минут`;
            infoContent.appendChild(infoTime);

            // Прогресс бар
            const barWrap = document.createElement('div');
            barWrap.setAttribute('class', 'progress-bar');
            blockWrap.appendChild(barWrap);

            // Прогресс бар линия
            const barLine = document.createElement('div');
            barLine.setAttribute('class', 'progress-bar__line');
            barLine.setAttribute('style', `width:${element.getCheckoutTimePercent()}`);
            barWrap.appendChild(barLine);

            // Прогресс бар оверлей
            const barOverlay = document.createElement('div');
            barOverlay.setAttribute('class', 'progress-bar__overlay');
            barWrap.appendChild(barOverlay);

            // Прогресс бар секции
            const barFirst = document.createElement('div');
            barFirst.setAttribute('class', 'progress-bar__item progress-bar__item--first');
            barOverlay.appendChild(barFirst);

            const barSecond = document.createElement('div');
            barSecond.setAttribute('class', 'progress-bar__item progress-bar__item--sec');
            barOverlay.appendChild(barSecond);

            const barThird = document.createElement('div');
            barThird.setAttribute('class', 'progress-bar__item progress-bar__item--third');
            barOverlay.appendChild(barThird);

        }

        // Для законченных заказов
        if (element.ifOrderFinished === true){

            // Обертка блока - div 'previous__item previous-item'
            const blockWrap = document.createElement('div');
            blockWrap.setAttribute('class', 'previous__item previous-item');
            document.getElementById('previous').appendChild(blockWrap);

            // Обертка хедера
            const headerWrap = document.createElement('div');
            headerWrap.setAttribute('class', 'previous-item__header');
            blockWrap.appendChild(headerWrap);

            // Сам хедер 
            const header = document.createElement('h4');
            header.setAttribute('class', 'h4');
            header.textContent = `${element.getRestaurant()}`;
            headerWrap.appendChild(header);

            // Статус
            const badge = document.createElement('div');
            badge.setAttribute('class', 'badge badge--green');
            badge.textContent = `Выполнен`;
            headerWrap.appendChild(badge);

            // Обертка информации
            const infoWrap = document.createElement('div');
            infoWrap.setAttribute('class', 'previous-item-info');
            blockWrap.appendChild(infoWrap);

            // Дата
            const infoDate = document.createElement('div');
            infoDate.setAttribute('class', 'previous-item-info__date');
            infoDate.textContent = `${element.getFormattedDate()}`;
            infoWrap.appendChild(infoDate);

            // Время
            const infoTime = document.createElement('div');
            infoTime.setAttribute('class', 'previous-item-info__time');
            infoTime.textContent = `${element.getFormattedTime()}`;
            infoWrap.appendChild(infoTime);

            // Обертка списка заказанного
            const dishesWrap = document.createElement('ul');
            dishesWrap.setAttribute('class', 'previous-item-dishes');
            blockWrap.appendChild(dishesWrap); 

            const orders = element.getOrders();

            let theCurrentNumber = 0;

            orders.forEach((elem) =>{
                if (theCurrentNumber < 2) {
                    // Обертка элемента списка
                    const dishWrap = document.createElement('li');
                    dishWrap.setAttribute('class', 'previous-item-dishes__item');
                    dishWrap.textContent = `${elem.title}`;
                    dishesWrap.appendChild(dishWrap); 

                    // Колиечство порций элемента списка
                    const dishCount = document.createElement('span');
                    dishCount.setAttribute('class', 'previous-item-dishes__quantity');
                    dishCount.textContent = `${elem.count}`;
                    dishWrap.appendChild(dishCount); 

                    theCurrentNumber++;

                } else {
                    // Обертка элемента списка
                    const dishWrap = document.createElement('li');
                    dishWrap.setAttribute('class', 'previous-item-dishes__item invisible');
                    dishWrap.setAttribute('style', 'display:none');
                    dishWrap.textContent = `${elem.title}`;
                    dishesWrap.appendChild(dishWrap); 

                    // Колиечство порций элемента списка
                    const dishCount = document.createElement('span');
                    dishCount.setAttribute('class', 'previous-item-dishes__quantity invisible');
                    dishCount.setAttribute('style', 'display:none');
                    dishCount.textContent = `${elem.count}`;
                    dishWrap.appendChild(dishCount); 
                }
            });

            // Кнопка разворачивающая список
            const button = document.createElement('button');
            button.setAttribute('class', 'previous-item-see-more');
            if (orders.length > 2){
                button.textContent = `${orders.length - 2} дополнительно`;
                dishesWrap.appendChild(button); 
            }
            
        }
    });

    buttonList = document.querySelectorAll('.previous-item-see-more');
})();

// Соберем все кнопки "подробнее"
let buttonList;

// Удаляем старые листенеры с кнопок и добавляем новые
const buttonListeners = () => {
    buttonList.forEach((elem) => {
        elem.removeEventListener('click', showRest);
    });

    buttonList.forEach((elem) => {
        elem.addEventListener('click', showRest);
    });
};

const showRest = () => {
    let hiddenElementsList = document.querySelectorAll('.invisible');

    hiddenElementsList.forEach((elem) =>{
        elem.removeAttribute('style');
    });

    let buttonsList = document.querySelectorAll('.previous-item-see-more');

    buttonsList.forEach((elem) =>{
        elem.setAttribute('style', 'display:none');
    });
};

buttonListeners();