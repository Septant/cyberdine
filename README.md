<p align="center">
  <a href="https://angular.io" target="blank"> <img src="https://angular.io/assets/images/logos/angular/angular.svg" width="200" alt="Angular logo"> </a>
</p>

# Frontend

Тестовое задание от 2x.06.2025 <br>
Node version 24.00.0. <br>
Версия Angular: [Angular CLI](https://github.com/angular/angular-cli) version 20.0.2.

### Сторонние ресурсы
В проекте используются [Angular-material](https://material.angular.dev/), [socket-io](https://www.npmjs.com/package/socket.io-client).

### Режим разработки

`ng serve`: Запуск в режиме разработчика. Рабочий порт: `http://localhost:4200/`. 

### Сборка 

`ng build`: Сборка проекта. Артефакты собираются в папке `dist/`. Содержимое папки dist/frontend необходимо скопировать в `dist` backend под именем `client` после сборки backend-проекта.

# Функционал

## 1. Админ-панель `/admin`

Страница доступная для пользователя с эл. почтой `admin@admin.admin`. Содержит в себе таблицу активных заявок на пропуск с возможностью модерации статуса заявки. Таблица обновляется раз в минуту.

## 2. Страница пользователя `/profile`

Страница с кнопкой открывающей форму подачи заявки. В форме есть возможность подписки на уведомления.
При подписке статус заявления отслеживается по сокету и обновляется в реальном времени (при находящемся на сайте пользователе). Кроме того, в этом случае пользователю приходит уведомление (кнопка с колокольчиком в header'е).

# Структура:
1. [services](/src/app/services): сервисы api и хранилища
2. [layout](/src/app/layout): Общие элементы страницы. В данном проекте - header;
3. [models](/src/app/meta): интерфейсы;
4. [components](/src/app/components): используемые компоненты;
5. [dialogs](src/app/dialogs): служебные модальные окна, втч связанные с авторизацией;
6. [pages](src/app/pages): компоненты страниц;
7. [utils](src/app/utils): вспомогательный функционал (guards, interceptors, custom validators);
8. app.* - корень приложения;


