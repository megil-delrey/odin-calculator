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
        case "*":
            result = a * b;
            break;
        case "/":
            if (b === 0) {
                return null;
            }
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
    if (displayValue === null) {
        displayValueDiv.textContent = "Cannot divide by zero";
    } else {
        displayValueDiv.textContent = formatNumber(displayValue);
    }    
}

function resetDisplayValueIfNeeded() {
    if (waitingForSecondOperand) {
        waitingForSecondOperand = false;
        displayValue = "0";        
    }
    else if (equalsPressed) {
        equalsPressed = false;
        displayValue = "0";  
    }
}

function canAddCharacter() {
    return displayValue.length < 13;
}

function inputDigit(digit) {
    resetDisplayValueIfNeeded();
    if (!canAddCharacter()) {
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
    resetDisplayValueIfNeeded();
    if (!canAddCharacter()) {
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
        const result = operate(prevOperator, firstOperand, displayValue);
        if (result !== null) {
            firstOperand = String(result);            
        } else {
            firstOperand = "";
        }
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
        const result = operate(prevOperator, firstOperand, displayValue);
        firstOperand = "";
        displayValue = result !== null ? String(result) : result;        
        updateDisplay();
    }
    equalsPressed = true;
    // console.log("calculate");
}

function backspace() {
    if (displayValue.length === 1) {
        displayValue = "0";
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

function handleDivisionByZero() {
    firstOperand = "";
    prevOperator = "";
    waitingForSecondOperand = false;
    equalsPressed = false;
    displayValue = "0";
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

const keyMap = {
    Enter: document.querySelector("button[data-key='=']")
}

document.querySelectorAll("button[data-key]").forEach((button) => {
    keyMap[button.dataset.key] = button;
    button.addEventListener("click", () => handleKey(button.dataset.key));
});

document.addEventListener("keydown", (e) => {
    // console.log(e.key);
    if (e.key === "Enter" || e.key === "/") {
        e.preventDefault();
    }
    const button = keyMap[e.key];
    if (button) {
        if (e.key === "=" || e.key === "Enter") {
            button.classList.add("equals-button-active");
            console.log("classList.add:", button.classList);
        } else {
            button.classList.add("button-active");
        }
    }
    handleKey(e.key);
});

document.addEventListener("keyup", (e) => {
    const button = keyMap[e.key];
    if (button) {
        if (e.key === "=" || e.key === "Enter") {
            button.classList.remove("equals-button-active");
            console.log("classList.remove:", button.classList);
        } else {
            button.classList.remove("button-active");
        }
    }
    console.log("keyup:", e.key);
});