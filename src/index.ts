// Импорт стилей
import './scss/styles.scss';

// Импорты различных компонентов
import { Api } from './components/base/api';
import { Card } from './components/Card';
import { CardView } from './components/CardView';
import { CardModal } from './components/CardModal';
import { Basket } from './components/Basket';
import { BasketView } from './components/BasketView';
import { BasketButton } from './components/BasketButton';

// DOM-узлы
const page = document.querySelector('.page') as HTMLBodyElement;
const modalContainer = document.querySelector(
	'#modal-container'
) as HTMLElement;
const basketContainer = document.querySelector('.basket') as HTMLElement;
const contentArea = modalContainer.querySelector(
	'.modal__content'
) as HTMLElement;
const basketItemContainer = document.querySelector(
	'.basket__item'
) as HTMLElement;
const headerButton = document.querySelector(
	'.header__basket'
) as HTMLButtonElement;

// Константы для проекта
const apiOrigin = process.env.API_ORIGIN;

if (!apiOrigin) {
	throw new Error('API_ORIGIN is not defined in file .env');
}

// Создание экземпляров классов для проекта
const api = new Api(apiOrigin);
const basket = new Basket();
const basketView = new BasketView(modalContainer, basketContainer);
const basketButton = new BasketButton(
	modalContainer,
	basket,
	basketView,
	headerButton
);
const modal = new CardModal(
	page,
	modalContainer,
	contentArea,
	basket,
	basketView
);
const cardView = new CardView(modal);

// Функция создания экземпляров данных карточки
async function fetchCards() {
	try {
		const cardData: any = await api.get('/api/weblarek/product/');

		// Проверяем, что cardData имеет свойство items
		if (cardData && Array.isArray(cardData.items)) {
			const cards = cardData.items.map(
				(item: any) =>
					new Card(
						item.id,
						item.description,
						item.image,
						item.title,
						item.category,
						item.price
					)
			);

			console.log('Cards:', cards);

			// Вызов метода рендеринга карточек на странице
			cardView.renderElement(cards);
		} else {
			throw new Error('Unexpected data format: items array not found');
		}
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

fetchCards();
