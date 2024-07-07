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

	// removeItems(id: string){
	// 	this.items.splice(id:String, 1)
	// }
}
