document.addEventListener("DOMContentLoaded", () => {
    console.log("Dom has loaded")

    fetch("http://localhost:3000/Pokemon")
        .then((data) => data.json())
        .then((allPokemon) => {
            console.log("All pokemon have loaded")
            updateCards(allPokemon)
            dropDown(allPokemon)
            createYourOwn(allPokemon)
        })
})
