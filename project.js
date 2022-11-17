document.addEventListener("DOMContentLoaded", () => {
    console.log("Dom has loaded")

    const pokemonContainer = document.querySelector("#Pokemon-collection")
    const dropDownContainer = document.querySelector("#pokemon-dropdown")
    const dropDownElement = document.querySelector("#pokemon-dropdown")

    fetch("http://localhost:3000/Pokemon")
        .then((data) => data.json())
        .then((allPokemon) => {
            console.log("All pokemon have loaded")
            updateCards(allPokemon)
            updateDropDownWindow(allPokemon)
            dropDown(allPokemon)
            createYourOwn(allPokemon)
        })
    function createNewCard(singlePokemon) {
        const singleCard = document.createElement("div")
        const nameOfPokemonOnCard = document.createElement("h2")
        const btnOnCard = document.createElement("button")
        const imgOnCard = document.createElement("img")
        const likesOnCard = document.createElement("p")
        const typeOnCard = document.createElement("p")

        singleCard.classList.add("card")
        singleCard.appendChild(nameOfPokemonOnCard)
        singleCard.appendChild(btnOnCard)
        singleCard.appendChild(imgOnCard)
        singleCard.appendChild(likesOnCard)
        singleCard.appendChild(typeOnCard)

        pokemonContainer.appendChild(singleCard)
        typeOnCard.innerHTML = `${singlePokemon.type}`
        nameOfPokemonOnCard.innerHTML = singlePokemon.name
        likesOnCard.innerHTML = `${singlePokemon.likes} like(s)`
        imgOnCard.setAttribute("src", singlePokemon.image)
        imgOnCard.classList.add("pokemon-avatar")
        btnOnCard.classList.add("like-btn")
        btnOnCard.setAttribute("id", singlePokemon.id)
        btnOnCard.innerHTML = "Give them a like!"
        btnOnCard.addEventListener("click", () => {
            singlePokemon.likes += 1
            likesOnCard.innerHTML = `${singlePokemon.likes} like(s)`
            updateLikes(singlePokemon)
        })
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
    function createYourOwn(allPokemon) {
        const formInput = document.querySelector("#form")
        formInput.addEventListener("submit", (e) => {
            e.preventDefault()
            const nameInput = document.querySelector("#pokemonName")
            const imgInput = document.querySelector("#pokemonImg")
            const typeInput = document.querySelector("#pokemonType")
         
            const objToBeSent = {
                name: `${nameInput.value}`,
                image: imgInput.value,
                likes: 0,
                type: typeInput.value
            }   
            const newList = allPokemon.concat(objToBeSent)
            updateDropDownWindow(newList)

            dropDown(newList)
            
            fetch(`http://localhost:3000/Pokemon`, {
                method: `POST`,
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(objToBeSent)
            })
                .then(data => data.json())
                .then(pokemon => createNewCard(pokemon))
        })
    }
    function removeChildren(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }
    }
    function updateCards(allPokemon) {
        removeChildren(pokemonContainer)
        allPokemon.forEach(createNewCard)
    }
    function updateDropDownWindow(allPokemon) {
        removeChildren(dropDownContainer)
        const pokemonTypes = allPokemon.map((pokemon) => {
            return pokemon.type
        })
        const typeSet = new Set(pokemonTypes)
        const types = Array.from(typeSet)

        const singleOption = document.createElement("option")
        singleOption.innerHTML = `All Types`
        dropDownContainer.appendChild(singleOption)

        types.forEach((singleType) => {
            const singleOption = document.createElement("option")
            singleOption.innerHTML = `${singleType}`
            dropDownContainer.appendChild(singleOption)

        })


    }
    function dropDown(allPokemon) {
        dropDownElement.addEventListener("change", (e) => {
            if (e.target.value === "All Types") {
               return updateCards(allPokemon)
            }
            const filteredTypes = allPokemon.filter((pokemon) => {
                return pokemon.type === e.target.value
            })
            updateCards(filteredTypes)
        })
    }
})
