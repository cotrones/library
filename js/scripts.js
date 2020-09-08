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
	myLibrary = JSON.parse(localStorage.getItem('library'));
	myLibrary.forEach(book => {
		libraryContainer.innerHTML += `<div class="book">
			<h2 class="text-center">${book.title}</h2>
			<h3 class="text-center">${book.author}</h3>
			<p class="text-center"><strong>Pages: ${book.pages}</strong></p>
			<h2 class="text-center">${book.read}</h2>
		</div>`;
	});
}

function displayNewBook(obj) {
	libraryContainer.innerHTML += `<div class="book">
		<h2 class="text-center">${obj.title}</h2>
		<h3 class="text-center">${obj.author}</h3>
		<p class="text-center"><strong>Pages: ${obj.pages}</strong></p>
		<h2 class="text-center">${obj.read}</h2>
	</div>`;
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
	addBookToLibrary(data.title, data.author, data.pages, data.read);
	displayNewBook(data);
	console.log(myLibrary);
});

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

displayLibrary();