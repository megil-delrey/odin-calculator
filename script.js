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

function getDisplayValue() {
    return valueDiv.textContent;
}

function updateDisplayValue(value) {
    // console.log("Updating display:", displayValue);
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

function inputDigit(digit) {
    if (!canAddCharacter()) {
        return;
    }
    if (shouldResetDisplay) {
        updateDisplayValue("0");
        shouldResetDisplay = false;
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
    if (!canAddCharacter()) {
        return;
    }
    if (shouldResetDisplay) {
        updateDisplayValue("0");
        shouldResetDisplay = false;
    }
    if (!getDisplayValue().includes(".")) {
        updateDisplayValue(getDisplayValue() + ".");
    }
}

function handleOperator(localOperator) {
    if (!firstNumber) {
        firstNumber = getDisplayValue();
    }
    else if (!secondNumber && !shouldResetDisplay) {
        secondNumber = getDisplayValue();
        const result = operate(operator, firstNumber, secondNumber);
        if (result !== null) {
            firstNumber = result;
            updateDisplayValue(result);         
        } else {
            updateDisplayValue("Cannot divide by zero");
            firstNumber = "";
        }
        secondNumber = "";
    }

    operator = localOperator;
    if (firstNumber !== null) {
        expressionDiv.textContent = `${formatNumber(firstNumber)} ${operator}`;
    }    
    shouldResetDisplay = true;

    // console.log("handleOperator");
}

function calculate() {
    if (firstNumber && !waitingForSecondOperand) {
        displayExpression.textContent = `${formatNumber(firstNumber)} ${operator} ${formatNumber(displayValue)} =`;
        const result = operate(operator, firstNumber, displayValue);
        firstNumber = "";
        displayValue = result !== null ? String(result) : result;        
        updateDisplayValue();
    }
    equalsPressed = true;
    // console.log("calculate");
}

function backspace() {
    if (valueDiv.textContent.length === 1) {
        updateDisplayValue("0");
    }
    else {
        updateDisplayValue(valueDiv.textContent.slice(0, -1));
    }
    updateDisplayValue();
}

function clear() {
    firstNumber = "";
    operator = "";
    displayValue = "0";
    displayExpression.textContent = "";
    updateDisplayValue();
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
        if (e.key === "Enter") {
            e.preventDefault();
        }
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

// Remove active class of button on keyup
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
