// Класс представляющий карточку. Имеет всё, чтобы появится и удалиться

export default class Card {
	#el;	
	#styles; 

	constructor(element) {
		this.#el = element;
		this.#styles = window.getComputedStyle(element);
	}

	set styles(text) {
		this.#el.style.cssText = text;
	}

	get styles() {
		return this.#styles;
	}

	get proection() {
		return (() => {
			const d = document.createElement('div');
			d.classList.add('proection');
			const { width, height } = this.styles;
			d.style.cssText = `
	 			width: ${width};
		 		height: ${height};
		 		margin: 10px 0;
			`
			return d;
		})();
	}

	static create(content) {
		const node = document.createElement('div');
		node.classList.add('draggable');
		
		const cardText = document.createElement('div');
		cardText.classList.add('card__text');
		cardText.textContent = content;
		node.appendChild(cardText);

		const cardDelete = document.createElement('div');
		cardDelete.classList.add('card__delete');
		cardDelete.textContent = 'X';
		node.appendChild(cardDelete);

		return new Card(node);
	}

	get element() {
		return this.#el;
	}
}