let elmsArr = [];

const createElm = (
  tagName,
  content,
  color,
  width,
  height,
  size,
  backgroundColor,
  border,
  padding,
  margin,
  borderRadius,
  boxShadow,
  id,
) => {
  let pageDiv = document.getElementById("pageDiv");
  let newElm = document.createElement(tagName); // create new elm
  pageDiv.appendChild(newElm); // add new elm to html
  newElm.innerText = content; // set content to elm
  newElm.style.color = color; // set color
  newElm.style.width = width + "px"; // set width and add px
  newElm.style.height = height + "px"; // set height and add px
  newElm.style.fontSize = size + "rem"; // set font size and add rem
  newElm.style.backgroundColor = backgroundColor;
  newElm.style.border = border;
  newElm.style.padding = padding + "px";
  newElm.style.margin = margin + "px";
  newElm.style.borderRadius = borderRadius + "%";
  newElm.style.boxShadow = boxShadow;
  newElm.id = id;

  // elmsArr.push({
  //   tagName: tagName,
  //   content: content,
  //   color: color,
  //   width: width,
  //   height: height,
  //   size: size,
  // border: border,
  // }); // save in array the new tag
  elmsArr.push({
    tagName,
    content,
    color,
    width,
    height,
    size,
    backgroundColor,
    border,
    padding,
    margin,
    borderRadius,
    boxShadow,
    id,
  }); // save in array the new tag

  // Update the creationInfo //
  const creationInfo = document.getElementById("creationInfo");
  creationInfo.innerText = `Created ${tagName} element with content: "${content}"`;

  console.log("elmsArr", elmsArr);
};

///End Create//


const clearPage = () => {
  let pageDiv = document.querySelector("#pageDiv");
  pageDiv.innerHTML = ""; // remove all tags
  // localStorage.clear();
};

const GetDataFromStorage = () => {
  elmsArr = []; // clear the array
  let newElmsArr = []; // clear the array
  let jsonString = localStorage.getItem("tags"); //This line retrieves a JSON string stored in the localStorage under the key "tags" and stores it in the variable jsonStr. This string likely contains data you want to work with.//
  console.log("jsonStr", jsonString);
  newElmsArr = JSON.parse(jsonString); //convert from json to array
  console.log("newElmsArr", newElmsArr);
  for (let item of newElmsArr) {

    createElm(
      item.tagName,
      item.content,
      item.color,
      item.width,
      item.height,
      item.size,
      item.backgroundColor,
      item.border,
      item.padding,
      item.margin,
      item.borderRadius,
      item.boxShadow,
      item.id,
    );
  };
};

window.addEventListener("load", () => {
  elmsArr = [];
  document.getElementById("form1").addEventListener("submit", (e) => {
    //happends when we put btn in form
    e.preventDefault(); //stop refresh
  });
  document.getElementById("submitBtn").addEventListener("click", () => {
    let inputTag = document.getElementById("inputTag"); // get elm from html
    let inputContent = document.getElementById("inputContent"); // get elm from html
    let inputColor = document.getElementById("inputColor"); // get elm from html
    let inputWidth = document.getElementById("inputWidth"); // get elm from html
    let inputHeight = document.getElementById("inputHeight"); // get elm from html
    let inputSize = document.getElementById("inputSize"); // get elm from html
    let inputBackground = document.getElementById("inputBackground"); // get elm from html
    let inputBorder = document.getElementById("inputBorder"); // get elm from html
    let inputPadding = document.getElementById("inputPadding");
    let inputMargin = document.getElementById("inputMargin");
    let inputBorderadius = document.getElementById("inputBorderadius");
    let inputShadow = document.getElementById("inputShadow");
    let inputId = document.getElementById("inputId");
    createElm(
      inputTag.value,
      inputContent.value,
      inputColor.value,
      inputWidth.value,
      inputHeight.value,
      inputSize.value,
      inputBackground.value,
      inputBorder.value,
      inputPadding.value,
      inputMargin.value,
      inputBorderadius.value,
      inputShadow.value,
      inputId.value,

    ); //execute the function and passing values from inputs
    //createElm("h1", "test")
  });
  document.getElementById("saveBtn").addEventListener("click", () => {
    let jsonString = JSON.stringify(elmsArr); // convert array to string (json)
    //why we need to convert? to save it in localStorage
    //localStorage can save only strings//
    localStorage.setItem("tags", jsonString); //save to localStorage
  });
  document.getElementById("clearBtn").addEventListener("click", () => {
    clearPage();
    localStorage.setItem("tags", "");
  });
  GetDataFromStorage();
});

















