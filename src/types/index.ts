// Типы запросов на сервер
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TOrder = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;

// Интерфейс для страницы магазина
export interface IPage {
	catalog: IProductModel[];
	basket: string[];
	order: IOrder | null;
	basketTotal: number;
	preview: string | null;
}

// Интерфейс для карточки товара
export interface IProductModel {
	id: string;
	index: number;
	category: string;
	title: string;
	image: string;
	description: string;
	price: number;
}

// Интерфейс для модального окна с выбором способа оплаты
export interface IOrder {
	items: string[];
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
}

export interface IOrderResult {
	id: string;
}

// Тип для ошибок в формах
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс для апи
export interface IApi {
	getProducts: () => Promise<IProductModel[]>;
	orderProducts(order: IOrder): Promise<IOrderResult>;
}
