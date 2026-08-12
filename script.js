const expressionDiv = document.querySelector(".expression");
const valueDiv = document.querySelector(".value");
const digitButtons = document.querySelectorAll(".digit");
const decimalPointButton = document.querySelector(".decimal-point");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector(".equals");
const clearButton = document.querySelector(".clear");
const backspaceButton = document.querySelector(".backspace");

let firstNumber = "";
let operator = "";
let secondNumber = "";
let shouldResetDisplayValue = false;
let dividedByZero = false;


// ----------------
// Helper functions
// ----------------

function formatNumber(number) {
    number = String(number);
    if (number.includes(".")) {
        const [whole, decimal] = number.split(".");
        return `${Number(whole).toLocaleString("en-US")}.${decimal}`;
    }
    return Number(number).toLocaleString("en-US");    
}

function getDisplayValue() {
    return valueDiv.textContent;
}

function updateDisplayValue(value) {
    // if (displayValue === null) {
    //     displayValueDiv.textContent = "Cannot divide by zero";
    // } else {
    //     displayValueDiv.textContent = formatNumber(displayValue);
    // }
    valueDiv.textContent = value;
}

function canAddCharacter() {
    return getDisplayValue().length < 13;
}

function checkBeforeInputting() {
    if (dividedByZero) {
        expressionDiv.textContent = "";
        enableButtons();
        dividedByZero = false;
    }
    if (shouldResetDisplayValue) {
        updateDisplayValue("0");
        shouldResetDisplayValue = false;
    }
    // I put this after the above condition because the division by zero message
    // exceeds the 13 character limit and this won't allow inputting a digit without
    // resetting the display value first
    if (!canAddCharacter()) {
        return;
    }
}

function handleDivisionByZero() {
    updateDisplayValue("Cannot divide by zero");
    firstNumber = "";
    operator = "";
    secondNumber = "";
    operatorButtons.forEach(button => button.disabled = true);
    equalsButton.disabled = true;
    backspaceButton.disabled = true;
}

function enableButtons() {
    operatorButtons.forEach(button => button.disabled = false);
    equalsButton.disabled = false;
    backspaceButton.disabled = false;
}

// --------------
// Main functions
// --------------

function operate(operator, a, b) {
    a = Number(a);
    b = Number(b);
    let result;
    switch (operator) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "×":
            return a * b;
        case "÷":
            if (b === 0) {
                dividedByZero = true;
                return null;
            }
            return a / b;
    }
}

function inputDigit(digit) {
    if (dividedByZero) {
        expressionDiv.textContent = "";
        enableButtons();
        dividedByZero = false;
    }
    if (shouldResetDisplayValue) {
        updateDisplayValue("0");
        shouldResetDisplayValue = false;
    }
    // I put this after the above condition because the division by zero message
    // exceeds the 13 character limit and this won't allow inputting a digit without
    // resetting the display value first
    if (!canAddCharacter()) {
        return;
    }
    if (getDisplayValue() === "0") {
        updateDisplayValue(digit);
    }
    else {
        updateDisplayValue(getDisplayValue() + digit);
    }
    // console.log("inputDigit: ", digit);
}

function inputDecimalPoint() {
    if (dividedByZero) {
        expressionDiv.textContent = "";
        enableButtons();
        dividedByZero = false;
    }
    if (shouldResetDisplayValue) {
        updateDisplayValue("0");
        shouldResetDisplayValue = false;
    }
    if (!canAddCharacter()) {
        return;
    }
    if (!getDisplayValue().includes(".")) {
        updateDisplayValue(getDisplayValue() + ".");
    }
}

function handleOperator(localOperator) {
    if (firstNumber && !shouldResetDisplayValue) {
        secondNumber = getDisplayValue();
        const result = operate(operator, firstNumber, secondNumber);
        if (result !== null) {
            firstNumber = result;
            // Clear secondNumber so that pressing an operator after a successful calculation won't run this conditional block
            secondNumber = "";
            updateDisplayValue(result);         
        } else {
            handleDivisionByZero();
        }
    } else {
        firstNumber = getDisplayValue();
    }

    operator = localOperator;
    
    if (firstNumber !== "") {
        expressionDiv.textContent = `${formatNumber(firstNumber)} ${operator}`;
    }    
    shouldResetDisplayValue = true;
    // console.log("handleOperator");
}

function calculate() {
    if (firstNumber && !shouldResetDisplayValue) {
        secondNumber = getDisplayValue();
        expressionDiv.textContent = `${formatNumber(firstNumber)} ${operator} ${formatNumber(secondNumber)} =`;
        const result = operate(operator, firstNumber, secondNumber);
        if (result !== null) {
            updateDisplayValue(result);
            firstNumber = "";
            operator = "";
            secondNumber = "";
        }
        else {
            handleDivisionByZero();
        }
        
    }
    // console.log("calculate");
}

function backspace() {
    if (getDisplayValue().length === 1) {
        updateDisplayValue("0");
    }
    else {
        updateDisplayValue(getDisplayValue().slice(0, -1));
    }
    updateDisplayValue();
}

function clear() {
    firstNumber = "";
    operator = "";
    secondNumber = "";
    shouldResetDisplayValue = false;
    expressionDiv.textContent = "";
    updateDisplayValue("0");
    
}


// ---------------
// Event listeners
// ---------------

digitButtons.forEach((button) => {
    button.addEventListener("click", () => inputDigit(button.textContent));
});

decimalPointButton.addEventListener("click", inputDecimalPoint);

operatorButtons.forEach((button) => {
    button.addEventListener("click", () => handleOperator(button.textContent));
});

equalsButton.addEventListener("click", calculate);

clearButton.addEventListener("click", clear);

backspaceButton.addEventListener("click", backspace);

// This is for selecting the calculator button that corresponds to a key press
// so i can add my active class to it
const keyToButtonMap = {
    "Enter": document.querySelector(".equals")
};

// Populate keyToButtonMap
document.querySelectorAll("button").forEach((button) => {
    keyToButtonMap[button.dataset.key] = button;
});

// Keyboard support and adding the active class to the corresponding calculator button 
document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") {
        inputDigit(e.key);
    }
    else if (e.key === ".") {
        inputDecimalPoint();
    }
    else if (e.key === "+") {
        handleOperator("+");
    }
    else if (e.key === "-") {
        handleOperator("-");
    }
    else if (e.key === "*") {
        handleOperator("×");
    }
    else if (e.key === "/") {
        e.preventDefault();
        handleOperator("÷");
    }
    else if (e.key === "Enter" || e.key === "=") {
        if (e.key === "Enter") {
            e.preventDefault();
        }
        calculate();
    }
    else if (e.key === "Escape") {
        clear();
    }
    else if (e.key === "Backspace") {
        backspace();
    }
    
    const button = keyToButtonMap[e.key];
    if (button) {
        if (e.key === "=" || e.key === "Enter") {
            button.classList.add("equals-button-active");
        }
        else {
            button.classList.add("button-active");
        }
    }
    // console.log(e.key);
});

// Remove active class of button on keyup
document.addEventListener("keyup", (e) => {
    const button = keyToButtonMap[e.key];
    if (button) {
        if (e.key === "=" || e.key === "Enter") {
            button.classList.remove("equals-button-active");
        }
        else {
            button.classList.remove("button-active");
        }
    }
    // console.log("keyup:", e.key);
});
