let firstOperand = "";
let prevOperator = "";
let waitingForSecondOperand = false;
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
    result = Number(result.toFixed(3));
    return result;
}

function formatNumber(number) {
    if (number.includes(".")) {
        const [integerDigits, decimalDigits] = number.split(".");
        return `${Number(integerDigits).toLocaleString("en-US")}.${decimalDigits}`;
    }
    return Number(number).toLocaleString("en-US");    
}

function updateDisplay() {
    // console.log("Updating display:", displayValue);
    displayValueDiv.textContent = formatNumber(displayValue);
}

function checkIfDisplayValueHasToReset() {
    if (waitingForSecondOperand) {
        waitingForSecondOperand = false;
        displayValue = "0";        
    }
    else if (equalsPressed) {
        equalsPressed = false;
        displayValue = "0";  
    }
}

function willANewCharFit() {
    return displayValue.length < 13;
}

function inputDigit(digit) {
    checkIfDisplayValueHasToReset();
    if (!willANewCharFit()) {
        return;
    }
    if (displayValue === "0") {
        displayValue = digit;
    }
    else {
        displayValue += digit;
    }
    updateDisplay();
    // console.log("inputDigit: ", digit);
}

function inputDecimalPoint() {
    checkIfDisplayValueHasToReset();
    if (!willANewCharFit()) {
        return;
    }
    if (!displayValue.includes(".")) {
        displayValue += ".";
    }
    updateDisplay();
}

function handleOperator(operator) {
    if (!firstOperand) {
        firstOperand = displayValue;
    }
    else if (firstOperand && !waitingForSecondOperand) {
        const result = String(operate(prevOperator, firstOperand, displayValue));
        firstOperand = result;
        displayValue = result;
        updateDisplay();
    }
    displayExpression.textContent = `${formatNumber(firstOperand)} ${operator}`;
    waitingForSecondOperand = true;
    prevOperator = operator;
    // console.log("handleOperator");
}

function calculate() {
    if (firstOperand && !waitingForSecondOperand) {
        displayExpression.textContent = `${formatNumber(firstOperand)} ${prevOperator} ${formatNumber(displayValue)} =`;
        const result = String(operate(prevOperator, firstOperand, displayValue));
        firstOperand = "";
        displayValue = result;
        updateDisplay();
    }
    equalsPressed = true
    // console.log("calculate");
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
    firstOperand = "";
    prevOperator = "";
    waitingForSecondOperand = false;
    equalsPressed = false;
    displayValue = "0";
    displayExpression.textContent = "";
    updateDisplay();
}


const digits = "0123456789";
const operators = "+-*/";

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
    // console.log(e.key);
    // if (e.key === "Enter" || e.key === "/") {
    //     e.preventDefault();
    // }
    // handleKey(e.key);
    if (e.key === "1") {
        document.querySelector("button[data-key='1']").click();
    }
});