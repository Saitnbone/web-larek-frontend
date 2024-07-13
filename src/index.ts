// Импорт стилей
import './scss/styles.scss';

// Импорт классов
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { AppApi } from './components/base/api';
import { IOrder, IProductModel, TOrder } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { PageModel } from './components/model/Page';
import { PageView } from './components/view/PageView';
import { CardView } from './components/view/CardView';
import { Modal } from './components/base/Modal';
import { BasketView } from './components/view/BasketView';
import { OrderFormView } from './components/view/FormOrderView';
import { ContactsFormView } from './components/view/FormContactsView';
import { SuccessFormView } from './components/view/FormSuccessView';

// Константы для проекта
const events = new EventEmitter();

// Темплейты
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const modalPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const productInBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Экземпляры классов
const page = new PageView(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const api = new AppApi(CDN_URL, API_URL);
const pageModel = new PageModel({}, events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderView = new OrderFormView(cloneTemplate(orderTemplate), events);
const contactsView = new ContactsFormView(
	cloneTemplate(contactsTemplate),
	events
);

// API-запрос на получение данных с сервера
api
	.getProducts()
	.then((res) => {
		pageModel.products = res;
		events.emit('products:loaded', res);
	})
	.catch((err) => console.error(err));

// Включение всех событий в приложении
events.onAll(() => {});

// Включение события открытия Модальных окон
events.on('modal:open', () => {
	page.locked = true;
});

// Включение события открытия Модальных окон
events.on('modal:close', () => {
	page.locked = false;
});

// Включение события рендеринга карточек товаров
events.on('products:loaded', () => {
	page.catalog = pageModel.products.map((product) => {
		const card = new CardView('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', product),
		});

		return card.render({
			image: product.image,
			title: product.title,
			category: product.category,
			price: product.price,
		});
	});
});

// Включение события выбора карточки товара при клике
events.on('card:select', (item: IProductModel) => {
	const selectedCard = pageModel.getProduct(item.id);
	const card = new CardView('card', cloneTemplate(modalPreviewTemplate), {
		onClick: () => {
			if (pageModel.basket.includes(item)) {
				card.setText(card.button, 'В корзину');
				events.emit('card:deletefromcart', item);
			} else {
				events.emit('card:addtocart', item);
				card.setText(card.button, 'Удалить из корзины');
			}
		},
	});

	if (selectedCard.price === null) {
		card.setDisabled(card.button, true);
	}
	if (pageModel.basket.includes(item)) {
		card.setDisabled(card.button, true);
	} else {
		card.setDisabled(card.button, false);
	}

	// Сохранение состояния кнопки после закрытия модального окна
	card.setText(
		card.button,
		pageModel.basket.includes(item) ? 'Удалить из корзины' : 'В корзину'
	);

	modal.render({
		content: card.render({
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
			description: item.description,
		}),
	});
});

// Включение события добавления карточки товара в корзину
events.on('card:addtocart', (item: IProductModel) => {
	pageModel.addToBasket(item);
	page.counter = pageModel.basket.length;
});

// Включение события открытия корзины покупателя
events.on('basket:open', () => {
	const products = pageModel.basket.map((item, index) => {
		const product = new CardView(
			'card',
			cloneTemplate(productInBasketTemplate),
			{
				onClick: () => {
					events.emit('card:deletefromcart', item);
					events.emit('basket:open');
				},
			}
		);

		return product.render({
			price: item.price,
			title: item.title,
			id: item.id,
			index: index + 1,
		});
	});

	modal.render({
		content: basketView.render({
			products,
			count: pageModel.setTotal(),
			selected: products.length,
		}),
	});
});

// Включени события удаления карточки из корзины
events.on('card:deletefromcart', (item: IProductModel) => {
	pageModel.deleteFromBasket(item);
	page.counter = pageModel.basket.length;
});

// Включение события открытия модального окна с выбором способа оплаты
events.on('order-form:open', () => {
	pageModel.order.total = pageModel.setTotal();
	pageModel.order.items = pageModel.basket.map((item) => item.id);
	modal.render({
		content: orderView.render({
			valid: false,
			errors: [],
		}),
	});
});

const updateOrderAndContacts = (data: {
	field: keyof TOrder;
	value: string;
}) => {
	pageModel.setOrderField(data.field, data.value);
};

events.on(/^order\..*:change/, updateOrderAndContacts);
events.on(/^contacts\..*:change/, updateOrderAndContacts);

events.on('payment:take', (data: { payment: string }) => {
	pageModel.setOrderField('payment', data.payment);
});

events.on('form-errors:change', (errors: Partial<IOrder>) => {
	const { payment, address } = errors;

	orderView.valid = !payment && !address;
	orderView.errors = Object.values({ address, payment })
		.filter(Boolean)
		.join('; ');
});

// Включение события подписи в окне заказа
events.on('order:submit', () => {
	modal.render({
		content: contactsView.render({
			valid: false,
			errors: [],
		}),
	});
});

// Включение события подписи в окне контактов
events.on('contacts:submit', () => {
	api
		.orderProducts(pageModel.order)
		.then(() => {
			pageModel.clearBasket();
			pageModel.order = {
				payment: '',
				email: '',
				phone: '',
				address: '',
				items: [],
				total: pageModel.order.total,
			};
			page.counter = pageModel.basket.length;

			const successView = new SuccessFormView(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					pageModel.order.total = 0;
				},
			});

			modal.render({
				content: successView.render({
					total: pageModel.order.total,
				}),
			});
		})
		.catch((err) => console.error(err));
});
