// Импорты
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ISuccessView {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

// Класс для формы с успешным заказом
export class SuccessFormView extends Component<ISuccessView> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
