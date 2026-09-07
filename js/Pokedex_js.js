
let linkApi = "https://pokeapi.co/api/v2/pokemon/";

const promiseFunc = () => {
    return new Promise((resolve, reject) => {
        const requesT = new XMLHttpRequest();
        requesT.onload = () => {
            if (requesT.status == 200) {
                resolve(requesT.response)
            } else {
                reject(new Error(`Request failed with status: ${requesT.status}`))
            }
        };
        requesT.open('GET', linkApi);
        requesT.send();
    });
};
const fetchPokemonDetails = (url) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.onload = () => {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject(new Error(`Request failed with status: ${request.status}`));
      }
    };
    request.open("GET", url);
    request.send();
  });
};


const transferJson = async (data) => {
  let dataObj = JSON.parse(data);

  let myContainer = document.querySelector("#container");
  for (let object of dataObj.results) {
    try {
      const pokemonData = await fetchPokemonDetails(object.url); // Fetch each Pokémon's details
      const pokemonObj = JSON.parse(pokemonData);

      let image = document.createElement("img");
      image.setAttribute("src", pokemonObj.sprites.front_default);

      let card = document.createElement("div");
      card.classList.add("card");
      let name = document.createElement("p");
      name.innerHTML = pokemonObj.name;
      card.appendChild(image);
      name.classList.add("title");
      card.appendChild(name);
      myContainer.appendChild(card);
    } catch (error) {
      console.error(error);
    }
  }

  linkApi = dataObj.next;
};
//Prints the photos and gets the info from the linkApi the Global Varibale// 


let isLoading = false;

const data = async () => {
    if (isLoading) return;
    isLoading = true;
    try {

        let data = await promiseFunc(linkApi)
        console.log(data);
        console.log(data.results);
        await transferJson(data);
    } catch (err) {
        console.log(err);
    } finally {
        isLoading = false;
    }
};

const showNewPhotosPopup = () => {
    const popup = document.getElementById("popup");
    popup.style.display = "flex";
};



window.addEventListener("load", () => {
  data();

  document.getElementById("close-button").addEventListener("click", () => {
    document.getElementById("popup").style.display = "none";
  });

  window.addEventListener("scroll", () => {
    if (isLoading) return;
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50) {
      data().then(showNewPhotosPopup);
    }
  });
});












