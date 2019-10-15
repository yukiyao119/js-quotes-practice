/* Populate page with quotes */
const quoteListUL = document.querySelector("#quote-list")
let newForm = document.querySelector("#new-quote-form")

fetch("http://localhost:3000/quotes?_embed=likes")
.then(res => res.json())
.then(quotesArrJSON => {
    quotesArrJSON.forEach(quoteObj => {
        displayOneQuote(quoteObj)
    });
})

function displayOneQuote(quoteObj) {
    // debugger
    quoteListUL.innerHTML += `
    <li class='quote-card' id="data-${quoteObj.id}">
        <blockquote class="blockquote">
            <p class="mb-0">${quoteObj.quote}</p>
            <footer class="blockquote-footer">${quoteObj.author}</footer>
            <br>
            <button class='btn-success' data-id="${quoteObj.id}">Likes: <span>${quoteObj.likes.length}</span></button>
            <button class='btn-danger' data-id="${quoteObj.id}">Delete</button>
            <button class='btn-update' data-id="${quoteObj.id}">Edit</button>
        </blockquote>
    </li>`
}

quoteListUL.addEventListener("click", (evt) => {
    let id = evt.target.dataset.id
    let quoteCardLI = evt.target.parentElement.parentElement
    // let quoteCardLI = document.querySelector(`#data-${id}`)

    /* delete the respective quote */
    if (evt.target.tagName === "BUTTON" && evt.target.className === "btn-danger"){
        fetch(`http://localhost:3000/quotes/${id}`,{
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(deletedQuote => {
            quoteCardLI.remove()
        })
    }

    /* create a like update the number */
    else if(evt.target.tagName === "BUTTON" && evt.target.className === "btn-success"){
        let quoteIdInteger = parseInt(id)
        let newLikeCount = parseInt(evt.target.firstElementChild.innerText) + 1
        let ts = Math.round((new Date()).getTime() / 1000);

        fetch("http://localhost:3000/likes", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
            quoteId: quoteIdInteger,
            createdAt: ts
            })
        })
        .then(res => res.json())
        .then(createdLike => {
            evt.target.firstElementChild.innerText = newLikeCount
            // debugger
        })
    }
    
})

/* Submitting the form creates a new quote and adds it to the list of quotes */
newForm.addEventListener("submit", handleCreate)
function handleCreate(evt) {
    evt.preventDefault();
    let newQuote = newForm.querySelector('#new-quote').value
    let newAuthor = newForm["author"].value
    
    fetch("http://localhost:3000/quotes", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor
        })
    })
    .then(res => res.json())
    .then(createdQuote => {
        createdQuote.likes = []
        displayOneQuote(createdQuote)
    })
}

/* edit button toggle form */
quoteListUL.addEventListener('toggle', (evt) => {
    // let quoteCardLI = evt.target.parentElement.parentElement
    // let blockquote = evt.target.parentElement

    // if (evt.target.tagName === "BUTTON" && evt.target.className === "btn-update"){
    //     blockquote.innerHTML = `
    //     <form id="edit-quote-form">
    //         <label for="edit-quote">Edit Quote</label>
    //         <input type="text" class="form-control" id="edit-quote">
    //         <label for="Author">Edit Author</label>
    //         <input type="text" class="form-control" id="edit-author">
    //         <button type="submit" class="btn btn-primary">Submit</button>
    //     </form>
    //     `
    // }    
})

// const item = document.querySelector(`[data-id=${e.target.id}]`);
// item.toggleAttribute('hidden');

// function logItem(e) {
//     const item = document.querySelector(`[data-id=${e.target.id}]`);
//     item.toggleAttribute('hidden');
//   }
// const chapters = document.querySelectorAll('details');
// (chapter) => {
//     chapter.addEventListener('toggle', logItem);
//   }