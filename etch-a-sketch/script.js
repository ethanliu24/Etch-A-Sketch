/* Variables */
let gridSize = 16;
let allSquares = [];
const SQUARE_INIT_COLOR = "rgba(255, 255, 255, 0)";
const BORDER_INIT_COLOR = "lightgray";
const HEX_MAP = new Map();

const title = document.querySelector(".title");
const gridContainer = document.querySelector("#grid-container");
const colorPicker = document.querySelector("#label-color");
const colorOptBtn = document.querySelector("#color-option");
const opacityOptBtn = document.querySelector("#opacity-option");
const hoverOptBtn = document.querySelector("#hover-option");
const eraseBtn = document.querySelector("#erase-btn");
const clearBtn = document.querySelector("#clear-btn");
const gridVisibilityBtn = document.querySelector("#visibility-option");
const sizeIndicator = document.querySelector("#size-text");
const sizeSlider = document.querySelector(".slider");

let isRainbow = false;
let isTransparent = false;
let isHover = false;
let isClicking = false;
let isErasing = false;
let gridVisible = true;



/* Event Listeners */
addEventListener("DOMContentLoaded", () => {
    initGrid(gridSize);
    sizeIndicator.textContent = `${gridSize} x ${gridSize}`;
    initBtnEventsAll(colorOptBtn, opacityOptBtn, hoverOptBtn, clearBtn, gridVisibilityBtn);
});

colorPicker.addEventListener("input", (e) => {
    sizeSlider.style.accentColor = e.target.value;
    changeTextColor(e.target.value, title);
});

colorOptBtn.addEventListener("click", (e) => {
    if (e.target.textContent === "RAINBOW") {
        e.target.innerHTML = "<i>SINGLE</i>";
        isRainbow = true;
    } else {
        e.target.innerHTML = "<i>RAINBOW</i>";
        isRainbow = false;
    }

    changeTextColor(colorPicker.value, title);
});

opacityOptBtn.addEventListener("click", (e) => {
    if (e.target.textContent === "TRANSPARENT") {
        e.target.innerHTML = "<i>SOLID</i>";
        isTransparent = true;
    } else {
        e.target.innerHTML = "<i>TRANSPARENT</i>";
        isTransparent = false;
    }
});

hoverOptBtn.addEventListener("click", (e) => {
    if (e.target.textContent === "CLICK") {
        e.target.innerHTML = "<i>HOVER</i>";
        isHover = false;
    } else {
        e.target.innerHTML = "<i>CLICK</i>";
        isHover = true;
    }
});

eraseBtn.addEventListener("click", (e) => {
    if (isErasing) {
        isErasing = false;
        eraseBtn.style.boxShadow = "0 0";
        eraseBtn.style.borderColor = "black";
        eraseBtn.style.color = "black";
    } else {
        isErasing = true;
        eraseBtn.style.boxShadow = `4px 4px ${colorPicker.value}AA`;
        eraseBtn.style.borderColor = colorPicker.value;
        eraseBtn.style.color = colorPicker.value;
    }
});

eraseBtn.addEventListener("mouseenter", (e) => {
    if (!isErasing) {
        e.target.style.boxShadow = `4px 4px ${colorPicker.value}AA`;
        e.target.style.borderColor = colorPicker.value;
        e.target.style.color = colorPicker.value;
    }
});

eraseBtn.addEventListener("mouseleave", (e) => {
    if (!isErasing) {
        e.target.style.boxShadow = "0 0";
        e.target.style.borderColor = "black";
        e.target.style.color = "black";
    }
});

clearBtn.addEventListener("click", clearBoard);

gridVisibilityBtn.addEventListener("click", (e) => {
    if (e.target.textContent === "HIDE GRID") {
        e.target.innerHTML = "<i>SHOW GRID</i>";
        gridVisible = false;
    } else {
        e.target.innerHTML = "<i>HIDE GRID</i>";
        gridVisible = true;
    }

    setGridVisibility(gridVisible);
});

sizeSlider.addEventListener("change", (e) => {
    sizeIndicator.textContent = `${e.target.value} x ${e.target.value}`;
    deleteGrid();
    initGrid(e.target.value);
});



/* Functions */
function initGrid(gridSize) {
    for (let i = 0; i < gridSize; i++) {  
        row = document.createElement("div");
        row.setAttribute("class", "row");

        for (let j = 0; j < gridSize; j++) {  
            square = document.createElement("div");
            square.setAttribute("class", "square");
            square.style.backgroundColor = SQUARE_INIT_COLOR;

            square.addEventListener("mouseover", (e) => {
                if (isClicking) handleSquare(false, e);
                else handleSquare(true, e)
            });

            square.addEventListener("mousedown", (e) => {
                isClicking = true;
                handleSquare(false, e);
            });

            square.addEventListener("mouseup", () => {
                isClicking = false;
            })

            row.appendChild(square);
            allSquares.push(square);
        }

        gridContainer.appendChild(row);
    }

    initHexMap();
}


function initBtnEventsAll(...args) {
    for (let arg of args) [
        arg.addEventListener("mouseenter", (e) => {
            e.target.style.boxShadow = `4px 4px ${colorPicker.value}AA`;
            e.target.style.borderColor = colorPicker.value;
            e.target.style.color = colorPicker.value;
        }),

        arg.addEventListener("mouseleave", (e) => {
            e.target.style.boxShadow = "0 0";
            e.target.style.borderColor = "black";
            e.target.style.color = "black";
        }),
    ]
}


function initHexMap() {
    HEX_MAP.set("0", 0);
    HEX_MAP.set("1", 1);
    HEX_MAP.set("2", 2);
    HEX_MAP.set("3", 3);
    HEX_MAP.set("4", 4);
    HEX_MAP.set("5", 5);
    HEX_MAP.set("6", 6);
    HEX_MAP.set("7", 7);
    HEX_MAP.set("8", 8);
    HEX_MAP.set("9", 9);
    HEX_MAP.set("a", 10);
    HEX_MAP.set("b", 11);
    HEX_MAP.set("c", 12);
    HEX_MAP.set("d", 13);
    HEX_MAP.set("e", 14);
    HEX_MAP.set("f", 15);
}


function handleSquare(hovering, e) {
    if ((hovering && isHover) || (!hovering && !isHover)) {
        paintSquare(e.target);
    }
}


function paintSquare(square) {
    if (isErasing) {
        square.style.backgroundColor = SQUARE_INIT_COLOR;
        square.style.borderColor = BORDER_INIT_COLOR;
        return 
    } 

    let color;
    if (!isTransparent) {  // FIX ME overwrite when in single mode
        if (!isRainbow) {  // single
            color = hexToRGB(colorPicker.value) + "1)";
        } else if (square.style.backgroundColor === SQUARE_INIT_COLOR) {  // if unpainted
            color = hexToRGB(generateColor()) + "1)";
        }
    } else {
        if (square.style.backgroundColor === SQUARE_INIT_COLOR) {  // if unpainted
            if (!isRainbow) { color = hexToRGB(colorPicker.value) + "0)"; }  // single
            else { color = hexToRGB(generateColor()) + "0)"; }  // rainbow
        } else {  
            color = square.style.backgroundColor;
        }

        color = addTransparency(color)
    }

    square.style.backgroundColor = color;
    square.style.borderColor = color;
}


function generateColor() {
    hexChars = "0123456789abcdef";
    hexCode = "#";
    for (let i = 0; i < 6; i++) {
        hexCode += hexChars.at(Math.floor(Math.random() * hexChars.length));
    }
    return hexCode;
}


function hexToRGB(color) {
    let values = []
    for (let i = 1; i < 7; i += 2) {
        values.push(HEX_MAP.get(color.at(i+1)) + (HEX_MAP.get(color.at(i)) * 16));
    }
    rgba = `rgba(${values[0]}, ${values[1]}, ${values[2]}, `;  // left out transparency to manually add
    return rgba;
}


function addTransparency(color) {
    if (color.at(3) != "a") { return };  // color stores rgb value instead of rgba
    
    // getting the index of the transparency value
    let transIdx = color.length - 1;
    while (transIdx >= 0 && color.at(transIdx) != " ") { transIdx--; }
    let transparency = Number(color.substring(transIdx + 1, color.length - 1)) + 0.2;
    if (transparency >= 1) { transparency = 1; }
    return color.substring(0, transIdx + 1) + `${transparency})`;    
}


function setGridVisibility(visibile) {
    let borderProperty;
    if (visibile) {
        borderProperty = `${BORDER_INIT_COLOR} solid 1px`;
    } else {
        borderProperty = "0";
    }

    for (let i = 0; i < allSquares.length; i++) {
        allSquares[i].style.border = borderProperty;
    }
}


function clearBoard() {
    for (let i = 0; i < allSquares.length; i++) {
        allSquares[i].style.backgroundColor = SQUARE_INIT_COLOR;
        allSquares[i].style.borderColor = BORDER_INIT_COLOR;
    }
}


function deleteGrid() {
    allSquares = [];
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
}


function changeTextColor(color, target) {
    // rainbow animation perchance? comming soon?
    target.style.color = color
}
