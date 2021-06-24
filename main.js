const BOOKLIST = document.querySelector('.book_list');
const ADDING_CARD = document.querySelector('.adding_card');
const FORM = document.querySelector('.form');
const FORM_BTN_CLOSE = document.querySelector('.form__btn--close')
const FORM_BTN_SUBMIT = document.querySelector('.form__btn--submit');
const TITLE_TEXT_FIELD = document.getElementsByName('title');
const AUTHOR_TEXT_FIELD = document.getElementsByName('author');
const PAGE_NUMBER = document.getElementsByName('pages');
const IS_READ = document.getElementsByName('read');
let myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages`;
    //  ${this.read ? 'read' : 'not read yet'}` 
  }
  this.readInfo = function () {
    return `${this.read ? 'Read' : 'Not Read'}`;
  }
}

Book.prototype.isRead = function () {
  this.read = !this.read;
}

function addBookToLibrary(book) {
  // for(let i = 0; i < myLibrary.length; i ++){
  //   myLibrary[i]['index'] = i;
  // }
  if (!myLibrary.includes(book)) {
    // book['index'] = myLibrary.length;
    myLibrary.push(book);
    // console.log(myLibrary);
    let card = document.createElement('div');
    let p = document.createElement('p');
    let deleteBtn = document.createElement('button');
    let readBtn = document.createElement('button');

    deleteBtn.classList.add('deleteBtn')
    readBtn.classList.add('readBtn');
    deleteBtn.textContent = 'Delete';
    readBtn.textContent = book.readInfo();
    readBtn.style.backgroundColor = book.read ? '#52b69a' : '#d4534a';
    readBtn.style.color = book.read ? 'black' : 'white';

    readBtn.addEventListener('click', (e) => {
      let index = Number(e.target.parentNode.getAttribute('data-index'));
      myLibrary[index].isRead();
      e.target.textContent = myLibrary[index].readInfo();
      e.target.style.backgroundColor = myLibrary[index].read ? '#52b69a' : '#d4534a';
      e.target.style.color = book.read ? 'black' : 'white';
    });
    deleteBtn.addEventListener('click', (e) => {
      let index = Number(e.target.parentNode.getAttribute('data-index'));
      myLibrary.splice(index, 1);
      BOOKLIST.removeChild(e.target.parentNode);
      // console.log(myLibrary);
      updateIndex();
    });

    p.textContent = myLibrary[myLibrary.length - 1].info();
    p.style.padding = '1rem 1rem';
    card.appendChild(p);
    card.appendChild(deleteBtn);
    card.appendChild(readBtn);
    card.classList.add('card');
    BOOKLIST.insertBefore(card, ADDING_CARD);
    // add data index to HTML elements and update them  
    updateIndex();
    return true;
  }
  return false;
}

function updateIndex() {
  let book_list = document.querySelector('.book_list').children;
  for (let i = 0; i < book_list.length - 1; i++) {
    book_list[i].setAttribute('data-index', i);
  }
  // console.log(book_list);
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
  e.preventDefault();
  let title = TITLE_TEXT_FIELD[0].value;
  let author = AUTHOR_TEXT_FIELD[0].value;
  let pages = Number(PAGE_NUMBER[0].value);
  let isRead = IS_READ[0].checked ? true : false;
  let book = new Book(title, author, pages, isRead);
  TITLE_TEXT_FIELD[0].value = '';
  AUTHOR_TEXT_FIELD[0].value = '';
  PAGE_NUMBER[0].value = '';
  IS_READ[0].checked = false;
  e.target.parentNode.parentNode.style.display = 'none';
  // console.log(book);
  // console.log(addBookToLibrary(book));

});