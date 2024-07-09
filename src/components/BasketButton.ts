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
	page: HTMLBodyElement;
	modalBasket: HTMLElement;
	button: HTMLButtonElement;
	basketView: BasketView;
	basket: Basket;

	constructor(
		page: HTMLBodyElement,
		modalBasket: HTMLElement,
		basket: Basket,
		basketView: BasketView,
		button: HTMLButtonElement
	) {
		this.page = page;
		this.modalBasket = modalBasket;
		this.basket = basket;
		this.basketView = basketView;
		this.button = button;
		this.button.addEventListener('click', this.openBasket.bind(this));
	}

	openBasket() {
		this.modalBasket.classList.add('modal_active');

		// Метод рендеринга модального окна корзины
		this.basketView.renderModal(this.basket.getItems());
		this.page.classList.add('no-scroll')
	}

	closeBasket() {
		if (this.modalBasket.classList.contains('modal_active')) {
			this.basketView.clearContent();
			this.modalBasket.classList.remove('modal_active');
			this.page.classList.remove('no-scroll')
		}
	}
}
