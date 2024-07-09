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
import { Order } from './components/Order';
import { PersonalInformation } from './components/PersonaInformation';
import { ConfirmOrder } from './components/ConfirmOrder';

// DOM-узел для главной страницы приложения
const page = document.querySelector('.page') as HTMLBodyElement;

// DOM-узлы для блока-вставки
const modalContainer = document.querySelector(
	'#modal-container'
) as HTMLElement;
const contentArea = modalContainer.querySelector(
	'.modal__content'
) as HTMLElement;

// DOM-узлы для корзины приложения
const basketContainer = document.querySelector('.basket') as HTMLElement;
const basketItemContainer = document.querySelector(
	'.basket__item'
) as HTMLElement;
const headerButton = document.querySelector(
	'.header__basket'
) as HTMLButtonElement;
const basketCounter = headerButton.querySelector(
	'.header__basket-counter'
) as HTMLElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;

// DOM-узлы для модального окна с выбором способа доставки
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;

// DOM-узлы для модального окна с персональной информацией
const personalTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;

// DOM-узлы для модального окна с успешным заказом
const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;

// Константы для проекта
const apiOrigin = process.env.API_ORIGIN;
if (!apiOrigin) {
	throw new Error('API_ORIGIN is not defined in file .env');
}

// Экземпляры классов
const api = new Api(apiOrigin);
const basket = new Basket();
const confirmOrder = new ConfirmOrder(basket, successTemplate, contentArea);
const personalInformation = new PersonalInformation(
	confirmOrder,
	personalTemplate,
	contentArea
);
const order = new Order(personalInformation, orderTemplate, contentArea);
const basketView = new BasketView(
	basket,
	modalContainer,
	basketContainer,
	basketTemplate,
	cardBasketTemplate,
	basketCounter,
	order
);
const basketButton = new BasketButton(
	page,
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
