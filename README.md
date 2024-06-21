# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Код проекта

### 1. Класс EventEmmitter

```
class EventEmitter implements IEvents {
	_events: Map<EventName, Set<Subscriber>>;

	constructor() {
		this._events = new Map<EventName, Set<Subscriber>>();
	}

	on<T extends object>(eventName: EventName, callback: (event: T) => void) {
		if (!this._events.has(eventName)) {
			this._events.set(eventName, new Set<Subscriber>());
		}
		this._events.get(eventName)?.add(callback);
	}

	off(eventName: EventName, callback: Subscriber) {
		if (this._events.has(eventName)) {
			this._events.get(eventName)!.delete(callback);
			if (this._events.get(eventName)?.size === 0) {
				this._events.delete(eventName);
			}
		}
	}

	emit<T extends object>(eventName: string, data?: T) {
		this._events.forEach((subscribers, name) => {
			if (
				(name instanceof RegExp && name.test(eventName)) ||
				name === eventName
			) {
				subscribers.forEach((callback) => callback(data));
			}
		});
	}

	onAll(callback: (event: EmitterEvent) => void) {
		this.on('*', callback);
	}

	offAll() {
		this._events = new Map<string, Set<Subscriber>>();
	}

	trigger<T extends object>(eventName: string, context?: Partial<T>) {
		return (event: object = {}) => {
			this.emit(eventName, {
				...(event || {}),
				...(context || {}),
			});
		};
	}
}
```

Данный класс представляет брокер событий в приложении Web-Larek. Основное значение - управление событиями в приложении, создание системы подписки и уведомлений между частями приложения.

#### Поля

```
_events: Map<EventName, Set<Subscriber>>;
```

\_events представляет собой элемент с типом Map, в котором ключами к являются имена событий 'EventName', а значениями - набор подписчиков 'Set<Subscriber>'.

#### Конструктор

```
constructor() {
  this._events = new Map<EventName, Set<Subscriber>>();
}
```

Конструктор в классе EventEmitter используется для инициализации карты \_events.

#### Методы

Класс EventEmmiter использует следующие методы:

##### 1. on

```
on<T extends object>(eventName: EventName, callback: (event: T) => void) {
  if (!this._events.has(eventName)) {
    this._events.set(eventName, new Set<Subscriber>());
  }
  this._events.get(eventName)?.add(callback);
}
```

Данный метод используется для подписки на события. В качестве параметров он принимает

- eventName - название события, на которое следует подписаться.
- callback - функцию которая будет вызвана, когда события пройдет.

Также в данном методе реализована проверка на наличие \_events в карте, если его нет, то \_events будет создан, после чего к событию добавляется обработчик.

##### 2. off

```
 off(eventName: EventName, callback: Subscriber) {
  if (this._events.has(eventName)) {
    this._events.get(eventName)!.delete(callback);
    if (this._events.get(eventName)?.size === 0) {
      this._events.delete(eventName);
    }
  }
}
```

Данный метод используется для удаления подписки на события. В качестве параметров он принимает:

- eventName - название события, от которого следует отписаться.
- callback - функцию, которую следует удалить.

Также в данном методе реализована проверка на наличие \_events в карте, если событие с именем eventName есть, то обработчик будет удален из набора подписчиков, если после удаления набор подписчиков является пустым, то то событие удаляется из карты \_events.

##### 3. emit

```
emit<T extends object>(eventName: string, data?: T) {
 this._events.forEach((subscribers, name) => {
   if (
     (name instanceof RegExp && name.test(eventName)) ||
     name === eventName
   ) {
     subscribers.forEach((callback) => callback(data));
   }
 });
}
```

Данный метод используется для генерации событий. В качестве параметров он принимает:

- eventName - название события, которое необходимо сгенерировать.
- data - является необязательным параметром, используется для указания данных, которые следует передать подписчикам.

Также в данном методе реализована проверка, если имя события совпадает с eventName, то будет вызван соответствующий обработчик.

##### 4. onAll

```
onAll(callback: (event: EmitterEvent) => void) {
  this.on("*", callback);
}
```

Данный метод используется для подключения подписки на все события.
Используется включение метода on.

##### 5. offAll

```
offAll() {
  this._events = new Map<string, Set<Subscriber>>();
}
```

Данный метод используется для отключения все подписчиков.

##### 6. trigger

```
trigger<T extends object>(eventName: string, context?: Partial<T>) {
  return (event: object = {}) => {
    this.emit(eventName, {
      ...(event || {}),
      ...(context || {}),
    });
  };
}
```

Данный метод используется для создания функции, которая создает событие при вызове. В качестве параметров принимает:

- eventName - название события.
- context - необязательный параметр, который используется для объединения данных с уже имеющимися.

### 2. Класс API

```
class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	get(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	post(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}
}
```

Класс API используется для создания шаблонов для HTTP-запросов на удаленный сервер.

#### Поля

```
readonly baseUrl: string;
protected options: RequestInit;
```

- baseUrl - параметр метода, который представляет собой строку, содержащую URL-адрес для API-запросов.
- option - параметр, который используется для конфигурации запросов.

#### Конструктор

```
constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}
```

Данный конструктор используется для инициализации baseUrl и options. По умолчанию он устанавливает заголовок 'Content-Type': 'application/json'. Также имеется возможность добавлять дополнительные заголовки ...((options.headers as object) ?? {}).

#### Методы

##### 1. handleResponse

```
protected handleResponse(response: Response): Promise<object> {
	if (response.ok) return response.json();
	else
		return response
			.json()
			.then((data) => Promise.reject(data.error ?? response.statusText));
}
```

Данный метод используется для обработки ответов от сервера.

Если ответ успешный, то будет возвращено response.json(), иначе Promise.reject с сообщением об ошибке.

##### 2. get

```
get(uri: string) {
	return fetch(this.baseUrl + uri, {
		...this.options,
		method: 'GET',
	}).then(this.handleResponse);
}
```

Данный метод используется для отправки GET-запросов. В качестве параметра принимает url-адрес с типов строки и объединяет его с базовым URL (baseUrl). После получения ответ от сервера осуществляется вызов метода handleResponse, который осуществляет обработку.

##### 3. post

```
post(uri: string, data: object, method: ApiPostMethods = 'POST') {
	return fetch(this.baseUrl + uri, {
		...this.options,
		method,
		body: JSON.stringify(data),
	}).then(this.handleResponse);
}
```

Данный метод используется для отправки POST-запросов по умолчанию, но может быть кастомизируемым другими методами через параметр method. После отправки запроса и получения ответа вызывается метод handleResponse, который обрабатывает полученный ответ от сервера.

## Архитектура приложения

При разработке приложения использовался архитектурный подход MVP (Model, View, Presenter).

### Общие типы для приложения 
```
type TCategory = 'софт-скилл' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скилл';

type TPaymentMethod = 'онлайн' | 'при получении';
```

### Слои приложения

#### 1. Слой Model
Данный слой используется для 
Слой представлен следующими структурами данных.

##### Модель товара
```
interface IItemModel {
	id: string;
	description: string;
	image: string;
	title: string;
	category: TCategory;
	price: number;
}
```
IItemModel Представляет модель товара с основными параметрами, получаемыми с сервера (id, название, категория, цена и изображение товара).

##### Модель списка товаров
```
interface IListItemsModel {
	items: IItemModel[];
}
```
IListItemsModel является списком товаров, содержащим список товаров в виде массива.

##### Заказ
```
interface IOrderModel {
	payment: TPaymentMethod;
	email: string;
	address: string;
	items: string[];
	total: number;
}
```

IOrderModel представляет собой модель корзины, которая содержит в себе информацию о методах оплаты, email, адрес, списком товаров и общей суммой.

##### Модель корзины
```
interface IBasket {
	items: IListItemsModel[];
	totalPrice: number;
	addItem(product: IItemModel): void;
	deleteItems(product: IItemModel): void;
}
```
IBasket представляет собой корзину с товарами, общей стоимостью, методами добавления и удаления товаров.

#### 2. Слой View
Данный слой используется для представления данных на экране.

##### Страница сайта
```
interface Page {
	itemsList: HTMLElement;
	basketCounter: number;
}
```

##### Продукт
```
interface IItemView {
	category?: HTMLElement;
	title: HTMLElement;
	image?: HTMLImageElement;
	description?: HTMLElement;
	price: HTMLElement;
	button?: HTMLButtonElement;
}
```
IItemView является видом товара с необязательными элементами (категории, изображения, описания и кнопки) и обязательными (заголовок и цена).

##### Корзина
```
interface IBasketView {
	itemsList: HTMLElement[];
	totalPrice: number;
}
```
IBasketView является видом корзины, который содержит элементы списка товаров и итоговой стоимостью. 

##### Модальное окно
```
interface IModalView {
	content: HTMLElement;
	open(): void;
	close(): void;
}
```
IModalView данный вид является модальным окном, содержашим методы для его открытия и закрытия.

##### Модальное окно с оплатой и адресом
```
interface IPaymentInformationView {
	payment: string;
	address: string;
}
```
IPaymentInformationView явялется видом модального окна, которое содержит информацию об адресе и оплате.  

##### Модальное окно с личной информацией
```
interface IPersonalInformationView {
	email: string;
	phone: string;
}
```
PersonalInformationView: Представляет модальное окно с личной информацией, такой как email и телефон.

##### Модальное окно с успешным заказом
```
interface ISuccessfulOrderView {
	totalPrice: number;
}
```
ISuccessfulOrderView модальное окно с информацией об успешном заказе и общей сумме.

#### 3. Слой Presenters
Данный слой используется для управления логикой между моделями и видами

```
interface IEvents {
	on<T>(event: string, callback: (data: T) => void): void;
	emit<T>(event: string, data?: T): void;
	trigger<T>(event: string, context?: Partial<T>): (data: T) => void;
}
```
IEvents интерфейс применяемый для управления событиями. Используется для добавления обработчиков событий, генерации событий и триггера событий с контекстом.

// Интерфейс для работы с API
```
interface IApi {
	getProducts(): Promise<IItemModel[]>;
	getProduct(id: string): Promise<IItemModel>;
}
```
IApi интерфейс для работы с API. Содержит методы для получения списка продуктов.

## Ссылка на проект 

https://github.com/Saitnbone/web-larek-frontend.git