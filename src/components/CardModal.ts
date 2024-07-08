import { ICardModel } from '../types';
import { CDN_URL } from '../utils/constants';
import { Basket } from './Basket';
import { BasketView } from './BasketView';

// Интейрфес для карточки с подробной информацией
export interface IFullCardView {
	category: HTMLElement;
	title: HTMLElement;
	image: HTMLImageElement;
	price: HTMLElement;
	description: HTMLElement;
	closeButton: HTMLButtonElement;
	openCard(data: ICardModel): void;
	close(): void;
}

// Класс для карточки с подробной информацией о товаре
export class CardModal implements IFullCardView {
	category: HTMLElement;
	title: HTMLElement;
	image: HTMLImageElement;
	price: HTMLElement;
	description: HTMLElement;
	closeButton: HTMLButtonElement;
	paymentButton: HTMLButtonElement;
	private modalElement: HTMLElement;
	private modalContainer: HTMLElement;
	private contentArea: HTMLElement;
	private page: HTMLBodyElement;
	private basket: Basket;
	private basketView: BasketView;
	private currentItem: ICardModel | null;

	constructor(
		page: HTMLBodyElement,
		modalContainer: HTMLElement,
		contentArea: HTMLElement,
		basket: Basket,
		basketView: BasketView
	) {
		this.modalContainer = modalContainer;
		this.contentArea = contentArea;
		this.page = page;
		this.basket = basket;
		this.basketView = basketView;
		this.currentItem = null;

		const template = document.querySelector(
			'#card-preview'
		) as HTMLTemplateElement;
		const content = template.content.cloneNode(true) as HTMLElement;
		this.modalElement = content.querySelector('.card');

		this.category = this.modalElement.querySelector('.card__category');
		this.title = this.modalElement.querySelector('.card__title');
		this.image = this.modalElement.querySelector(
			'.card__image'
		) as HTMLImageElement;
		this.description = this.modalElement.querySelector('.card__text');
		this.price = this.modalElement.querySelector('.card__price');
		this.closeButton = this.modalContainer.querySelector('.modal__close');
		this.paymentButton = this.contentArea.querySelector('.card__button');

		// Слушатели событий
		this.closeButton.addEventListener('click', this.close.bind(this));
		this.modalElement
			.querySelector('.card__button')
			.addEventListener('click', this.addToBasket.bind(this));
	}

	// Метод для открытия карточки с доп. информацией
	openCard(data: ICardModel): void {
		this.clearContent();
		// Устанавливаем текущий элемент
		this.currentItem = data; 

		// Логирование для отладки
		console.log('Текущий элемент установлен:', this.currentItem);

		this.category.textContent = data.category;
		this.title.textContent = data.title;
		this.image.src = CDN_URL + data.image;
		this.image.alt = data.title;
		this.price.textContent =
			data.price !== null ? data.price.toString() : 'Бесценно';
		this.description.textContent = data.description;
		this.modalContainer.classList.add('modal_active');
		this.page.classList.add('no-scroll');
		this.contentArea.appendChild(this.modalElement);
	}

	// Закрытие карточки
	close(): void {
		this.modalContainer.classList.remove('modal_active');
		this.page.classList.remove('no-scroll');
		this.clearContent();
		this.currentItem = null; // Сбрасываем текущий элемент при закрытии
	}

	// Добавление карточки в корзину пользователя
	addToBasket(): void {
		if (this.currentItem) {
			// Логирование для отладки
			console.log('Добавлено в корзину:', this.currentItem);

			this.basket.addItem(this.currentItem);
			this.basketView.countQuantity(this.basket.getItems());
		} else {
			// Логирование ошибки
			console.error('Нет корректных данныз для добавления в корзину');
		}
	}

	// Метод для очистки модального окна при закрытии
	clearContent() {
		const content = this.modalContainer.querySelector('.modal__content');
		if (content) {
			content.innerHTML = '';
		}
	}
}
