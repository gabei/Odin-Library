/* Data Vars
___________________________________________*/
let myLibrary = [];
let libraryIDnumbers = [];

/* Data Functions
___________________________________________*/
function addBookToLibrary(book) {
  myLibrary.push(book);
  updateLocalStorage();
}

function removeBookFromLibrary(book) {
  // double check that the book ID matches the ID of the book at target index
  let indexToRemove = myLibrary.findIndex((x) => x.id === book.id);
  myLibrary.splice(indexToRemove, 1);
  updateLocalStorage();
}

function generateID() {
  let newID = new Date().valueOf();

  while (numberIsTaken(newID)) {
    newID = new Date().valueOf();
  }

  libraryIDnumbers.push(newID);
  return newID;
}

function numberIsTaken(id) {
  return libraryIDnumbers.includes(id);
}

/* Book Object
___________________________________________*/
function Book(title, author, description, pages, imageURL, readStatus) {
  this.title = title;
  this.author = author;
  this.description = description;
  this.pages = pages;
  this.imageURL = imageURL;
  this.id = generateID();
  this.readStatus = readStatus || false;
  this.stackID = myLibrary.length;

  this.updateReadStatus = function (status) {
    this.readStatus = status;
    updateLocalStorage(myLibrary);
  };

  this.info = function () {
    return `\"${this.title}\", by ${this.author}, ${this.pages} pages. ID: ${this.id}`;
  };
}

/* DOM Interaction Vars
___________________________________________*/
//this must be initialized before data is pulled from storage
const cardContainer = document.querySelector('.book-container');

const openModal = document.querySelector('.open-modal');
const closeModal = document.querySelector('.close-modal');
const modalBackground = document.querySelector('.modal-background');
const bookModal = document.querySelector('.book-modal');
const addBook = document.querySelector('.add-book');
const addBookForm = document.querySelector('.add-book-form__form');

openModal.addEventListener('click', showModal);
closeModal.addEventListener('click', hideModal);
modalBackground.addEventListener('click', hideModal);

/* DOM Interaction Functions
___________________________________________*/
function showModal() {
  bookModal.classList.add('show-modal');
}

function hideModal() {
  bookModal.classList.remove('show-modal');
}

/* Add Book Form Functions
___________________________________________*/
const inputs = [...addBookForm.elements].slice(0, 5);
addBookForm.addEventListener('submit', function (e) {
  let formValues = [];

  inputs.forEach((input) => {
    formValues.push(input.value);
  });

  let newBook = new Book(...formValues);

  addBookToLibrary(newBook);
  createBookCard(newBook);

  hideModal();
  e.preventDefault();
});

/* Form Validation
___________________________________________*/
inputs.forEach((field) => {
  field.addEventListener('input', validate);
});

function validate(input) {
  if (input == 'undefined') return;

  if (!input.validity.valid) {
    input.setCustomValidity('This field needs filled!');
    input.reportValidity();
  } else {
    input.setCustomValidity('');
  }
}

/* Book Cards
___________________________________________*/
function createBookCard(book) {
  let bookCard = createDOMelement('div', ['book-card']);
  let info = createDOMelement('div', ['book-card__info']);
  let title = createDOMelement('p', ['book-card__info--title']);
  let author = createDOMelement('p', ['book-card__info--author']);
  let description = createDOMelement('div', ['book-card__description']);
  let buttons = createDOMelement('div', ['book-card__buttons']);
  let imageContainer = createDOMelement('div', ['book-card__image']);
  let image = createDOMelement('img');
  let removeButton = createDOMelement(
    'button',
    ['button', 'button--remove'],
    'Remove'
  );
  let readButton = createDOMelement(
    'button',
    ['button', 'button--info'],
    'Mark as Read'
  );

  removeButton.addEventListener('click', () => {
    removeBookFromDOM(bookCard);
    removeBookFromLibrary(book);
  });

  readButton.addEventListener('click', () => {
    toggleReadStatus(book);
    book.readStatus === false
      ? (readButton.innerHTML = 'Mark as Read')
      : (readButton.innerHTML = 'Mark as Unread');
  });

  title.textContent = book.title;
  author.textContent = book.author;
  description.textContent = book.description;
  image.src = book.imageURL || '../assets/images/missing-cover.jpg';

  imageContainer.append(image);
  buttons.append(readButton, removeButton);
  info.append(title, author);
  bookCard.append(imageContainer, info, description, buttons);
  cardContainer.append(bookCard);

  return;
}

function createDOMelement(type = 'div', classes = [], text = '') {
  let newElement = document.createElement(type);
  newElement.classList.add(...classes);

  if (type === 'button') newElement.textContent = text;

  return newElement;
}

function removeBookFromDOM(card) {
  card.remove();
}

function toggleReadStatus(book) {
  book.readStatus === false
    ? (book.readStatus = true)
    : (book.readStatus = false);
  updateLocalStorage();
}

/*__________LOCAL STORAGE__________  */
// variation on MDN's storage test function
function storageIsAvailable() {
  try {
    localStorage.setItem('poweron', 'selftest');
    localStorage.getItem('poweron');
    localStorage.removeItem('poweron');
    localStorage.clear();
    return true;
  } catch (error) {
    console.log('Local Storage is not available');
    console.error(error);
  }
}

function initStorage() {
  if (storageIsAvailable) {
    console.log('Local storage is available.');
    getLocalStorage();
  }
}

function getLocalStorage() {
  let books = JSON.parse(localStorage.getItem('myLibrary'));
  if (books) {
    addBooksFromStorage(books);
  } else {
    mylibrary = [];
  }
}

function addBooksFromStorage(books) {
  myLibrary = books.map((book) => book);
  for (book of myLibrary) {
    createBookCard(book);
  }
}

function updateLocalStorage() {
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

// Start here.
initStorage();
