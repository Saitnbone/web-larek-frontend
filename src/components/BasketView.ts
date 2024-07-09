// Импорты
import { ICardModel } from '../types';
import { Basket } from './Basket';
import { Order } from './Order';

// Интерфейс для вида корзины
interface IBasketView {
	container: HTMLElement;
	renderModal(cartItems: ICardModel[]): void;
	renderBasketCards(cartItems: ICardModel[]): void;
}

// Класс для вида отображения корзины
export class BasketView implements IBasketView {
	modal: HTMLElement;
	container: HTMLElement;
	basketTemplate: HTMLTemplateElement;
	cardBasketTemplate: HTMLTemplateElement;
	basketCounter: HTMLElement;
	basket: Basket;
	order: Order;

	constructor(
		basket: Basket,
		modal: HTMLElement,
		container: HTMLElement,
		basketTemplate: HTMLTemplateElement,
		cardBasketTemplate: HTMLTemplateElement,
		basketCounter: HTMLElement,
		order: Order
	) {
		this.order = order;
		this.basket = basket;
		this.container = container;
		this.modal = modal;
		this.basketTemplate = basketTemplate;
		this.cardBasketTemplate = cardBasketTemplate;
		this.basketCounter = basketCounter;
	}

	// Метод подсчета товаров
	countQuantity(cartItems: ICardModel[]) {
		this.basketCounter.textContent = cartItems.length.toString();
	}

	// Рендеринг пустого окна страницы модального окна корзины
	renderModal(cartItems: ICardModel[]) {
		const contentBasketBlock = this.modal.querySelector('.modal__content');
		if (!contentBasketBlock) {
			console.error('Content block not found');
			return;
		}

		this.clearContent();

		// Создание и добавление нового элемента корзины
		const basketElement = this.basketTemplate.content.cloneNode(
			true
		) as HTMLElement;
		const basket = basketElement.querySelector('.basket');
		const basketButton = basket.querySelector(
			'.basket__button'
		) as HTMLButtonElement;

		if (!cartItems || cartItems.length === 0) {
			basketButton.disabled = true;
			contentBasketBlock.appendChild(basket);
		} else {
			basketButton.disabled = false;
			contentBasketBlock.appendChild(basket);
			this.renderBasketCards(cartItems);

			// Вызов метода рендеринга модального окна с оформлением заказа
			basketButton.addEventListener('click', () =>
				this.order.renderOrderModal()
			);
		}
	}

	// Рендеринг списка товаров корзины
	renderBasketCards(cartItems: ICardModel[]) {
		// Константы для метода
		const basket = document.querySelector('.basket');
		const contentBasketBlock = this.modal.querySelector('.modal__content');

		// Переменная для подсчета итоговой цены всех товаров
		let totalPrice = 0;

		if (!contentBasketBlock) {
			console.error('Content block not found');
			return;
		}

		const basketList = basket.querySelector('.basket__list');
		if (!basketList) {
			console.error('Basket list not found');
			return;
		}

		cartItems.forEach((item, index) => {
			const basketElement = this.cardBasketTemplate.content.cloneNode(
				true
			) as HTMLElement;
			const itemElement = basketElement.querySelector('.basket__item');

			if (!itemElement) {
				console.error('Basket item element not found in template');
				return;
			}

			const itemIndex = itemElement.querySelector('.basket__item-index');
			if (itemIndex) {
				itemIndex.textContent = (index + 1).toString();
			}

			const itemTitle = itemElement.querySelector('.card__title');
			if (itemTitle) {
				itemTitle.textContent = item.title;
			}

			const itemPrice = itemElement.querySelector('.card__price');
			if (itemPrice) {
				const price = item.price !== null ? item.price : 0;
				itemPrice.textContent = `${price} синапсов`;
				totalPrice += price;
			}

			// Кнопка для удаления элемента из корзины покупателя
			const itemDeleteButton = itemElement.querySelector(
				'.basket__item-delete'
			) as HTMLButtonElement;
			itemDeleteButton.addEventListener('click', (evt) => {
				this.basket.deleteItem(item.id);
				this.updateView();
			});
			basketList.appendChild(itemElement);
		});
		this.updateTotalPrice(totalPrice);
	}

	// Метод для рендеринга итоговой цены
	updateTotalPrice(totalPrice: number) {
		const basketPriceElement = this.modal.querySelector('.basket__price');
		if (basketPriceElement) {
			basketPriceElement.textContent = `${totalPrice} синапсов`;
		} else {
			console.error('Basket price element not found');
		}
	}

	// Обновление информации в корзине после удаления элемента
	updateView() {
		const basketItems = this.basket.getItems();
		this.clearContent();
		this.renderModal(basketItems);
		this.countQuantity(basketItems);
	}

	// Метод для очистки модального окна при закрытии
	clearContent() {
		const content = this.modal.querySelector('.modal__content');
		content.innerHTML = '';
	}
}
