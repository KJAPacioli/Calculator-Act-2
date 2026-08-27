/* ==============================================================================
# ATTRIBUTION: Calculator Source Code
# Submitted by: course-org/classroom-demos-2026
# Block: 3B
# Class and Subject Code:ITP313L 
# ============================================================================== */


/* ====== Your code starts below ====== */

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear(); // Initialize calculator state on load
  }

  // Resets all calculator variables to their default state
  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
  }

  // Removes the last typed character
  delete() {
    if (this.currentOperand === '0' || this.currentOperand === 'Error') return;
    
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    
    // If deleted completely or only a negative sign is left, reset to '0'
    if (this.currentOperand === '' || this.currentOperand === '-') {
      this.currentOperand = '0';
    }
  }

  // Appends a number or a decimal point to the display
  appendNumber(number) {
    // If a calculation just finished, reset the screen for a new number
    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.shouldResetScreen = false;
    }
    
    // Prevent multiple decimals
    if (number === '.' && this.currentOperand.includes('.')) return;
    
    // Handle initial zero to prevent '07', etc.
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  // Handles clicking a mathematical operator
  chooseOperation(operation) {
    if (this.currentOperand === '' && this.currentOperand !== '0') {
      // Allows user to change their mind on the operator without breaking logic
      if (this.previousOperand !== '') {
        this.operation = operation;
      }
      return;
    }
    
    // If there's already a pending operation, compute it first
    if (this.previousOperand !== '') {
      this.compute();
    }
    
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  // Calculates the final result
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    
    // Don't compute if we lack numbers
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        if (current === 0) {
          this.currentOperand = 'Error';
          this.previousOperand = '';
          this.operation = undefined;
          this.shouldResetScreen = true;
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }
    
    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;
  }

  // Converts the current operand to a percentage
  computePercent() {
    if (this.currentOperand === '' || this.currentOperand === 'Error') return;
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;
    
    this.currentOperand = (current / 100).toString();
    this.shouldResetScreen = true;
  }

  // Updates the HTML text elements
  updateDisplay() {
    this.currentOperandTextElement.innerText = this.currentOperand === '' ? '0' : this.currentOperand;
    
    if (this.operation != null) {
      // Map standard data-value operators to better-looking display symbols (matching HTML)
      let displayOp = this.operation;
      if (displayOp === '*') displayOp = '×';
      if (displayOp === '/') displayOp = '÷';
      if (displayOp === '-') displayOp = '−';
      
      this.previousOperandTextElement.innerText = `${this.previousOperand} ${displayOp}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}

// === DOM Element Selection ===
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-action="operator"]');
const equalsButton = document.querySelector('[data-action="equals"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const percentButton = document.querySelector('[data-action="percent"]');

// Initialize the Calculator object
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// === Event Listeners Setup ===

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.dataset.number);
    calculator.updateDisplay();
  });
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.dataset.value);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});

percentButton.addEventListener('click', () => {
  calculator.computePercent();
  calculator.updateDisplay();
});