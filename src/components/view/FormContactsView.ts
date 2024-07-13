// Импорты
import { IEvents } from "../base/events";
import { Form } from '../base/Form'
import { IOrder } from "../../types";

// Класс для формы с контактами
export class ContactsFormView extends Form<IOrder> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._emailInput = container.elements.namedItem('email') as HTMLInputElement;
		this._phoneInput = container.elements.namedItem('phone') as HTMLInputElement;
	}

	set phone(value: string) {
		this._phoneInput.value = value;
	}

	set email(value: string) {
		this._emailInput.value = value;
	}
}
