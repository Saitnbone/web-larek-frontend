// Импорты
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IBasketView {
	products: HTMLElement[];
	count: number | null;
	selected: number;
}

// Класс для корзины покупателя
export class BasketView extends Component<IBasketView> {
	protected _basketList: HTMLElement;
	protected _count: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._basketList = ensureElement<HTMLElement>('.basket__list', this.container);
		this._count = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order-form:open');
			});
		}

		this.products = [];
	}

	set products(products: HTMLElement[]) {
		this._basketList.replaceChildren(...products);
	}

	set count(total: number) {
		this.setText(this._count, `${total}` + ' синапсисов');
	}

	set selected(items: number) {
		this.setDisabled(this._button, items <= 0);
	}
}