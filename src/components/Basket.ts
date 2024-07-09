import { ICardModel } from '../types';

// Интерфейс корзины
interface IBasket {
	items: ICardModel[];
	addItem(item: ICardModel): void;
	getItems(): ICardModel[];
}

// Класс корзины покупателя
export class Basket implements IBasket {
	items: ICardModel[];

	constructor() {
		this.items = [];
	}

	addItem(item: ICardModel): void {
		this.items.push(item);
		console.log('Item added to cart:', item);
	}

	getItems(): ICardModel[] {
		return this.items;
	}

	// Метод для удаления товара из корзины пользователя
	deleteItem(itemdId: string): void {
		this.items = this.items.filter((item) => item.id !== itemdId);
	}

	// Метод для очистки массива от элементов
	clearBasket() {
		this.items = [];
	}
}
