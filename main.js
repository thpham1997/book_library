// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7uLrS94YJE5_xrKepSKQIm7WzC_m3MZY",
  authDomain: "my-library-6c34f.firebaseapp.com",
  databaseURL: "https://my-library-6c34f-default-rtdb.firebaseio.com",
  projectId: "my-library-6c34f",
  storageBucket: "my-library-6c34f.appspot.com",
  messagingSenderId: "817755436441",
  appId: "1:817755436441:web:9fe35027c4bbb915b04f08",
  measurementId: "G-X7F25TFPRT"
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// let database = firebase.database();
// end of initializing Firebase

class Firebase {
  constructor(config) {
    this.config = config;
    firebase.initializeApp(this.config);
    this.database = firebase.database();
  }

  getdatabse() {
    return this.database;
  }

  writeListToDatabase(library) {
    let bookList = library.getlibrary();
    for (let i = 0; i < bookList.length; i++) {
      this.database.ref('BookList/' + (i)).set({
        title: bookList[i].gettitle(),
        author: bookList[i].getauthor(),
        pages: bookList[i].getpages(),
        read: bookList[i].getread()
      });
    }
  }

  uploadBookToDatabase(book, library) {
    let index = library.getBookCount() - 1;
    this.database.ref('BookList/' + index).set({
      title: book.gettitle(),
      author: book.getauthor(),
      pages: book.getpages(),
      read: book.getread()
    });
  }

  readDatabaseAndVisualze(library) {
    library.reset();
    console.log('before getting data');
    this.getdatabse().ref('BookList').once('value').then((snap) => {
      console.log('get data');
      if (snap.exists()) {
        console.log('getting data');
        let tmpLibrary = snap.val();
        console.log(tmpLibrary);
        if (tmpLibrary.length > 0) (
          tmpLibrary.forEach(b => {
            let tmpBook = new book(b.title, b.author, b.pages, b.read);
            library.addBook(tmpBook);
            // console.log(tmpBook);
          }))
        visualizeBookList(library);
      } else {
        console.log('no data');
      }
    });
    console.log('after geting data');
  }

  deleteAllData() {
    let ref = this.database.ref('BookList').remove().then(function () {
      console.log('remove All data succeeded');
    }).catch(function (error) {
      console.log('remove failed' + error);
    });
  }

  setValueToDatabase(index, name, value) {
    let ref = this.database.ref('BookList/' + index);
    ref.child(name).set(value);
  }
}

class library {
  constructor() {
    this.library = [];
  }

  setlibrary(value) {
    this.library = value;
  }

  getlibrary() {
    return this.library;
  }
  addBook(book) {
    if (!this.library.some(ele => {
      ele.gettitle() === book.gettitle() && ele.getauthor() === book.getauthor() && ele.getpages() === book.getpages();
    })) {
      this.library.push(book);
      return true;
    }
    return false;
  }
  removeBook(index) {
    this.library.splice(index, 1);
  }
  getBookCount() {
    return this.library.length;
  }

  reset() {
    this.library = [];
  }

}

class book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
  gettitle() {
    return this.title;
  }
  getauthor() {
    return this.author;
  }
  getpages() {
    return this.pages;
  }
  getread() {
    return this.read;
  }
  info() {
    return `${this.title} by ${this.author}, ${this.pages} pages`;;
  }
  readInfo() {
    return `${this.read ? 'Read' : 'Not Read'}`;
  }
  isRead() {
    this.read = !this.read;
  }
}



const BOOKLIST = document.querySelector('.book_list');
const ADDING_CARD = document.querySelector('.adding_card');
const FORM = document.querySelector('.form');
const FORM_BTN_CLOSE = document.querySelector('.form__btn--close')
const FORM_BTN_SUBMIT = document.querySelector('.form__btn--submit');
const TITLE_TEXT_FIELD = document.getElementsByName('title');
const AUTHOR_TEXT_FIELD = document.getElementsByName('author');
const PAGE_NUMBER = document.getElementsByName('pages');
const IS_READ = document.getElementsByName('read');
const myLibrary = new library();
const myFirebase = new Firebase(firebaseConfig);


// function addBookToLibrary(book) {
//   if (!myLibrary.some(ele => {
//     ele.title === book.title && ele.author === book.author && ele.pages === book.pages;
//   })) {
//     myLibrary.push(book);
//     return true;
//   }
//   return false;
// }

function makeCard(book) {
  let card = document.createElement('div');
  let p = document.createElement('p');
  let deleteBtn = document.createElement('button');
  let readBtn = document.createElement('button');

  deleteBtn.classList.add('deleteBtn')
  readBtn.classList.add('readBtn');
  deleteBtn.textContent = 'Delete';
  readBtn.textContent = book.readInfo();
  readBtn.style.backgroundColor = book.getread() ? '#52b69a' : '#d4534a';
  readBtn.style.color = book.getread() ? 'black' : 'white';

  readBtn.addEventListener('click', (e) => {
    let index = Number(e.target.parentNode.getAttribute('data-index'));
    myLibrary.getlibrary()[index].isRead();
    myFirebase.setValueToDatabase(index, 'read', myLibrary.getlibrary()[index].getread());
    e.target.textContent = myLibrary.getlibrary()[index].readInfo();
    e.target.style.backgroundColor = myLibrary.getlibrary()[index].getread() ? '#52b69a' : '#d4534a';
    e.target.style.color = book.getread() ? 'black' : 'white';
  });
  deleteBtn.addEventListener('click', (e) => {
    let index = Number(e.target.parentNode.getAttribute('data-index'));
    BOOKLIST.removeChild(e.target.parentNode);
    myLibrary.removeBook(index);
    updateIndex();
    myFirebase.deleteAllData();
    myFirebase.writeListToDatabase(myLibrary);
  });

  p.textContent = book.info();
  p.style.padding = '1rem 1rem';
  card.appendChild(p);
  card.appendChild(deleteBtn);
  card.appendChild(readBtn);
  card.classList.add('card');
  card.setAttribute('data-index', BOOKLIST.children.length - 2)
  BOOKLIST.insertBefore(card, ADDING_CARD);
}

function visualizeBookList(bookList) {
  console.log('making cards');
  let library = myLibrary.getlibrary();
  // make card for each book and visualize them
  for (let i = 0; i < library.length; i++) {
    let book = library[i];
    makeCard(book);
  }
  updateIndex();
}

function updateIndex() {
  let book_list = BOOKLIST.children;
  for (let i = 0; i < book_list.length - 1; i++) {
    book_list[i].setAttribute('data-index', i);
  }
}





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
  let mybook = new book(title, author, pages, isRead);
  TITLE_TEXT_FIELD[0].value = '';
  AUTHOR_TEXT_FIELD[0].value = '';
  PAGE_NUMBER[0].value = '';
  IS_READ[0].checked = false;
  e.target.parentNode.parentNode.style.display = 'none';
  if (myLibrary.addBook(mybook)) {
    console.log('added book');
    myFirebase.uploadBookToDatabase(mybook, myLibrary);
    makeCard(mybook);
  }
  // visualizeBookList(myLibrary);
});

myFirebase.readDatabaseAndVisualze(myLibrary);

// test realtime database

// function writeListToDatabase(bookList) {
//   for (let i = 0; i < bookList.length; i++) {
//     firebase.database().ref('BookList/' + (i)).set({
//       title: bookList[i].title,
//       author: bookList[i].author,
//       pages: bookList[i].pages,
//       read: bookList[i].read
//     });
//   }
// }
// function uploadBookToDatabase(book) {
//   let index = myLibrary.length - 1;
//   firebase.database().ref('BookList/' + index).set({
//     title: book.title,
//     author: book.author,
//     pages: book.pages,
//     read: book.read
//   });
// }

// function readDatabaseAndVisualze() {
//   myLibrary.splice(0, myLibrary.length);
//   console.log('before getting data');
//   database.ref('BookList').once('value').then((snap) => {
//     console.log('get data');
//     if (snap.exists()) {
//       console.log('getting data');
//       let tmpLibrary = snap.val();
//       if (tmpLibrary.length > 0) (
//         tmpLibrary.forEach(book => {
//           let tmpBook = new Book(book.title, book.author, book.pages, book.read);
//           myLibrary.push(tmpBook);
//           // console.log(tmpBook);
//         }))
//       visualizeBookList(myLibrary);
//     } else {
//       console.log('no data');
//     }
//   });
//   console.log('after geting data');
// }
// function deleteAllData() {
//   let ref = database.ref('BookList').remove().then(function () {
//     console.log('remove All data succeeded');
//   }).catch(function (error) {
//     console.log('remove failed' + error);
//   });
// }

// function setValueToDatabase(index, name, value) {
//   let ref = database.ref('BookList/' + index);
//   ref.child(name).set(value);
// }

// readDatabaseAndVisualze();


