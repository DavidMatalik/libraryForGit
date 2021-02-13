const newBookButton = document.querySelector('#newBook');
const createBookButton = document.querySelector('#createBook');
const bookFormContainer = document.querySelector('#bookFormContainer');
const bookTableContainer = document.querySelector('#bookTableContainer');
const bookTitleInput = document.querySelector('#bookTitle');
const bookAuthorInput = document.querySelector('#bookAuthor');
const bookPagesInput = document.querySelector('#bookPages');
const bookReadInput = document.querySelector('#bookRead');
// const table = document.getElementById('table-data');
const bookContainer = document.getElementById('bookContainer');
const errorDiv = document.querySelector('#errorMessage');
let dbRefObj;

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

newBookButton.addEventListener('click', showBookForm);
createBookButton.addEventListener('click', createNewBook);

function showBookForm() {
  bookFormContainer.style.display = 'block';
  bookTableContainer.style.display = 'none';
}

function createNewBook() {

  if (validateFormInput() === true) {

    let book = new Book(bookTitleInput.value, bookAuthorInput.value, bookPagesInput.value, bookReadInput.value);

    dbRefObj.push(book);

    showBooksOfLibrary();

    bookFormContainer.style.display = 'none';
    bookTableContainer.style.display = 'block';

    resetForm();
  }
}

function validateFormInput() {
  return (bookTitleInput.value === '') ? throwErrorMesage() :
    (bookAuthorInput.value === '') ? throwErrorMesage() :
      (bookPagesInput.value === '') ? throwErrorMesage() : true;

}

function throwErrorMesage() {
  errorDiv.style.display = 'block';
  return false;
}

function showBooksOfLibrary() {

  dbRefObj.on('value', snap => {
    bookContainer.innerHTML = '';
    snap.forEach((book) => {

      /*  let markup = `
       <tr>
           <td>${book.val().title}</td>
           <td>${book.val().author}</td>
           <td>${book.val().pages}</td>
           <td>${(book.val().read === 'true') ? 'Book read' : 'Book not read'}
           <button class='readButton' data-key='${book.key}' onclick='updateReadStatus(this)'>Change</button></td>
           <td><button class='deleteButton' data-key='${book.key}'>Delete</button></td>
       </tr>
       ` */
      let markup = `
            <div class='bookCard'>
                <p><h2>Title:</h2> ${book.val().title}</p>
                <p><h2>Author:</h2> ${book.val().author}</p>
                <p><h2>Pages:</h2> ${book.val().pages}</p>
                <p>
                  <h2>Book read:</h2> 
                  <button class='readButton ${(book.val().read === 'true') ? 'toogleActive' : ''}' 
                  data-key='${book.key}' onclick='updateReadStatus(this)'>Yes</button>
                  <button class='readButton ${(book.val().read === 'false') ? 'toogleActive' : ''}' 
                  data-key='${book.key}' onclick='updateReadStatus(this)'>No</button>
                </p>
                <p class='deleteContainer'><i class='deleteButton fa fa-trash fa-2x' data-key='${book.key}'></i></p>
            </div>
            `

      bookContainer.innerHTML += markup;
    });
    makeDeleteReady();
  });
}

function makeDeleteReady() {
  const deleteButtonList = document.querySelectorAll('.deleteButton');
  deleteButtonList.forEach((element) => {
    element.addEventListener('click', function (event) {

      let keyOfBook = event.target.dataset.key;

      dbRefObj.child(keyOfBook).remove();

      showBooksOfLibrary();
      makeDeleteReady();
    })
  })
}

function updateReadStatus(button) {

  let keyOfBook = button.dataset.key;
  let readElement = button.parentElement;

  dbRefObj.child(keyOfBook).once('value', snap => {

    let readValue = snap.val().read;
    let readPath = `${keyOfBook}/read`;

    if (readValue === 'true') {
      dbRefObj.child(readPath).set('false');
      readElement.innerHTML = `Book not read
            <button class='readButton' data-key='${keyOfBook}' onclick='updateReadStatus(this)'>Change</button>`
    } else if (readValue === 'false') {
      dbRefObj.child(readPath).set('true');
      readElement.innerHTML = `Book read
            <button class='readButton' data-key='${keyOfBook}' onclick='updateReadStatus(this)'>Change</button>`
    }
  });
}

function resetForm() {
  bookTitleInput.value = '';
  bookAuthorInput.value = '';
  bookPagesInput.value = '';
  bookReadInput.value = 'true';
  errorDiv.style.display = 'none';
}

(function () {

  const config = {
    apiKey: "AIzaSyBxO6X6aTrJrYWDuhnZjT0UakROULS9T3M",
    authDomain: "library-project-a404a.firebaseapp.com",
    databaseURL: "https://library-project-a404a.firebaseio.com/",
    storageBucket: "library-project-a404a.appspot.com"
  };

  firebase.initializeApp(config);
  dbRefObj = firebase.database().ref().child('object');
  showBooksOfLibrary()

}());