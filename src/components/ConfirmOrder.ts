// Импорты
import { Basket } from './Basket';

// Класс для модального окна с подтверждением заказа
export class ConfirmOrder {
	basket: Basket;
	template: HTMLTemplateElement;
	modalContainer: HTMLElement;
	confirmButton: HTMLButtonElement;

	constructor(
		basket: Basket,
		template: HTMLTemplateElement,
		modalContainer: HTMLElement
	) {
		this.basket = basket;
		this.template = template;
		this.modalContainer = modalContainer;
	}

	// Метод рендеринга модального окна
	renderOrderModal() {
		this.clearContent();

		const confirmElement = this.template.content.cloneNode(true) as HTMLElement;
		this.confirmButton = confirmElement.querySelector('.order-success__close');

		this.modalContainer.appendChild(confirmElement);

		// Очистка содержимого корзины
		this.basket.clearBasket();

		// Обнуление счетчика корзины
		const basketCounter = document.querySelector('.header__basket-counter');
		basketCounter.textContent = '0';

		// Слушатели событий
		this.confirmButton.addEventListener('click', () => {
            this.clearContent();
            
			// this.removeModal();
		});
	}

	// removeModal() {
	// 	this.modalContainer.removeChild();
	// }

	// Метод очистки модального окна
	clearContent() {
		this.modalContainer.innerHTML = '';
	}
}
