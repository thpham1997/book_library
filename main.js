const BOOKLIST = document.querySelector('.book_list');
const ADDING_CARD = document.querySelector('.adding_card');
const FORM = document.querySelector('.form');
const FORM_BTN_CLOSE = document.querySelector('.form__btn--close')
const FORM_BTN_SUBMIT = document.querySelector('.form__btn--submit');

let myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'read' : 'not read yet'}`;
  }
}

Book.prototype.isRead = function () {
  this.read = !this.read;
}

function addBookToLibrary(book) {
  if (!myLibrary.includes(book)) {
    book['index'] = myLibrary.length;
    myLibrary.push(book);
    let card = document.createElement('div');
    let p = document.createElement('p');
    let deleteBtn = document.createElement('button');
    let readBtn = document.createElement('button');

    // deleteBtn.classList.add('deleteBtn')
    // deleteBtn.style.display = 'none';
    readBtn.addEventListener('click', (e) => {
      myLibrary[myLibrary.length - 1].isRead();
      p.textContent = myLibrary[myLibrary.length - 1].info();
    });
    deleteBtn.addEventListener('click', (e) => {
      myLibrary.splice(myLibrary[myLibrary.length - 1].index, 1);
      BOOKLIST.removeChild(card);
    });
    p.textContent = myLibrary[myLibrary.length - 1].info();
    deleteBtn.textContent = 'Delete';
    readBtn.textContent = 'Read';
    p.style.padding = '1rem 1rem';
    card.appendChild(p);
    card.appendChild(deleteBtn);
    card.appendChild(readBtn);
    card.classList.add('card');
    BOOKLIST.insertBefore(card, ADDING_CARD);
    return true;
  }
  return false;
}

// manually added books

const book1 = new Book('The Information: A History, a Theory, a Flood', 'James Gleick', 200, false);
const book2 = new Book('Everything Is Miscellaneous: The Power of the New Digital Disorder', 'David Weinberger', 300, true);
addBookToLibrary(book1);
addBookToLibrary(book2);


ADDING_CARD.addEventListener('click', (e) => {
  FORM.style.display = 'block';
});
FORM_BTN_CLOSE.addEventListener('click', (e) => {
  FORM.style.display = 'none';
})
FORM_BTN_SUBMIT.addEventListener('click', (e) => {
  console.log(FORM.element.value);
});