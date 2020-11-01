// declares the variable for the API URL  
const API_URL = "http://localhost:3000/toys"

// selects the toyCollection div to be used globally
const toyCollection = document.querySelector('#toy-collection')

// code below creates the add a toy button
// and adds an event listener for a click on that button
// when the button is clicked, it displays the add a toy form
// when it is clicked again, it hides the form  
  let addToy = false;

// document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

// DELIVERABLE 1 \\

  // taking a toy object, creating that DOM element and slapping it on the DOM
// A) create the toyCard and prepare it to be displayed in the browser
      // function renderOneToy(toyObj) {}  // function declaration syntax
      // const renderOneToy = toyObj => {} // arrow function expression syntax
  const renderOneToy = toyObj => {
    // step 1. create the outer element using createElement (& assign necessary attributes)
    const toyCard = document.createElement('div')
    toyCard.setAttribute('class', 'card')
    // toyCard.setAttribute('dataset', 'id')

    // step 2. create the inner elements by using innerHTML and createElement (& assign necessary attributes)
    const h2 = document.createElement('h2')
    h2.innerText = toyObj.name

    const img = document.createElement('img')
    img.setAttribute('src', toyObj.image)
    img.setAttribute('class', 'toy-avatar')

    const p = document.createElement('p')
    p.innerText = `${toyObj.likes} Likes`

    const likeBtn =document.createElement('button')
    likeBtn.setAttribute('data-id', toyObj.id)
    likeBtn.setAttribute('class', 'like-btn')
    likeBtn.innerText = "Like ❤️"

    // step 3. add (.append) the innerHTML elements to the outerHTML elements
    toyCard.append(h2, img, p, likeBtn)

    // step 4. slap it on the DOM (toy-collection)
      // selects the toyCollection div
    // const toyCollection = document.querySelector('#toy-collection')
     // add (.append) the toyCard div to the toyCollection div
    toyCollection.append(toyCard)
  }

// B) create a helper method to iterate through the toyArray and renderOneToy
  // step 1. iterate through the toyArray to create a card .for Each toy
  const renderAllToys = toyArray => {
  // step 2. call on the helper method to render each toyCard in the browser
    toyArray.forEach(toyObj => renderOneToy(toyObj))
  }

// C) when the page loads, make a GET /toys request by creating a fetch method and fetching the data
  // inside that fetch method, call on the renderOneToy helper method to display the existing cards in the browser
  fetch(API_URL)
    .then(response => response.json())
    .then(toyArray => {
      renderAllToys(toyArray)
    })

// DELIVERABLE 2 \\

// A) When a user submits the form:
    // find the form on the page
    // listen for a submit event
      // create an addToyForm variable, with a value of the document's add toy form
  const addToyForm = document.querySelector(".add-toy-form")
    // add an event listener for when a user submits the form
  addToyForm.addEventListener("submit", event => {
    // ALWAYS prevent the default action of the form, which would make it look like our page is refreshing
    event.preventDefault()

    // get the user input from the form
    const name = event.target.name.value
    const image = event.target.image.value

    // make fetch request for a POST /toys
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify({
        // convert the JavaScript object into a string using JSON.stringify()
        "name": name,
        "image": image,
        "likes": 0
      }),
    })
    // make page be able to load the new toy without user having to refresh the page
      .then(response => response.json())
      .then(newToy => {
        // when we get the new toy from the server
        // slap it on the DOM
        renderOneToy(newToy)
      // resets the form (clears the input fields)
      event.target.reset()
      })
  })

// Deliverable 3


  // we will use the variable toyCollection that was previously defined
  // add an event listener to hear when a like button is clicked
  toyCollection.addEventListener("click", event => {
    // use a condition to check if the like button was clicked
    // makes it so only the like button being clicked will create a result
    if (event.target.matches(".like-btn")) {
      // finds the parent element of all the like button elements
      const likesPTag = event.target.closest(".card").querySelector("p")
      // grabs the textContent of the p tag, and parses the string into a number--giving us the number of likes
      const likeCount = parseInt(likesPTag.textContent)
      // increases the likeCount by 1
      const newLikes = likeCount + 1
      // gives us access to the id of the toyCard that the user clicked
      const id = event.target.dataset.id
      
     // make a PATCH request for /toys/:id
      fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({
          // convert the JavaScript object into a string using JSON.stringify()
          // send the number of likes
          likes: newLikes
        }),
      })
      // update the number of likes on the DOM
      // the approach below gives us the updated number back from the server instead of whatever was in the DOM
      // pessimistic approach:
      // wait for the response, parse the response
      .then(response => response.json())
      // update the data on the page
      .then(updatedToy => {
        console.log(updatedToy)
        // using updatedToy as our single source of truth (SSOT)
        likesPTag.textContent = `${updatedToy.likes} Likes`
      })

      // update the number of likes on the DOM
      // the approach below will update the page regardless of server status
      // optimistic approach:
      // likesPTag.textContent = `${newLikes} Likes`

    }
  }) 

// }); 

// you only really need to use pessimistic approach when you are creating something, 
// because when you create something that is assigned an id, you don't have access to that on the front end
// when you are updating or deleting something,
// you already have the information you need





