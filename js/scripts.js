let myLibrary = [];

function Book(title, author, pages, read) {
	this.title = title
	this.author = author
	this.pages = pages
	this.read = read
	this.info = function() {
		return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`
	}
}

function addBookToLibrary(title, author, pages, read) {
	let book = new Book(title, author, pages, read);
	myLibrary.push(book);
	localStorage.setItem('library', JSON.stringify(myLibrary));
}

function displayLibrary() {
	if (localStorage.length > 0) {
		libraryContainer.innerHTML = "";
		myLibrary = JSON.parse(localStorage.getItem('library'));
		let index = 0;
		myLibrary.forEach(book => {
			let bookButton = (book.read == 'Read') ? 'Unread' : 'Read';
			libraryContainer.innerHTML += `<div class="book" data-index-number="${index}">
			<h2 class="text-center">${book.title}</h2>
			<h3 class="text-center">by ${book.author}</h3>
			<p class="text-center"><strong>Pages: ${book.pages}</strong></p>
			<h2 class="text-center">${book.read}</h2>
			<div class="buttons">
			<button data-book-delete data-id="${index}" class="delete-button">Delete</button>
			<button data-book-read data-id="${index}" class="read-button">${bookButton}</button>
			</div>
			</div>`;
			index++;
		});
		bookButtonsEventBuilder();
	} else {
		const modal = document.getElementById('modal');
		openModal(modal);
	}	
}

function displayNewBook(obj) {
	let bookButton = (obj.read == 'Read') ? 'Unread' : 'Read';
	libraryContainer.innerHTML += `<div class="book" data-index-number="${myLibrary.length - 1}">
		<h2 class="text-center">${obj.title}</h2>
		<h3 class="text-center">by ${obj.author}</h3>
		<p class="text-center"><strong>Pages: ${obj.pages}</strong></p>
		<h2 class="text-center">${obj.read}</h2>
		<div class="buttons">
				<button data-book-delete data-id="${myLibrary.length - 1}" class="delete-button">Delete</button>
				<button data-book-read data-id="${myLibrary.length -1}" class="read-button">${bookButton}</button>
			</div>
	</div>`;
	bookButtonsEventBuilder();
}

function deleteBook(id) {
	if (myLibrary.length > 1) {
		myLibrary.splice(id, 1);
		localStorage.setItem('library', JSON.stringify(myLibrary));
	} else {
		localStorage.clear();
		libraryContainer.innerHTML = "";
	}
	displayLibrary();
}

function readUnread(id, read) {
	myLibrary[id].read = read;
	localStorage.setItem('library', JSON.stringify(myLibrary));
	displayLibrary();
}

function bookButtonsEventBuilder() {
	let deleteButtons = document.querySelectorAll('[data-book-delete]');
	let readButtons = document.querySelectorAll('[data-book-read]');

	deleteButtons.forEach(button => {
		button.addEventListener('click', () => {
			let id = button.getAttribute('data-id');
			deleteBook(id);
		});
	});

	readButtons.forEach(button => {
		button.addEventListener('click', () => {
			let id = button.getAttribute('data-id');
			let read = button.innerHTML;
			readUnread(id, read);
		});
	});
}

function openModal(modal) {
	if (modal == null) return;
	modal.classList.add('active');
	overlay.classList.add('active');
}

function closeModal(modal) {
	if (modal == null) return;
	modal.classList.remove('active');
	overlay.classList.remove('active');
}

const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-modal-close]');
const overlay = document.getElementById('overlay');
const form = document.getElementById('add-book-form');
const libraryContainer = document.getElementById('library');

openModalButtons.forEach(button => {
	button.addEventListener('click', () => {
		const modal = document.querySelector(button.dataset.modalTarget);
		openModal(modal);
	});
});

closeModalButtons.forEach(button => {
	button.addEventListener('click', () => {
		const modal = button.closest('.modal');
		closeModal(modal);
	});
});

overlay.addEventListener('click', () => {
	const modals = document.querySelectorAll('.modal.active');
	modals.forEach(modal => {
		closeModal(modal);
	});
});

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const data = {};
	const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
	const checkbox = document.querySelector('input[type="checkbox"]');
	inputs.forEach(input => {
		let key = input.name;
		let value = input.value;
		data[key] = value;
	});
	checkbox.checked ? data.read = 'Read' : data.read = 'Unread';
	const modals = document.querySelectorAll('.modal.active');
	modals.forEach(modal => {
		closeModal(modal);
	});
	addBookToLibrary(data.title, data.author, data.pages, data.read);
	displayNewBook(data);
	form.reset();
});

displayLibrary();