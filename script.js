let num1 = "";
let prevOperator = "";
let waitingForNum2 = false;
let equalsPressed = false;
let displayValue = "0";
const displayExpression = document.querySelector("#display > #expression");
const displayValueDiv = document.querySelector("#display > #value");


function operate(operator, a, b) {
    a = Number(a);
    b = Number(b);
    let result;
    switch (operator) {
        case "+":
            result = a + b;
            break;
        case "-":
            result = a - b;
            break;
        case "×":
            result = a * b;
            break;
        case "/":
            result = a / b;
            break;
    }
    result = String(Number(result.toFixed(3)));
    return result;
}

function formatDisplayValue(value) {
    if (value.includes(".")) {
        const [integer, decimal] = value.split(".");
        return `${Number(integer).toLocaleString("en-US")}.${decimal}`;
    }
    return Number(value).toLocaleString("en-US");    
}

function updateDisplay() {
    // console.log("Updating display:", displayValue);
    displayValueDiv.textContent = formatDisplayValue(displayValue);
}

function checkIfDisplayValueHasToReset() {
    if (waitingForNum2) {
        waitingForNum2 = false;
        displayValue = "0";        
    }
    else if (equalsPressed) {
        equalsPressed = false;
        displayValue = "0";  
    }
}

function willANewCharacterFit() {
    return displayValue.length < 13;
}

function inputDigit(digit) {
    // console.log("inputDigit", digit);
    if (!willANewCharacterFit()) return;
    checkIfDisplayValueHasToReset();
    if (displayValue === "0") {
        displayValue = digit;
    }
    else {
        displayValue += digit;
    }
    updateDisplay();
}

function inputDecimalPoint() {
    if (!willANewCharacterFit()) return;
    checkIfDisplayValueHasToReset();
    if (!displayValue.includes(".")) {
        displayValue += ".";
    }
    updateDisplay();
}

function handleOperator(operator) {
    if (!num1) {
        num1 = displayValue;
    }
    else if (num1 && !waitingForNum2) {
        const result = operate(prevOperator, num1, displayValue);
        num1 = result;
        displayValue = result;
        updateDisplay();
    }
    displayExpression.textContent = `${num1} ${operator}`;
    waitingForNum2 = true;
    prevOperator = operator;
    // console.log("handleOperator()");
}

function calculate() {
    console.log("calculate");
    if (num1 && !waitingForNum2) {
        displayExpression.textContent = `${num1} ${prevOperator} ${displayValue} =`;
        const result = operate(prevOperator, num1, displayValue);
        num1 = "";
        displayValue = result;
        updateDisplay();
    }
    equalsPressed = true
}

function backspace() {
    if (displayValue.length === 1) {
        displayValue = "0"
    }
    else {
        displayValue = displayValue.slice(0, -1);
    }
    updateDisplay();
}

function clear() {
    num1 = "";
    prevOperator = "";
    waitingForNum2 = false;
    equalsPressed = false;
    displayValue = "0";
    displayExpression.textContent = "";
    updateDisplay();
}


const digits = "0123456789";
const operators = "+-×/";

function handleKey(key) {
    // console.log("handleKey:", key);
    if (digits.includes(key)) {
        inputDigit(key);
    } else if (key === ".") {
        inputDecimalPoint();
    } else if (operators.includes(key)) {
        handleOperator(key);
    } else if (key === "=" || key === "Enter") {
        calculate();
    } else if (key === "Backspace") {
        backspace();
    } else if (key === "Escape") {
        clear();
    }
}

document.querySelectorAll("button[data-key]").forEach((button) => {
    button.addEventListener("click", () => handleKey(button.dataset.key));
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
    }
    handleKey(e.key);
});