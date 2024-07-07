import { ICardModel } from "../types/index";

export class Card implements ICardModel {
	protected _id: string;
	protected _description: string;
	protected _image: string;
	protected _title: string;
	protected _category: string;
	protected _price: number;

	constructor(
		id: string,
		description: string,
		image: string,
		title: string,
		category: string,
		price: number
	) {
		this._id = id;
		this._description = description;
		this._image = image;
		this._title = title;
		this._category = category;
		this._price = price;
	}

	get id(): string {
		return this._id;
	}

	set id(value: string) {
		this._id = value;
	}

	get description(): string {
		return this._description;
	}

	set description(value: string) {
		this._description = value;
	}

	get image(): string {
		return this._image;
	}

	set image(value: string) {
		this._image = value;
	}

	get title(): string {
		return this._title;
	}

	set title(value: string) {
		this._title = value;
	}

	get category(): string {
		return this._category;
	}

	set category(value: string) {
		this._category = value;
	}

	get price(): number {
		return this._price;
	}

	set price(value: number) {
		this._price = value;
	}
}