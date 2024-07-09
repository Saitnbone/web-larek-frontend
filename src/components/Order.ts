import { PersonalInformation } from './PersonaInformation';

// Интерфейс заказа
interface IOrder {}

// Класс с выбором способа доставки
export class Order {
	template: HTMLTemplateElement;
	personalInformation: PersonalInformation;
	modalContainer: HTMLElement;
	inputElement: HTMLInputElement;
	orderButton: HTMLButtonElement;
	formElement: HTMLFormElement;

	constructor(
		personalInformation: PersonalInformation,
		template: HTMLTemplateElement,
		modalContainer: HTMLElement
	) {
		this.personalInformation = personalInformation;
		this.template = template;
		this.modalContainer = modalContainer;
	}

	// Метод рендеринга модального окна
	renderOrderModal() {
		this.clearContent();

		const orderElement = this.template.content.cloneNode(true) as HTMLElement;
		const orderButtons: NodeListOf<HTMLButtonElement> =
			orderElement.querySelectorAll('.button_alt');

		this.formElement = orderElement.querySelector('.form');
		this.inputElement = this.formElement.querySelector(
			'.form__input'
		) as HTMLInputElement;

		this.orderButton = orderElement.querySelector(
			'.order__button'
		) as HTMLButtonElement;

		this.modalContainer.appendChild(orderElement);

		// Добавление обработчиков событий для кнопок
		orderButtons.forEach((button: HTMLButtonElement) => {
			button.addEventListener('click', () => {
				orderButtons.forEach((btn: HTMLButtonElement) => {
					btn.classList.remove('button_alt-active');
				});
				button.classList.add('button_alt-active');
				this.checkValidation(orderButtons);
			});
		});

		// Слушатели событий для формы
		this.formElement.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.personalInformation.renderModal();

			// this.orderButton.addEventListener('click', () =>
			// 	this.personalInformation.renderModal()
			// );
		});

		this.inputElement.addEventListener('input', () => {
			this.checkValidation(orderButtons);
		});

		// this.orderButton.addEventListener('click', () =>
		// 	this.personalInformation.renderModal()
		// );

		// Первоначальная проверка формы
		this.checkValidation(orderButtons);
	}

	// Метод проверки формы
	checkValidation(orderButtons: NodeListOf<HTMLButtonElement>) {
		let activeButton = false;
		orderButtons.forEach((button: HTMLButtonElement) => {
			if (button.classList.contains('button_alt-active')) {
				activeButton = true;
			}
		});

		//Проверка валидации формы
		if (this.inputElement.value.trim() !== '' && activeButton) {
			this.orderButton.disabled = false;
		} else {
			this.orderButton.disabled = true;
		}
	}

	// Метод очистки модального окна
	clearContent() {
		this.modalContainer.innerHTML = '';
	}
}
