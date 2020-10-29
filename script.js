const newBookButton = document.querySelector('#newBook');
const createBookButton = document.querySelector('#createBook');
const bookFormContainer = document.querySelector('#bookFormContainer');
const bookTableContainer = document.querySelector('#bookTableContainer');
const bookTitleInput = document.querySelector('#bookTitle');
const bookAuthorInput = document.querySelector('#bookAuthor');
const bookPagesInput = document.querySelector('#bookPages');
const bookReadInput = document.querySelector('#bookRead');
const table = document.getElementById('table-data');
const errorDiv = document.querySelector('#errorMessage');
let dbRefObj;

class Book {
    constructor(title, author, pages, read){
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

newBookButton.addEventListener('click', showBookForm);
createBookButton.addEventListener('click', createNewBook);

function showBookForm(){
    bookFormContainer.style.display = 'block';
    bookTableContainer.style.display = 'none';
}

function createNewBook(){
    
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
    return   (bookTitleInput.value === '') ? throwErrorMesage() : 
             (bookAuthorInput.value === '') ? throwErrorMesage() :
             (bookPagesInput.value === '') ? throwErrorMesage() : true; 

}

function throwErrorMesage() {
    errorDiv.style.display = 'block';
    return false;
}

function showBooksOfLibrary () {

    dbRefObj.on('value', snap => {
        table.innerHTML = '';
        snap.forEach((book) => {
            
            let markup = `
            <tr>
                <td>${book.val().title}</td>
                <td>${book.val().author}</td>
                <td>${book.val().pages}</td>
                <td>${(book.val().read === 'true') ? 'Book read' : 'Book not read'}
                <button class='readButton' data-key='${book.key}' onclick='updateReadStatus(this)'>Change</button></td>
                <td><button class='deleteButton' data-key='${book.key}'>Delete</button></td>
            </tr>
            `
            table.innerHTML += markup;
        });
        makeDeleteReady();
    });
}

function makeDeleteReady() {
    const deleteButtonList = document.querySelectorAll('.deleteButton');
    deleteButtonList.forEach((element) => {
        element.addEventListener('click', function(event){

            let keyOfBook = event.target.dataset.key;
            
            dbRefObj.child(keyOfBook).remove();
            
            showBooksOfLibrary();
            makeDeleteReady();
        })
    })
}

function updateReadStatus(button){

    let keyOfBook = button.dataset.key;
    let readElement = button.parentElement;

    dbRefObj.child(keyOfBook).once('value', snap => {

        let readValue = snap.val().read;
        let readPath = `${keyOfBook}/read`;

        if (readValue === 'true') {
            dbRefObj.child(readPath).set('false');
            readElement.innerHTML = `Book not read
            <button class='readButton' data-key='${keyOfBook}' onclick='updateReadStatus(this)'>Change</button>`
        } else if (readValue === 'false'){
            dbRefObj.child(readPath).set('true');
            readElement.innerHTML = `Book read
            <button class='readButton' data-key='${keyOfBook}' onclick='updateReadStatus(this)'>Change</button>`
        }
    });   
}

function resetForm(){
    bookTitleInput.value = '';
    bookAuthorInput.value = '';
    bookPagesInput.value = '';
    bookReadInput.value = 'true';
    errorDiv.style.display = 'none';
}

(function() {

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