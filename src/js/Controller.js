import Card from './Card';

// Класс для управления всей логикой. Слушает интерфейс и реагирует на него
export default class Controller {
	constructor(container) {
		this.container = container;
		// Card
		this.draggingElement = null;
		// Card.proection
		this.draggingProection = null;
	}

	init() {
		this.getSave();
		document.addEventListener('click', this.click.bind(this));
	}

	click(e) {
		const target = e.target;

		if (target.classList.contains('add__text')) {
			target.classList.add('invisible');
			target.closest('.column').querySelector('.add').classList.remove('invisible');
		} else if (target.classList.contains('close')) {
			target.closest('.add').classList.add('invisible');
			target.closest('.column').querySelector('.add__text').classList.remove('invisible');		
		} else if (target.classList.contains('add__button')) {
			const input = target.closest('.add').querySelector('.add__input');					
			input.closest('.column').querySelector('.cards').append((Card.create(input.value).element));				
			input.value = '';
			this.save();		
		} else if (target.classList.contains('card__delete')) {
			const card = e.target.closest('.draggable');					
			card.remove();
			this.save();	
		} else if (target.classList.contains('clear-all')) {
			localStorage.clear();
			location.reload();
		} 
	}

	save() {
		const arr = [];
    	const cardList = document.querySelectorAll('.cards');

    	for (let i = 0; i < cardList.length; i++) {
      		arr.push(cardList[i].innerHTML);
    	}
		
    	localStorage.setItem('cards', arr);	
  	}	

	getSave() {
		const fromStorage = localStorage.getItem('cards');
		
		if (fromStorage) {
			const fromStorageArr = fromStorage.split(',');
      		const newArr = document.querySelectorAll('.cards');
			
			for (let i = 0; i < fromStorageArr.length; i++) {
				newArr[i].innerHTML = fromStorageArr[i];
			}
    	}
	}

	setDraggingElement(node) {
		this.draggingElement = new Card(node);
	}

	replaceDragging() {
		this.draggingProection.replaceWith(this.draggingElement.element);
		this.draggingElement.element.style = this.draggingElement.styles;
	}

	clear() {
		this.draggingElement = null;
		this.draggingProection = null;
	}

	// eslint-disable-next-line
	onMouseDown = (evt) => {
		const target = evt.target;

		if (target.classList.contains('draggable')) {
			this.shiftX = evt.offsetX;
			this.shiftY = evt.offsetY;
			this.setDraggingElement(target);
			this.draggingElement.style = `
		 		left: ${evt.pageX - this.shiftX}px;
		 		top: ${evt.pageY - this.shiftY}px;
			`
			this.proectionAct(evt)
		}
	}

	onMouseUp = () => {
		if (this.draggingElement) {
			this.replaceDragging();
			this.clear();
		}
	}

	// Рассчёт позиции вставки проекции и вставка или удаление
	proectionAct(evt) {
		const target = evt.target;
		const element = this.draggingElement;
		const proection = this.draggingProection;
		if (
			target.classList.contains("cards") &&
			!target.classList.contains("draggable")
		) {
			target.appendChild(proection);
		}
		if (
			target.classList.contains("draggable") &&
			!target.classList.contains("proection")
		) {
			const { y, height } = target.getBoundingClientRect();
			const appendPosition = y + height / 2 > evt.clientY
				? "beforebegin"
				: "afterend";

			if (!proection) {
				this.draggingProection = element.proection;
			} else {
				proection.remove();
				target.insertAdjacentElement(appendPosition, proection);
			}
		} 
	}
	
  //Стрелочные функции в качестве метода, чтобы не терять контект при передаче метода в addEventListener. Иначе нужно биндить контекст к объекту класса.
	onMouseMove = (evt) => {
		if (this.draggingElement) {
			const { pageX, pageY } = evt;
			const element = this.draggingElement;
			const { width, height } = this.draggingElement.styles;
			element.styles = `
				position: absolute;
		 		left: ${pageX - this.shiftX}px;
		 		top: ${pageY - this.shiftY}px;
		 		pointer-events: none;
				width: ${width};
				height: ${height};
			`
			this.proectionAct(evt);
			
		}
		this.save();	
	}
}