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
  let column = document.createElement("div");
  let bookCard = document.createElement("div");
  let cardContent = document.createElement("div");
  let title = document.createElement("p");
  let author = document.createElement("p");
  let content = document.createElement("div");
  let description = document.createElement("p");
  let buttons = document.createElement("ul");

  column.classList.add(...getBookCardClass("column"));
  bookCard.classList.add(...getBookCardClass("bookCard"));
  cardContent.classList.add(...getBookCardClass("cardContent"));
  title.classList.add(...getBookCardClass("title"));
  author.classList.add(...getBookCardClass("author"));
  content.classList.add(...getBookCardClass("content"));
  description.classList.add(...getBookCardClass("description"));
  buttons.classList.add(...getBookCardClass("buttons"));

  title.textContent = bookData.title;
  author.textContent = bookData.author;
  description.textContent = bookData.description;

  column.append(bookCard);
  bookCard.append(cardContent);
  cardContent.append(title, author, content, buttons);
  content.append(description);
  cardContainer.append(column);

  return;
}

function getBookCardClass(element) {
  let classes;

  switch (element) {
    case "column":
      classes = ["column"];
      break;
    case "bookCard":
      classes = ["book", "card"];
      break;
    case "cardContent":
      classes = ["card-content"];
      break;
    case "title":
      classes = ["title", "is-4"];
      break;
    case "author":
      classes = ["subtitle", "is-6"];
      break;
    case "content":
      classes = ["content"];
      break;
    case "buttons":
      classes = ["book-buttons"];
    default:
      classes = [];
      break;
  }
  return classes;
}
