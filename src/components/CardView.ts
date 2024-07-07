import { ICardView } from '../types';
import { ICardModel } from '../types';
import { CardModal } from './CardModal';
import { CDN_URL } from '../utils/constants';

// Класс отображения карточки на странице сайта
export class CardView implements ICardView {
	category?: HTMLElement;
	title: HTMLElement;
	image?: HTMLImageElement;
	description?: HTMLElement;
	price: HTMLElement;
	button?: HTMLButtonElement;
	private container: HTMLElement;
	private modal: CardModal;

	constructor(modal: CardModal) {
		this.container = document.querySelector('.gallery');
		this.modal = modal;
	}

	renderElement(data: ICardModel[]): void {
		const template =
			document.querySelector<HTMLTemplateElement>('#card-catalog');

		data.forEach((item) => {
			const cardElement = template.content.cloneNode(true) as HTMLElement;

			// Преобразуем cardElement в HTMLElement, чтобы избежать ошибки
			const cardHTMLElement = cardElement as HTMLElement;

			// Настройки для отображения
			const cardContainer = cardHTMLElement.querySelector('.gallery__item');
			cardContainer.addEventListener('click', () => {
				this.modal.openCard(item);
			});

			this.category = cardHTMLElement.querySelector('.card__category');
			this.category.textContent = item.category;
			this.category.className = `card__category ${item.category}`;

			this.title = cardHTMLElement.querySelector('.card__title');
			this.title.textContent = item.title;

			this.image = cardElement.querySelector(
				'.card__image'
			) as HTMLImageElement;
			this.image.src = CDN_URL + item.image;

			// item.image; // Динамически устанавливаем путь к изображению
			this.image.alt = item.title;

			this.price = cardHTMLElement.querySelector('.card__price');
			// Проверка на наличие null в графе цены
			if (item.price === null) {
				this.price.textContent = 'Бесценно';
			} else {
				this.price.textContent = item.price.toString();
			}

			this.container.appendChild(cardHTMLElement);
		});
	}
}
