
let linkApi = "https://rickandmortyapi.com/api/character";
//Request with promise from the server...// /and Set a Global Variable for Api Link//
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

const transferJson = (data) => {
    let dataObj = JSON.parse(data);
    // console.log(dataObj.results);

    let myContainer = document.querySelector("#container");
    for (let object of dataObj.results) {
        let image = document.createElement('img');
        image.setAttribute('src', object.image)

        let card = document.createElement('div');
        card.classList.add('card');
        let name = document.createElement('p');
        name.innerHTML = object.name;
        card.appendChild(image);
        name.classList.add('title')
        card.appendChild(name);
        myContainer.appendChild(card);
        // let name = document.createElement('p');
        // name.textContent = object.name;
        // myContainer.appendChild(name);
    };
    console.log(dataObj);

    linkApi = dataObj.info.next;
    console.log(linkApi);
};//Prints the photos and gets the info from the linkApi the Global Varibale// 


const data = async () => {
    try {

        let data = await promiseFunc()
        console.log(data);
        console.log(data.results);
        transferJson(data);
    } catch (err) {
        console.log(err);
    }
};// Function that Gets the response from the promiseFunc//




window.addEventListener("load", () => {//Loading the page and turn on the data()function// that takes the Results from the server//
    data();
    window.addEventListener("scroll", () => {
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
            data();
            alert("New Photos")
        }
    })
});









