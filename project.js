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
    function removeChildren(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }
    }
    function updateCards(allPokemon) {
        const pokemonContainer = document.querySelector("#Pokemon-collection")
        removeChildren(pokemonContainer)
        allPokemon.forEach(createNewCard)
    }
})
