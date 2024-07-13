// Импорты
import { ensureElement } from '../../utils/utils';
import { IProductModel } from '../../types';
import { Component } from '../base/Component';

interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

// Класс вида карточки товара
export class CardView extends Component<IProductModel> {
	protected _index?: HTMLElement;
	protected _category?: HTMLElement;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _categoryColor = <Record<string, string>>{
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

	constructor(
		className: string,
		parentElement: HTMLElement,
		actions?: IProductActions
	) {
		super(parentElement);
		this._index = parentElement.querySelector(`.basket__item-index`);
		this._category = parentElement.querySelector(`.${className}__category`);
		this._title = ensureElement<HTMLElement>(
			`.${className}__title`,
			parentElement
		);
		this._image = parentElement.querySelector(`.${className}__image`);
		this._description = parentElement.querySelector(`.${className}__text`);
		this._price = parentElement.querySelector(`.${className}__price`);
		this._button = parentElement.querySelector(`.${className}__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				parentElement.addEventListener('click', actions.onClick);
			}
		}
	}
	set index(value: number | null) {
		this.setText(this._index, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(
			this._category,
			`card__category_${this._categoryColor[value]}`,
			true
		);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: string) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
			this.setDisabled(this._button, false);
		} else {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._button, true);
		}
	}

	get button() {
		return this._button;
	}
}
