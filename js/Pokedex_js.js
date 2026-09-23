(() => {
  "use strict";

  let nextPageUrl = "https://pokeapi.co/api/v2/pokemon/";
  let isLoading = false;

  const container = document.querySelector("#container");
  const popup = document.getElementById("popup");

  const fetchJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    return response.json();
  };

  const renderPokemonCard = (pokemon) => {
    const image = document.createElement("img");
    image.src = pokemon.sprites.front_default;

    const name = document.createElement("p");
    name.textContent = pokemon.name;
    name.classList.add("title");

    const card = document.createElement("div");
    card.classList.add("card");
    card.append(image, name);

    container.appendChild(card);
  };

  const renderPage = async (page) => {
    for (const entry of page.results) {
      try {
        const pokemon = await fetchJson(entry.url);
        renderPokemonCard(pokemon);
      } catch (error) {
        console.error(error);
      }
    }
    nextPageUrl = page.next;
  };

  const loadNextPage = async () => {
    if (isLoading) return;
    isLoading = true;

    try {
      const page = await fetchJson(nextPageUrl);
      await renderPage(page);
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  };

  const showNewPhotosPopup = () => {
    popup.style.display = "flex";
  };

  const isNearBottom = () =>
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50;

  loadNextPage();

  document.getElementById("close-button").addEventListener("click", () => {
    popup.style.display = "none";
  });

  window.addEventListener("scroll", () => {
    if (isLoading || !isNearBottom()) return;
    loadNextPage().then(showNewPhotosPopup);
  });
})();
