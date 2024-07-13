// Импорты
import { IEvents } from '../base/events';

export const isModel = (obj: unknown): obj is Model<any> => {
	return obj instanceof Model;
}

// Абстрактный класс для модели
export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	emitChanges(event: string, payload?: object) {
		// Состав данных можно модифицировать
		this.events.emit(event, payload ?? {});
	}
}