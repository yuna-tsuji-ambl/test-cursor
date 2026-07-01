import { useState } from 'react';
import './Calculator.css';

const OPERATOR_SYMBOLS = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
};

const FUNCTION_BUTTONS = [
  { label: 'sin', type: 'function', value: 'sin', className: 'btn-sci' },
  { label: 'cos', type: 'function', value: 'cos', className: 'btn-sci' },
  { label: 'tan', type: 'function', value: 'tan', className: 'btn-sci' },
  { label: '√', type: 'function', value: 'sqrt', className: 'btn-sci' },
  { label: 'ln', type: 'function', value: 'ln', className: 'btn-sci' },
  { label: 'log', type: 'function', value: 'log', className: 'btn-sci' },
  { label: 'x²', type: 'function', value: 'square', className: 'btn-sci' },
  { label: '1/x', type: 'function', value: 'reciprocal', className: 'btn-sci' },
];

const MAIN_BUTTONS = [
  { label: 'C', type: 'clear', className: 'btn-fn' },
  { label: '±', type: 'toggleSign', className: 'btn-fn' },
  { label: '%', type: 'percent', className: 'btn-fn' },
  { label: '÷', type: 'operator', value: '/', className: 'btn-op' },
  { label: '7', type: 'digit', value: '7' },
  { label: '8', type: 'digit', value: '8' },
  { label: '9', type: 'digit', value: '9' },
  { label: '×', type: 'operator', value: '*', className: 'btn-op' },
  { label: '4', type: 'digit', value: '4' },
  { label: '5', type: 'digit', value: '5' },
  { label: '6', type: 'digit', value: '6' },
  { label: '−', type: 'operator', value: '-', className: 'btn-op' },
  { label: '1', type: 'digit', value: '1' },
  { label: '2', type: 'digit', value: '2' },
  { label: '3', type: 'digit', value: '3' },
  { label: '+', type: 'operator', value: '+', className: 'btn-op' },
  { label: '0', type: 'digit', value: '0', className: 'btn-zero' },
  { label: '.', type: 'decimal' },
  { label: '=', type: 'equals', className: 'btn-eq' },
];

function formatDisplay(value) {
  if (value === 'Error') return value;
  const num = parseFloat(value);
  if (Number.isNaN(num)) return '0';
  if (Math.abs(num) >= 1e12) return num.toExponential(6);
  const str = String(num);
  if (str.length <= 12) return str;
  return num.toPrecision(10).replace(/\.?0+$/, '');
}

function formatOperator(op) {
  return OPERATOR_SYMBOLS[op] || op;
}

function applyFunction(name, value) {
  const toRadians = (deg) => (deg * Math.PI) / 180;

  switch (name) {
    case 'sin':
      return Math.sin(toRadians(value));
    case 'cos':
      return Math.cos(toRadians(value));
    case 'tan':
      return Math.tan(toRadians(value));
    case 'sqrt':
      return value < 0 ? 'Error' : Math.sqrt(value);
    case 'square':
      return value * value;
    case 'ln':
      return value <= 0 ? 'Error' : Math.log(value);
    case 'log':
      return value <= 0 ? 'Error' : Math.log10(value);
    case 'reciprocal':
      return value === 0 ? 'Error' : 1 / value;
    default:
      return value;
  }
}

function functionExpressionLabel(name, input) {
  const formatted = formatDisplay(String(input));
  switch (name) {
    case 'sqrt':
      return `√(${formatted})`;
    case 'square':
      return `(${formatted})²`;
    case 'reciprocal':
      return `1/(${formatted})`;
    default:
      return `${name}(${formatted})`;
  }
}

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const reset = () => {
    setDisplay('0');
    setExpression('');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b === 0 ? 'Error' : a / b;
      default:
        return b;
    }
  };

  const setOperatorExpression = (leftValue, nextOp) => {
    setExpression(`${formatDisplay(String(leftValue))} ${formatOperator(nextOp)}`);
  };

  const handleDigit = (digit) => {
    if (display === 'Error') {
      reset();
      setDisplay(digit);
      return;
    }

    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
      return;
    }

    setDisplay(display === '0' ? digit : display + digit);
  };

  const handleDecimal = () => {
    if (display === 'Error') {
      reset();
      setDisplay('0.');
      return;
    }

    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (nextOp) => {
    if (display === 'Error') return;

    const current = parseFloat(display);

    if (operator !== null && !waitingForOperand) {
      const result = calculate(previousValue, current, operator);
      if (result === 'Error') {
        setDisplay('Error');
        setExpression('');
        setPreviousValue(null);
        setOperator(null);
        return;
      }
      setDisplay(String(result));
      setPreviousValue(result);
      setOperatorExpression(result, nextOp);
    } else {
      setPreviousValue(current);
      setOperatorExpression(current, nextOp);
    }

    setOperator(nextOp);
    setWaitingForOperand(true);
  };

  const handleEquals = () => {
    if (display === 'Error' || operator === null || waitingForOperand) return;

    const current = parseFloat(display);
    const left = formatDisplay(String(previousValue));
    const right = formatDisplay(display);
    const result = calculate(previousValue, current, operator);

    setExpression(`${left} ${formatOperator(operator)} ${right} =`);

    if (result === 'Error') {
      setDisplay('Error');
    } else {
      setDisplay(String(result));
    }

    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleToggleSign = () => {
    if (display === 'Error' || display === '0') return;
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  };

  const handlePercent = () => {
    if (display === 'Error') return;
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  const handleFunction = (fnName) => {
    if (display === 'Error') return;

    const current = parseFloat(display);
    const result = applyFunction(fnName, current);
    const expr = functionExpressionLabel(fnName, current);

    setExpression(expr);

    if (result === 'Error' || Number.isNaN(result) || !Number.isFinite(result)) {
      setDisplay('Error');
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      return;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleButton = (btn) => {
    switch (btn.type) {
      case 'clear':
        reset();
        break;
      case 'digit':
        handleDigit(btn.value);
        break;
      case 'decimal':
        handleDecimal();
        break;
      case 'operator':
        handleOperator(btn.value);
        break;
      case 'equals':
        handleEquals();
        break;
      case 'toggleSign':
        handleToggleSign();
        break;
      case 'percent':
        handlePercent();
        break;
      case 'function':
        handleFunction(btn.value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="calculator">
      <div className="display-panel">
        <div className="expression" aria-live="polite" aria-label="途中式">
          {expression}
        </div>
        <div className="display" aria-live="polite" aria-label="計算結果">
          {formatDisplay(display)}
        </div>
      </div>
      <div className="keypad keypad-sci">
        {FUNCTION_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            className={`btn ${btn.className || ''}`}
            onClick={() => handleButton(btn)}
            aria-label={btn.label}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div className="keypad">
        {MAIN_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            className={`btn ${btn.className || ''}`}
            onClick={() => handleButton(btn)}
            aria-label={btn.label}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
