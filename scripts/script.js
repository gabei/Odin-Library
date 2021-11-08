/*__________LOCAL STORAGE__________  */

const DB = window.localStorage;

// variation on MDN's storage test function
function storageIsAvailable() {
  try {
    DB.setItem("poweron", "selftest");
    DB.getItem("poweron");
    DB.removeItem("poweron");
    DB.clear();
    return true;
  } catch (error) {
    console.error(error);
    alert("Local Storage is not available");
  }
}

if (storageIsAvailable()) console.log("Storage is available");

function createStore() {
  DB.setItem("myLibrary", myLibrary);
}

function updateStorage() {
  DB.setItem("myLibrary", myLibrary);
}

function getAllFromStorage() {
  let data = DB.getItem("myLibrary");
  if (data) {
    myLibrary = [...data];
    return true;
  } else {
    console.log("no data to retreive");
  }
}

function clearStorage() {
  DB.clearStorage();
}

function tryStorage() {
  try {
    if (getAllFromStorage()) console.log("Storage retreived");
  } catch (error) {
    console.error(error);
    createStore();
    console.log("new storage created");
  }
}

/* Data Structures
___________________________________________*/
const myLibrary = [];
const libraryIDnumbers = [];
tryStorage();

/* Data Functions
___________________________________________*/
function addBookToLibrary(book) {
  myLibrary.push(book);
  updateStorage();
}

function removeBookFromLibrary(book) {
  let indexToRemove = book.stackID;
  let IDtoCompare = myLibrary[indexToRemove].id;
  //check that the book ID matches the ID of the book at target index
  if (IDtoCompare === book.id) {
    myLibrary.splice(indexToRemove, 1);
    removeBookFromLibrary(IDtoCompare);
  }
}

function showLibrary() {
  if (myLibrary.length === 0) return [];
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
  this.stackID = myLibrary.length;
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
  createBookCard(newBook);

  hideModal();
  e.preventDefault();
});

/* DOM Updates
___________________________________________*/
/*
A new card needs to be added when a book is added to the collection. It can follow the same outline as the current cards: book-card__etc...
*/

const cardContainer = document.querySelector(".book-container");

function createBookCard(book) {
  let bookCard = createDOMelement("div", ["book-card"]);
  let info = createDOMelement("div", ["book-card__info"]);
  let title = createDOMelement("p", ["book-card__info--title"]);
  let author = createDOMelement("p", ["book-card__info--author"]);
  let description = createDOMelement("div", ["book-card__description"]);
  let buttons = createDOMelement("div", ["book-card__buttons"]);
  let imageContainer = createDOMelement("div", ["book-card__image"]);
  let image = createDOMelement("img");
  let removeButton = createDOMelement(
    "button",
    ["button", "button--remove"],
    "Remove"
  );
  let readButton = createDOMelement(
    "button",
    ["button", "button--info"],
    "Mark as Read"
  );

  removeButton.addEventListener("click", () => {
    removeBookFromDOM(bookCard);
    removeBookFromLibrary(book);
  });

  readButton.addEventListener("click", () => {
    toggleReadStatus(book);
    book.readStatus === false
      ? (readButton.innerHTML = "Mark as Read")
      : (readButton.innerHTML = "Mark as Unread");
  });

  title.textContent = book.title;
  author.textContent = book.author;
  description.textContent = book.description;
  image.src = book.imageURL || "../assets/images/missing-cover.jpg";

  imageContainer.append(image);
  buttons.append(readButton, removeButton);
  info.append(title, author);
  bookCard.append(imageContainer, info, description, buttons);
  cardContainer.append(bookCard);

  return;
}

function createDOMelement(type = "div", classes = [], text = "") {
  let newElement = document.createElement(type);
  newElement.classList.add(...classes);

  if (type === "button") newElement.textContent = text;

  return newElement;
}

function removeBookFromDOM(card) {
  card.remove();
}

function toggleReadStatus(book) {
  book.readStatus === false
    ? book.updateReadStatus(true)
    : book.updateReadStatus(false);
}
