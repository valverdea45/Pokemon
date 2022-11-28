// Event Listener #1
document.addEventListener("DOMContentLoaded", () => {
    console.log("Dom has loaded")

    const pokemonContainer = document.querySelector("#Pokemon-collection")
    const dropDownContainer = document.querySelector("#pokemon-dropdown")
    const dropDownElement = document.querySelector("#pokemon-dropdown")
    const form = document.querySelector("#form")

    fetch("http://localhost:3000/Pokemon")
        .then((data) => data.json())
        .then((allPokemon) => {
            console.log("All pokemon have loaded")
            updateCards(allPokemon)
            updateDropDownWindow(allPokemon)
            dropDownFilter(allPokemon)
            //createYourOwn function needs allPokemon so it can update dropdown window with new types
            // once new pokemon are created 
            createYourOwn(allPokemon)
            const newBtn = document.createElement("button")
            newBtn.innerHTML = "Sort By Likes"
            form.appendChild(newBtn)

            newBtn.addEventListener("click", () => {
                updateCards(allPokemon.sort((a, b) => a.likes - b.likes))
            })
        })
    function createNewCard(singlePokemon) {
        const singleCard = document.createElement("div")
        const nameOfPokemonOnCard = document.createElement("h2")
        const likeBtnOnCard = document.createElement("button")
        const imgOnCard = document.createElement("img")
        const likesOnCard = document.createElement("p")
        const typeOnCard = document.createElement("p")
        // const favoriteBtnOnCard = document.createElement("button")

        singleCard.classList.add("card")
        singleCard.appendChild(nameOfPokemonOnCard)
        singleCard.appendChild(likeBtnOnCard)
        singleCard.appendChild(imgOnCard)
        singleCard.appendChild(likesOnCard)
        singleCard.appendChild(typeOnCard)
        // singleCard.appendChild(favoriteBtnOnCard)
        pokemonContainer.appendChild(singleCard)

        typeOnCard.innerHTML = `${singlePokemon.type}`
        nameOfPokemonOnCard.innerHTML = singlePokemon.name
        likesOnCard.innerHTML = `${singlePokemon.likes} like(s)`
        imgOnCard.setAttribute("src", singlePokemon.image)
        imgOnCard.classList.add("pokemon-avatar")
        likeBtnOnCard.classList.add("like-btn")
        likeBtnOnCard.innerHTML = "Give them a like!"
        likeBtnOnCard.addEventListener("click", () => {
            singlePokemon.likes += 1
            likesOnCard.innerHTML = `${singlePokemon.likes} like(s)`
            updateLikes(singlePokemon)
        })

        // if (singlePokemon.favorite === false) {
        //     favoriteBtnOnCard.innerHTML = "Favorite Pokemon"
        // } else {
        //     favoriteBtnOnCard.innerHTML = "This is your favorite!"
        // }

        // favoriteBtnOnCard.addEventListener("click", () => {
        //     if (singlePokemon.favorite === false) {
        //         singlePokemon.favorite = true
        //         favoriteBtnOnCard.innerHTML = "This is your favorite!"
        //         updateFavorite(singlePokemon)
        //     } else {
        //         singlePokemon.favorite = false
        //         favoriteBtnOnCard.innerHTML = "Favorite Pokemon"
        //         updateFavorite(singlePokemon)
        //     }
        // })

    }
    function updateLikes(singlePokemon) {
        fetch(`http://localhost:3000/Pokemon/${singlePokemon.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                "likes": singlePokemon.likes
            })
        })
            .then(data => data.json())
            .then(pokemon => console.log(pokemon))
    }

    // function updateFavorite(singlePokemon) {
    //     fetch(`http://localhost:3000/Pokemon/${singlePokemon.id}`, {
    //         method: "PATCH",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Accept: "application/json"
    //         },
    //         body: JSON.stringify({
    //             "favorite": singlePokemon.favorite
    //         })
    //     })
    //         .then(data => data.json())
    //         .then(pokemon => console.log(pokemon))

    // }

    function createYourOwn(allPokemon) {
        //Event Listener #2
        form.addEventListener("submit", (e) => {
            e.preventDefault()
            const nameInput = document.querySelector("#pokemonName")
            const imgInput = document.querySelector("#pokemonImg")
            const typeInput = document.querySelector("#pokemonType")

            const objToBeSent = {
                name: `${nameInput.value}`,
                image: imgInput.value,
                likes: 0,
                type: typeInput.value,
                favorite: false
            }


            fetch(`http://localhost:3000/Pokemon`, {
                method: `POST`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objToBeSent)
            })
                .then(data => data.json())
                .then(pokemon => {
                    createNewCard(pokemon)
                    const newList = allPokemon.concat(objToBeSent)
                    updateDropDownWindow(newList)
                    dropDownFilter(newList)
                })
            form.reset()
        })
    }
    function removeChildren(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }
    }
    function updateCards(allPokemon) {
        removeChildren(pokemonContainer)
        // array iteration # 2
        allPokemon.forEach(createNewCard)
    }
    function updateDropDownWindow(allPokemon) {
        removeChildren(dropDownContainer)
        const pokemonTypes = allPokemon.map((pokemon) => {
            return pokemon.type
        })
        const typeSet = new Set(pokemonTypes)
        const types = Array.from(typeSet)

        const singleOptionForAllTypes = document.createElement("option")
        singleOptionForAllTypes.innerHTML = `All Types`
        dropDownContainer.appendChild(singleOptionForAllTypes)

        // const singleOptionForAllFavorites = document.createElement("option")
        // singleOptionForAllFavorites.innerHTML = `All Favorites`
        // dropDownContainer.appendChild(singleOptionForAllFavorites)

        types.forEach((singleType) => {
            const singleOptionForAllTypes = document.createElement("option")
            singleOptionForAllTypes.innerHTML = `${singleType}`
            dropDownContainer.appendChild(singleOptionForAllTypes)

        })


    }
    function dropDownFilter(allPokemon) {
        // event listener #3
        dropDownElement.addEventListener("change", (e) => {
            if (e.target.value === "All Types") {
                return updateCards(allPokemon)
            }

            // if (e.target.value === "All Favorites") {
            //     const filteredFavorite = allPokemon.filter((pokemon) => {
            //         return pokemon.favorite === true
            //     })
            //     console.log(filteredFavorite)
            //     updateCards(filteredFavorite)
            // }

            // array iteration method #1

            const filteredTypes = allPokemon.filter((pokemon) => {
                return pokemon.type === e.target.value
            })
            updateCards(filteredTypes)
        })
    }
    // user wants:
    // a button
    // when button is clicked the following happens
    // the create new pokemon form pops up
    // a new button comes up to go back to original btn

    // how to create:
    // add hide class to form
    // create button in java script
    // append button
    // add click event
    // when clicked removes hide class
    // updates dom with the form and new button
    // when new button is clicked either updates with original button
    // or add the hide class back to the form


    // form.classList.add("hide") 
    // const originalBtn = document.createElement("button")
    // originalBtn.innerHTML = "Create your own!!!!"
    // const formContainer = document.querySelector("#form-container")
    // formContainer.appendChild(originalBtn)
    // originalBtn.addEventListener("click", () => {
    //     form.classList.remove("hide")
    //     originalBtn.classList.add("hide")
    // })

    // const newBtn = document.createElement("button")
    // newBtn.innerHTML = "X"

    // form.appendChild(newBtn)

    // newBtn.addEventListener("click", () => {
    //     form.classList.add("hide")
    //     originalBtn.classList.remove("hide")
    // })


    //Live code challange attempt one
    // Failed

    // Prompt: given the HTML bellow take the input from the form 
    //and append it to the dom

    


    const commentInput = document.querySelector("#comment")
    const testForm = document.querySelector("#comment-form")
    testForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const comment = commentInput.value
        const newNode = document.createElement("h3")
        newNode.innerText = comment
        testForm.appendChild(newNode)
    })


})


