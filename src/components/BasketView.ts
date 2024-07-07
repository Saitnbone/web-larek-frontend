// Импорты
import { ICardModel } from '../types';

// Интерфейс для вида корзины
interface IBasketView {
	container: HTMLElement;
	render(cartItems: ICardModel[]): void;
}

// Класс для вида отображения корзины
export class BasketView implements IBasketView {
	modal: HTMLElement;
	container: HTMLElement;

	constructor(modal: HTMLElement, container: HTMLElement) {
		this.container = container;
		this.modal = modal;
	}

	// Метод рендеринга корзины пользователя
	render(cartItems: ICardModel[]) {
		const contentBlock = this.modal.querySelector('.modal__content');
		// Элементы разметки в корзине пользователя
		cartItems.forEach((item) => {
			const itemTitle = this.container.querySelector('.card__title');
			itemTitle.textContent = item.title;
			const itemPrice = this.container.querySelector('.card__price');
			itemPrice.textContent = item.price.toString();

			if (item.price === null) {
				item.price = 0;
			}
		});
		contentBlock.appendChild(this.container);
	}
}
