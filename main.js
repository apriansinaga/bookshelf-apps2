const books = []

const RENDER_EVENT = 'render-book'

const SAVED_EVENT = 'saved-book'

const STORAGE_KEY = 'BOOK_SHELF'

const removeButton = document.getElementById('remove')

const undoModal = document.getElementById('undo')

const modal = document.querySelector('.modal')

document.addEventListener('DOMContentLoaded', function () {

    const submitForm = document.getElementById('inputBook')

    submitForm.addEventListener('submit', function (event) {

      event.preventDefault()

        //modal.classList.remove("modal-open")

      addBook()

    })

    if (isStorageExist()){ 

      loadDataFromStorage()

    }

  })

function addBook(){

    const titleBook = document.getElementById('inputBookTitle').value 

    const author = document.getElementById('inputBookAuthor').value

    const year = parseInt(document.getElementById('inputBookYear').value)

    const done = document.getElementById('inputBookIsComplete').checked

    const incompleteList = document.getElementById('incompleteBookshelfList')

    const completeList = document.getElementById('completeBookshelfList')

    const generatedID =generateId()

    const bookObject = generateBookObject(generatedID, titleBook, author, year, done)

    const book = newBook (bookObject)

    books.push(bookObject)

    document.dispatchEvent(new Event(RENDER_EVENT))

    if (!done){

        incompleteList.append(book)

    }

    else{

        completeList.append(book)

    }

        

    saveData()

}

function generateId() {

    return +new Date()

  }

   

function generateBookObject(id ,titleBook, author, year, done) {

    return {

      id,

      titleBook,

      author,

      year: parseInt(year),

      done

    }

  }

document.addEventListener(RENDER_EVENT, function () {

    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList')

    incompleteBookshelfList.innerHTML = ''

    const completeBookshelfList = document.getElementById('completeBookshelfList')

    completeBookshelfList.innerHTML = ''

 

for (const bookItem of books) {

    const bookElement = newBook(bookItem)

    if (!bookItem.isComplete)

        incompleteBookshelfList.append(bookElement)

    else

        completeBookshelfList.append(bookElement)

    

  }

  // console.log(books)

  // booksLength()

})

  

function newBook(bookObject) {

    const bookTitle = document.createElement('h2')

    bookTitle.innerText = bookObject.titleBook

    bookTitle.classList.add('pindah')

   

    const author = document.createElement('p')

    author.innerText = "Nama Penulis: " + bookObject.author

    const year = document.createElement('p')

    year.innerText = "Tahun: " + bookObject.year

   

    const bookItem = document.createElement('article')

    bookItem.classList.add('bookItem')

    bookItem.appendChild(bookTitle)

    bookItem.appendChild(author)

    bookItem.appendChild(year)

   

    const bookList = document.createElement('div')

    bookList.classList.add('bookListItem')

    bookList.appendChild(bookItem)

    bookList.setAttribute('id', `book-${bookObject.id}`)

   

    if (bookObject.isComplete) {

        const trashButton = document.createElement('button')

        trashButton.innerText='Hapus'

        trashButton.classList.add('red')

     

        trashButton.addEventListener('click', function () {

          modal.classList.toggle("modal-open")
          removeBookItem(bookObject.id)

          //dialogRemove(bookObject)

        })

     

        const moveButton = document.createElement('button')

        moveButton.innerText='Belum Selesai'

        moveButton.classList.add('button','green')

     

        moveButton.addEventListener('click', function () {

          moveBookFromCompleted(bookObject.id)

        })

     

        bookList.appendChild(moveButton)

        bookList.appendChild(trashButton)

      } else {

        const trashButton = document.createElement('button')

        trashButton.innerText='Hapus'

        trashButton.classList.add('button','red')

        

        trashButton.addEventListener('click', function () {

          modal.classList.toggle("modal-open")
          removeBookItem(bookObject.id)

          //dialogRemove(bookObject)

        })

        const moveButtonUncompleted = document.createElement('button')

        moveButtonUncompleted.innerText='Selesai'

        moveButtonUncompleted.classList.add('button','green')

        moveButtonUncompleted.addEventListener('click', function(){

            moveBookFromUnCompleted(bookObject.id)

        })

        
        
        bookList.appendChild(trashButton)

        bookList.appendChild(moveButtonUncompleted)

      }

    return bookList

  }

  function dialogRemove(bookObject){

    modal.classList.toggle("modal-open")

    removeButton.addEventListener("click", () =>{

        removeBookItem(bookObject.id)

        modal.classList.remove("modal-open")

    })

    undoModal.addEventListener("click", ()=>{

      modal.style.transition = '1s'

      modal.classList.remove("modal-open")

    })

  }

  function removeBookItem(bookId){

    const bookTargetIndex = findBookIndex(bookId)

    if(bookTargetIndex=== -1)return

    books.splice(bookTargetIndex, 1)

    document.dispatchEvent(new Event(RENDER_EVENT))

    saveData()

  }

  function moveBookFromCompleted(bookId){

    const bookTarget = findBook(bookId);

 

    if(bookTarget == null) return;

 

    bookTarget.isComplete = false;

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();

}

function moveBookFromUnCompleted(bookId){

  const bookTarget = findBook(bookId);

  if(bookTarget == null) return;

  bookTarget.isComplete = true;

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();

}



function findBookIndex(bookId) {

  for (let index = 0 ; books.length; index++) {

      if (books[index].id === bookId) {

          return index;

      }

  } 

  return -1;

}

  function findBook(bookId){

    for(const book of books){

        if (book.id === bookId){

            return book}

    }

    return null

  }

  function findBook(bookId) {

    for (const bookItem of books) {

        if (bookItem.id === bookId) {

            return bookItem;

        }

    }

    return null;

}

 

const booksLength = () => {

    const totalBuku = document.getElementById('totalBuku');

    totalBuku.innerText = books.length;

  }

 

document.getElementById('searchSubmit').addEventListener("click", function (event){

    event.preventDefault();

    const searchBook = document.getElementById('searchByTitle').value.toLowerCase();

    const bookList = document.querySelectorAll('.bookItem > h3');

        for (const buku of bookList) {

            if (buku.innerText.toLowerCase().includes(searchBook)) {

                buku.parentElement.parentElement.style.display = "block";

              }

            else if (searchBook !== buku.innerText.toLowerCase()) {

                buku.parentElement.parentElement.style.display = "none";

            } else {

                buku.parentElement.parentElement.style.display = "block";

            }

        }

});

 

 

function ubahText(){

    const checkbox = document.getElementById("isCompleted");

    const textButton = document.getElementById("textButton");

 

    if(checkbox.checked == true) {

        textButton.innerText = "Sudah selesai";

    }else{

        textButton.innerText = "Belum selesai";

    }

};

  function saveData(){

    if(isStorageExist()){

      const parsed = JSON.stringify(books)

      localStorage.setItem(STORAGE_KEY, parsed)

      document.dispatchEvent(new Event(SAVED_EVENT))

    }

  }

  function isStorageExist()  {

    if (typeof (Storage) === undefined) {

      alert('Browser anda tidak mendukung local storage')

      return false

    }

    return true

  }

  document.addEventListener(SAVED_EVENT, function(){

    console.log(localStorage.getItem(STORAGE_KEY))

  } )

  function loadDataFromStorage() {

    const localData = localStorage.getItem(STORAGE_KEY)

    let data = JSON.parse(localData)

   

    if (data !== null) {

      for (const book of data) {

        books.push(book)

      }

    }

   

    document.dispatchEvent(new Event(RENDER_EVENT))

  }