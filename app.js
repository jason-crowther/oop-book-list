//Book Constructor
function Book(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

//UI Constructor
function UI(){

    //Add Book
    UI.prototype.addBookToList = function(book){
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);

    }

    //Show Alert
    UI.prototype.showAlert = function(message, className){
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.getElementById('book-form');

        container.insertBefore(div, form);

        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }

    //Delete Book
    UI.prototype.deleteBook = function(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    //Clear Fields
    UI.prototype.clearFields = function(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

}

function Store(){

    Store.prototype.getBooks = function(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    Store.prototype.displayBooks = function(){
        const store = new Store();
        const books = store.getBooks();

        books.forEach(function(book){
            const ui = new UI;

            ui.addBookToList(book);
        });
    }

    Store.prototype.addBook = function(book){
        const store = new Store();
        const books = store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    Store.prototype.removeBook = function(isbn){
        const store = new Store();
        const books = store.getBooks();

        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

document.addEventListener('DOMContentLoaded', new Store().displayBooks);

//Form Event Listener
document.getElementById('book-form').addEventListener('submit', function(e){
    
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    const book = new Book(title, author, isbn);
    const ui = new UI();

    //Validate
    if(title === '' || author === '' || isbn === ''){
        ui.showAlert('Please fill in all fields', 'error');
    }else{
        //Add Book
        ui.addBookToList(book);
        const store = new Store();
        store.addBook(book);

        ui.showAlert('Book added!', 'success');
        //Clear inputs
        ui.clearFields();
    }

    e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', function(e){

    const ui = new UI();

    ui.deleteBook(e.target);
    const store = new Store();
    store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    ui.showAlert('Book removed!', 'success');

    e.preventDefault();
});