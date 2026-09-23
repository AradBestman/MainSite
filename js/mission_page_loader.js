(() => {
  "use strict";

  const FIELD_MAP = {
    inputTag: "tagName",
    inputContent: "content",
    inputColor: "color",
    inputWidth: "width",
    inputHeight: "height",
    inputSize: "size",
    inputBackground: "backgroundColor",
    inputBorder: "border",
    inputPadding: "padding",
    inputMargin: "margin",
    inputBorderadius: "borderRadius",
    inputShadow: "boxShadow",
    inputId: "id",
  };

  let elements = [];

  const pageDiv = document.getElementById("pageDiv");
  const creationInfo = document.getElementById("creationInfo");

  const createElm = ({
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
  }) => {
    const newElm = document.createElement(tagName);
    newElm.innerText = content;
    newElm.id = id;
    Object.assign(newElm.style, {
      color,
      width: `${width}px`,
      height: `${height}px`,
      fontSize: `${size}rem`,
      backgroundColor,
      border,
      padding: `${padding}px`,
      margin: `${margin}px`,
      borderRadius: `${borderRadius}%`,
      boxShadow,
    });

    pageDiv.appendChild(newElm);
    elements.push({
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
    });

    creationInfo.innerText = `Created ${tagName} element with content: "${content}"`;
  };

  const clearPage = () => {
    pageDiv.innerHTML = "";
  };

  const readFormValues = () =>
    Object.fromEntries(
      Object.entries(FIELD_MAP).map(([id, key]) => [key, document.getElementById(id).value])
    );

  const loadSavedElements = () => {
    elements = [];
    const jsonString = localStorage.getItem("tags");
    if (!jsonString) return;

    let saved;
    try {
      saved = JSON.parse(jsonString);
    } catch (err) {
      console.error("Could not parse saved tags", err);
      return;
    }

    (saved || []).forEach(createElm);
  };

  document.getElementById("form1").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  document.getElementById("submitBtn").addEventListener("click", () => {
    createElm(readFormValues());
  });

  document.getElementById("saveBtn").addEventListener("click", () => {
    localStorage.setItem("tags", JSON.stringify(elements));
  });

  document.getElementById("clearBtn").addEventListener("click", () => {
    clearPage();
    elements = [];
    localStorage.setItem("tags", JSON.stringify([]));
  });

  loadSavedElements();
})();
