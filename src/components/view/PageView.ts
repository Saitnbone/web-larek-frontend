// Импорты
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

// Класс вида страницы приложения
export class PageView extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalogBlock: HTMLElement;
	protected _wrapperBlock: HTMLElement;
	protected _basketElement: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalogBlock = ensureElement<HTMLElement>('.gallery');
		this._wrapperBlock = ensureElement<HTMLElement>('.page__wrapper');
		this._basketElement = ensureElement<HTMLElement>('.header__basket');

		this._basketElement.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this._catalogBlock.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapperBlock, 'page__wrapper_locked', value)
	}
}