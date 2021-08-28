/* Data Structures
___________________________________________*/
const myLibrary = [];
const libraryIDnumbers = [];

/* Data Functions
___________________________________________*/
function addBookToLibrary(book) {
  myLibrary.push(book);
}

function showLibrary() {
  for (let book of myLibrary) {
    console.log(book.info());
  }
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
function Book(title, author, description, pages, imageURL) {
  this.title = title;
  this.author = author;
  this.description = description;
  this.pages = pages;
  this.imageURL = imageURL;
  this.id = generateID();
  this.readStatus = false;
}

Book.prototype.info = function () {
  return `\"${this.title}\", by ${this.author}, ${this.pages} pages. ID: ${this.id}`;
};

Book.prototype.updateReadStatus = function (status) {
  /***
  A book's read status is either 
  true = 'read' OR false = 'not read'.
  It is false by default. 
  ****/
  this.readStatus = status;
};

/* Testing
___________________________________________*/
let harryPotter = new Book("Harry Potter", "J.K Rowling", 300);
let webster = new Book("Webster's Original Dictionary", "Webster", 700);
let circe = new Book("Circe", "Madeline Miller", 400);
let adventureZone = new Book("Adventure Zone", "Clint McElroy", 156);
addBookToLibrary(harryPotter);
addBookToLibrary(webster);
addBookToLibrary(circe);
addBookToLibrary(adventureZone);
showLibrary();

/* DOM Interaction
___________________________________________*/
const openModal = document.querySelector(".open-modal");
const closeModal = document.querySelector(".close-modal");
const modalBackground = document.querySelector(".modal-background");
const bookModal = document.querySelector(".book-modal");
const addBook = document.querySelector(".add-book");
const addBookForm = document.querySelector(".add-book-form__form");

openModal.addEventListener("click", showModal);
closeModal.addEventListener("click", hideModal);
modalBackground.addEventListener("click", hideModal);

function showModal() {
  bookModal.classList.add("show-modal");
}

function hideModal() {
  bookModal.classList.remove("show-modal");
}

/* Add Book Form Functions
___________________________________________*/
addBookForm.addEventListener("submit", function (e) {
  let inputs = [...addBookForm.elements];
  let title = inputs[0].value;
  let author = inputs[1].value;
  let description = inputs[2].value;
  let pages = inputs[3].value;
  let imageURL = inputs[4].value;

  let newBook = new Book(title, author, description, pages, imageURL);
  addBookToLibrary(newBook);

  let bookData = {
    title,
    author,
    description,
    pages,
    imageURL,
  };

  createBookCard(bookData);

  hideModal();
  e.preventDefault();
});

/* DOM Updates
___________________________________________*/
/*
A new card needs to be added when a book is added to the collection. It can follow the same outline as the current cards, i.e., div.column > div.card etc...
*/

const cardContainer = document.querySelector(".card-container");

function createBookCard(bookData) {
  let column = createDOMelement("div", ["column"]);
  let bookCard = createDOMelement("div", ["book", "card"]);
  let cardContent = createDOMelement("div", ["card-content"]);
  let title = createDOMelement("p", ["title", "is-4"]);
  let author = createDOMelement("p", ["subtitle", "is-6"]);
  let image = document.createElement("img");
  let content = createDOMelement("div", ["content"]);
  let description = createDOMelement("p");
  let buttons = createDOMelement("ul", ["book-buttons"]);

  // image alternate text should be title of book
  let imageContainer = createDOMelement("figure", ["image", "is-3by4"]);

  title.textContent = bookData.title;
  author.textContent = bookData.author;
  description.textContent = bookData.description;
  image.src = bookData.imageURL || "../assets/images/missing-cover.jpg";

  column.append(bookCard);
  bookCard.append(cardContent);
  cardContent.append(image, title, author, content, buttons);
  content.append(description);
  cardContainer.append(column);

  return;
}

function createDOMelement(type = "div", classes = []) {
  let newElement = document.createElement(type);
  newElement.classList.add(...classes);

  return newElement;
}
