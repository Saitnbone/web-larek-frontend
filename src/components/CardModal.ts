// Импорты
import { ICardModel } from '../types';
import { CDN_URL } from '../utils/constants';
import { Basket } from './Basket';
import { BasketView } from './BasketView';

// Интерфейс для отображения карточки с  дополнительной информацией
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

// Класс для отображения модального окна с дополнительной информацией о товаре
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
		//
		page: HTMLBodyElement,
		//
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

	openCard(data: ICardModel): void {
		this.category.textContent = data.category;
		this.title.textContent = data.title;
		this.image.src = CDN_URL + data.image;
		this.image.alt = data.title;
		this.price.textContent =
			data.price !== null ? data.price.toString() : 'Бесценно';
		this.description.textContent = data.description;
		this.modalContainer.classList.add('modal_active');
		this.page.classList.add('no-scroll');
		this.contentArea.append(this.modalElement);
	}

	close(): void {
		this.modalContainer.classList.remove('modal_active');
		this.page.classList.remove('no-scroll');
	}

	addToBasket(): void {
		if (this.currentItem) {
			this.basket.addItem(this.currentItem);
			this.basketView.render(this.basket.getItems())
		}
	}
}
