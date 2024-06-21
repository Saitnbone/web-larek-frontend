// Общие типы

// Категории товаров приложения
type TCategory =
	| 'софт-скилл'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скилл';

// Методы оплаты
type TPaymentMethod = 'онлайн' | 'при получении';

// Модели для проекта (model)

// Модель товара
interface IItemModel {
	id: string;
	description: string;
	image: string;
	title: string;
	category: TCategory;
	price: number;
}

// Модель списка товаров
interface IListItemsModel {
	items: IItemModel[];
}

// Заказ
interface IOrderModel {
	payment: TPaymentMethod;
	email: string;
	address: string;
	items: string[];
	total: number;
}

// Модель корзины
interface IBasket {
	items: IListItemsModel[];
	totalPrice: number;
	addItem(product: IItemModel): void;
	deleteItems(product: IItemModel): void;
}

// Виды для проекта (View)

// Страница сайта
interface Page {
	itemsList: HTMLElement;
	basketCounter: number;
}

// Продукт
interface IItemView {
	category?: HTMLElement;
	title: HTMLElement;
	image?: HTMLImageElement;
	description?: HTMLElement;
	price: HTMLElement;
	button?: HTMLButtonElement;
}

// Корзина
interface IBasketView {
	itemsList: HTMLElement[];
	totalPrice: number;
}

// Модальное окно
interface IModalView {
	content: HTMLElement;
	open(): void;
	close(): void;
}

// Модальное окно с оплатой и адресом
interface IPaymentInformationView {
	payment: string;
	address: string;
}

// Модальное окно с личной информацией
interface IPersonalInformationView {
	email: string;
	phone: string;
}

// Модальное окно с успешным заказом
interface ISuccessfulOrderView {
	totalPrice: number;
}

// // Презентеры для проекта (Presents)

// Презентер  событий
interface IEvents {
	on<T>(event: string, callback: (data: T) => void): void;
	emit<T>(event: string, data?: T): void;
	trigger<T>(event: string, context?: Partial<T>): (data: T) => void;
}

// Интерфейс для работы с API
interface IApi {
	getProducts(): Promise<IItemModel[]>;
	getProduct(id: string): Promise<IItemModel>;
}
