
let linkApi = "https://pokeapi.co/api/v2/pokemon/";

const promiseFunc = () => {
    return new Promise((resolve, reject) => {
        const requesT = new XMLHttpRequest();
        requesT.onload = () => {
            if (requesT.status == 200) {
                resolve(requesT.response)
            } else {
                reject(error)
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


const data = async () => {
    try {

        let data = await promiseFunc(linkApi)
        console.log(data);
        console.log(data.results);
        transferJson(data);
    } catch (err) {
        console.log(err);
    }
};






window.addEventListener("load", () => {
  data();
  window.addEventListener("scroll", () => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
      data();
      alert("New Photos") 
    }
  })})












