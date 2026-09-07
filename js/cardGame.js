
let myCard = [];
let myBox = document.querySelectorAll(".box");
let Arr = [
  "./images/img-1.png",
  "./images/img-2.png",
  "./images/img-3.png",
  "./images/img-4.png",
  "./images/img-5.png",
  "./images/img-6.png",
  "./images/img-7.png",
  "./images/img-8.png",
];
let i = 0;
let locked = false; // blocks clicks while a mismatched pair is being hidden

let numbersArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
// console.log(numbersArr);

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

shuffle(numbersArr);

for (let item of Arr) {//Take One Image from Arr^^^^//
  myBox[numbersArr[i]].firstElementChild.setAttribute("src", item);//set
  myBox[numbersArr[i + 1]].firstElementChild.setAttribute("src", item);
  i = i + 2;
}
console.log(myBox);

const compareToCard = (card) => {
  myCard.push(card);
  if (myCard.length == 2) {
    locked = true;
    if (
      myCard[0].firstElementChild.getAttribute("src") !=
      myCard[1].firstElementChild.getAttribute("src")
    ) {
      setTimeout(() => {
        myCard[0].firstElementChild.style.display = "none";
        myCard[1].firstElementChild.style.display = "none";
        myCard = [];
        locked = false;
      }, 500);
    } else {
      myCard[0].classList.add("matched");
      myCard[1].classList.add("matched");
      myCard = [];
      locked = false;
    }
  }
};

window.addEventListener("load", () => {
  for (let box of myBox) {
    box.addEventListener("click", () => {
      if (locked) return; // wait for the mismatch animation to finish
      if (box.classList.contains("matched")) return; // already solved
      if (box.firstElementChild.style.display === "block") return; // already flipped
      if (myCard.includes(box)) return; // same card clicked twice

      box.firstElementChild.style.display = "block";
      compareToCard(box);
    });
  }

  document.getElementById('NewGamebtn').addEventListener("click", () => {
    window.location.reload();
  });
});
