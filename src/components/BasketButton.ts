// Импорты
import { Basket } from './Basket';
import { BasketView } from './BasketView';

// Интерфейс для кнопки корзины
interface IBasketButton {
	modalBasket: HTMLElement;
	button: HTMLButtonElement;
	basketView: BasketView;
	basket: Basket;
	openBasket(): void;
	closeBasket(): void;
}

// Класс кнопки корзины
export class BasketButton implements IBasketButton {
	modalBasket: HTMLElement;
	button: HTMLButtonElement;
	basketView: BasketView;
	basket: Basket;

	constructor(
		modalBasket: HTMLElement,
		basket: Basket,
		basketView: BasketView,
		button: HTMLButtonElement
	) {
		this.modalBasket = modalBasket;
		this.basket = basket;
		this.basketView = basketView;
		this.button = button;
		this.button.addEventListener('click', this.openBasket.bind(this));
	}

	openBasket() {
		this.modalBasket.classList.add('modal_active');
		this.basketView.render(this.basket.getItems());
	}

	closeBasket() {
		if (this.modalBasket.classList.contains('modal_active')) {
			this.modalBasket.classList.remove('modal_active');
		}
	}
}
