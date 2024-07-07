// Общие типы

// Категории товаров приложения
export type TCategory =
	| 'софт-скилл'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скилл';

// Методы оплаты
export type TPaymentMethod = 'онлайн' | 'при получении';

// Модели для проекта (model)
export interface ICardModel {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

// Модель списка товаров
export interface IListCardsModel {
	items: ICardModel[];
	preview: string | null;
	getItem(product: string): ICardModel | undefined;
}

// Заказ
export interface IOrderModel {
	payment: TPaymentMethod;
	email: string;
	address: string;
	items: string[];
	total: number;
}

// Модель корзины
export interface IBasket {
	items: IListCardsModel[];
	totalPrice: number;
	addItem(product: ICardModel): void;
	deleteItems(product: ICardModel): void;
}

// Виды для проекта (View)

// Страница сайта
export interface Page {
	itemsList: HTMLElement;
	basketCounter: number;
}

// Интерфейс для карточки товара
export interface ICardView {
	category?: HTMLElement;
	title: HTMLElement;
	image?: HTMLImageElement;
	description?: HTMLElement;
	price: HTMLElement;
	button?: HTMLButtonElement;
	renderElement(data: ICardModel[]): void;
}

// Интерфейс для открытой карточки товара 
export interface IFullCardView {
	category: HTMLElement;
	title: HTMLElement;
	image: HTMLImageElement;
	price: HTMLElement;
	description: HTMLElement;
	button: HTMLButtonElement;
	openCard(data: ICardModel): void;
	close(): void;
}

// Корзина
export interface IBasketView {
	itemsList: HTMLElement[];
	totalPrice: number;
}

// Модальное окно
export interface IModalView {
	content: HTMLElement;
	open(): void;
	close(): void;
}

// Модальное окно с оплатой и адресом
export interface IPaymentInformationView {
	payment: string;
	address: string;
}

// Модальное окно с личной информацией
export interface IPersonalInformationView {
	email: string;
	phone: string;
}

// Модальное окно с успешным заказом
export interface ISuccessfulOrderView {
	totalPrice: number;
}

// // Презентеры для проекта (Presents)

// Презентер  событий
export interface IEvents {
	on<T>(event: string, callback: (data: T) => void): void;
	emit<T>(event: string, data?: T): void;
	trigger<T>(event: string, context?: Partial<T>): (data: T) => void;
}

// Интерфейс для работы с API
export interface IApi {
	getProducts(): Promise<ICardModel[]>;
	getProduct(id: string): Promise<ICardModel>;
}
