const expressionDiv = document.querySelector(".expression");
const valueDiv = document.querySelector(".value");
const digitButtons = document.querySelectorAll(".digit");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector(".equals");
const clearButton = document.querySelector(".clear");
const backspaceButton = document.querySelector(".backspace");

let firstNumber = "";
let operator = "";
let secondNumber = "";
let shouldResetDisplay = false;


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
                return null;
            }
            return a / b;
    }
}

function formatNumber(number) {
    number = String(number);
    if (number.includes(".")) {
        const [whole, decimal] = number.split(".");
        return `${Number(whole).toLocaleString("en-US")}.${decimal}`;
    }
    return Number(number).toLocaleString("en-US");    
}

function updateDisplay(value) {
    // console.log("Updating display:", displayValue);
    // if (displayValue === null) {
    //     displayValueDiv.textContent = "Cannot divide by zero";
    // } else {
    //     displayValueDiv.textContent = formatNumber(displayValue);
    // }
    valueDiv.textContent - value;
}

function canAddCharacter() {
    return displayValue.length < 13;
}

function inputDigit(digit) {
    if (!canAddCharacter()) {
        return;
    }
    if (valueDiv.textContent === "0") {
        updateDisplay(digit);
    }
    else {
        updateDisplay(valueDiv.textContent + digit);
    }
    // console.log("inputDigit: ", digit);
}

function inputDecimalPoint() {
    // if (!canAddCharacter()) {
    //     return;
    // }
    // if (!displayValue.includes(".")) {
    //     displayValue += ".";
    // }
    updateDisplay();
}

function handleOperator(operator) {
    // if (!firstNumber) {
    //     firstNumber = displayValue;
    // }
    // else if (firstNumber && !waitingForSecondOperand) {
    //     const result = operate(operator, firstNumber, displayValue);
    //     if (result !== null) {
    //         firstNumber = result;            
    //     } else {
    //         firstNumber = "";
    //     }
    //     displayValue = result;
    //     updateDisplay();
    // }
    // displayExpression.textContent = `${formatNumber(firstNumber)} ${operator}`;
    // waitingForSecondOperand = true;
    // operator = operator;
    // console.log("handleOperator");
}

function calculate() {
    if (firstNumber && !waitingForSecondOperand) {
        displayExpression.textContent = `${formatNumber(firstNumber)} ${operator} ${formatNumber(displayValue)} =`;
        const result = operate(operator, firstNumber, displayValue);
        firstNumber = "";
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
    firstNumber = "";
    operator = "";
    displayValue = "0";
    displayExpression.textContent = "";
    updateDisplay();
}


// ---------------
// EVENT LISTENERS
// ---------------

digitButtons.forEach((button) => {
    button.addEventListener("click", () => inputDigit(button.textContent));
});

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
    } else if (e.key === "+") {
        handleOperator("+");
    } else if (e.key === "-") {
        handleOperator("-");
    } else if (e.key === "*") {
        handleOperator("×");
    } else if (e.key === "/") {
        e.preventDefault();
        handleOperator("÷");
    } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        calculate();
    } else if (e.key === "Escape") {
        clear();
    } else if (e.key === "Backspace") {
        backspace();
    }
    
    const button = keyToButtonMap[e.key];
    if (button) {
        if (e.key === "=" || e.key === "Enter") {
            button.classList.add("equals-button-active");
        } else {
            button.classList.add("button-active");
        }
    }
    // console.log(e.key);
});

// remove active class of button on keyup
document.addEventListener("keyup", (e) => {
    const button = keyToButtonMap[e.key];
    if (button) {
        if (e.key === "=" || e.key === "Enter") {
            button.classList.remove("equals-button-active");
        } else {
            button.classList.remove("button-active");
        }
    }
    // console.log("keyup:", e.key);
});
