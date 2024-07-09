import { ConfirmOrder } from './ConfirmOrder';

// Класс для модального окна с персональной информацией
export class PersonalInformation {
	template: HTMLTemplateElement;
	modalContainer: HTMLElement;
	confirmOrder: ConfirmOrder;
	formElement: HTMLFormElement;
	paymentButton: HTMLButtonElement;

	constructor(
		confirmOrder: ConfirmOrder,
		template: HTMLTemplateElement,
		modalContainer: HTMLElement
	) {
		this.confirmOrder = confirmOrder;
		this.template = template;
		this.modalContainer = modalContainer;
	}

	// Метод рендеринга модального окна контактными данными
	renderModal() {
		this.clearContent();
		const personalElement = this.template.content.cloneNode(
			true
		) as HTMLElement;
		this.formElement = personalElement.querySelector('.form');
		const formInputs: NodeListOf<HTMLButtonElement> =
			this.formElement.querySelectorAll('.form__input');
		this.paymentButton = personalElement.querySelector('.button');

		this.modalContainer.appendChild(personalElement);

		// Слушатели событий
		formInputs.forEach((inputElement) => {
			inputElement.addEventListener('input', () =>
				this.checkValidation(formInputs)
			);
		});

		// this.paymentButton.addEventListener('click', () =>
		// 	this.confirmOrder.renderOrderModal()
		// );

		this.formElement.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.confirmOrder.renderOrderModal();
		});

		this.paymentButton.addEventListener('click', () =>
			this.confirmOrder.renderOrderModal()
		);
	}

	// Метод для проверки инпутов формы
	checkValidation(formInputs: NodeListOf<HTMLButtonElement>) {
		formInputs.forEach((inputElement) => {
			if (inputElement.value.trim() !== '') {
				this.paymentButton.disabled = false;
			} else {
				this.paymentButton.disabled = true;
			}
		});
	}

	// Метод очистки модального окна
	clearContent() {
		this.modalContainer.innerHTML = '';
	}
}
