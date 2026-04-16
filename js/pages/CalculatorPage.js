export class CalculatorPage {
    constructor(container) {
        this.container = container;
    }

    injectStyles() {
        if (document.getElementById('calculator-styles')) return;
        const style = document.createElement('style');
        style.id = 'calculator-styles';
        style.textContent = `
            .calculator-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
            }
            .calculator-container {
                background-color: #ffffff;
                padding: 30px 25px 25px 25px;
                border-radius: 30px;
                display: inline-block;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                border: 1px solid #f0f0f0;
            }
            .my-btn {
                margin-right: 5px;
                margin-top: 5px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: none;
                background: #f0f0f0;
                color: black;
                font-size: 1.5rem;
                font-family: Arial, Helvetica, sans-serif;
                cursor: pointer;
                user-select: none;
            }
            .my-btn:hover {
                background: darkgray;
                transform: scale(1.05);
            }
            .my-btn:active {
                filter: brightness(130%);
                transform: scale(0.95);
            }
            .my-btn.primary {
                background: linear-gradient(97.26deg, #ed3cca 0.49%, #df34d2 14.88%, #d02bd9 29.27%, #bf22e1 43.14%, #ae1ae8 57.02%, #9a10f0 70.89%, #8306f7 84.76%, #7c1af8 99.15%);
            }
            .my-btn.primary:hover {
                background: #d02bd9;
            }
            .my-btn.secondary {
                background: #7c1af8;
            }
            .my-btn.secondary:hover {
                background: #9a10f0;
            }
            .my-btn.execute {
                width: 110px;
                border-radius: 34px;
            }
            .result {
                width: 220px;
                height: 50px;
                margin-bottom: 15px;
                padding-right: 10px;
                background: #f0f0f0;
                text-align: right;
                color: black;
                font-size: 1.5rem;
                font-family: Arial, Helvetica, sans-serif;
                line-height: 50px;
            }
        `;
        document.head.appendChild(style);
    }

    render() {
        this.injectStyles();
        this.container.innerHTML = `
            <div class="calculator-wrapper">
                <div class="calculator-container">
                    <div id="result" class="result">0</div>
                    <div>
                        <div>
                            <button id="btn_op_clear" class="my-btn secondary">C</button>
                            <button id="btn_op_sign" class="my-btn secondary">+/-</button>
                            <button id="btn_op_percent" class="my-btn secondary">%</button>
                            <button id="btn_op_div" class="my-btn primary">/</button>
                        </div>
                        <div>
                            <button id="btn_digit_7" class="my-btn">7</button>
                            <button id="btn_digit_8" class="my-btn">8</button>
                            <button id="btn_digit_9" class="my-btn">9</button>
                            <button id="btn_op_mult" class="my-btn primary">x</button>
                        </div>
                        <div>
                            <button id="btn_digit_4" class="my-btn">4</button>
                            <button id="btn_digit_5" class="my-btn">5</button>
                            <button id="btn_digit_6" class="my-btn">6</button>
                            <button id="btn_op_minus" class="my-btn primary">-</button>
                        </div>
                        <div>
                            <button id="btn_digit_1" class="my-btn">1</button>
                            <button id="btn_digit_2" class="my-btn">2</button>
                            <button id="btn_digit_3" class="my-btn">3</button>
                            <button id="btn_op_plus" class="my-btn primary">+</button>
                        </div>
                        <div>
                            <button id="btn_digit_0" class="my-btn">0</button>
                            <button id="btn_digit_dot" class="my-btn">.</button>
                            <button id="btn_op_equal" class="my-btn primary execute">=</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.initCalculatorLogic();
    }

    initCalculatorLogic() {
        const resultElement = document.getElementById('result');
        let currentInput = '0';
        let expression = '';
        let previousInput = '';
        let operator = '';
        let shouldResetScreen = false;

        function updateScreen(value) {
            resultElement.textContent = value;
        }

        function handleDigit(digit) {
            if (shouldResetScreen) {
                currentInput = '';
                expression = '';
                shouldResetScreen = false;
            }
            expression += digit;
            if (digit === '.' && currentInput.includes('.')) return;
            if (currentInput === '0' && digit !== '.') {
                currentInput = digit;
            } else {
                currentInput += digit;
            }
            updateScreen(expression);
        }

        function handleOperator(op) {
            if (operator && !shouldResetScreen) {
                calculate();
            }
            previousInput = currentInput;
            operator = op;
            const displayOp = (op === '*') ? '×' : op;
            expression += displayOp;
            shouldResetScreen = true;
            updateScreen(expression);
        }

        function calculate() {
            if (!operator || shouldResetScreen) return;
            let result;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            if (isNaN(prev) || isNaN(current)) {
                result = 'Error';
            } else {
                switch (operator) {
                    case '+': result = prev + current; break;
                    case '-': result = prev - current; break;
                    case '*': result = prev * current; break;
                    case '/': result = current === 0 ? 'Error' : prev / current; break;
                    default: return;
                }
            }
            if (typeof result === 'number' && !Number.isInteger(result)) {
                result = parseFloat(result.toFixed(10));
            }
            currentInput = result.toString();
            expression = result.toString();
            operator = '';
            shouldResetScreen = true;
            updateScreen(expression);
        }

        function clearAll() {
            currentInput = '0';
            expression = '';
            previousInput = '';
            operator = '';
            shouldResetScreen = false;
            updateScreen('0');
        }

        function changeSign() {
            if (currentInput !== '0' && currentInput !== 'Error') {
                currentInput = (parseFloat(currentInput) * -1).toString();
                expression = currentInput;
                updateScreen(expression);
            }
        }

        function percent() {
            if (currentInput !== 'Error') {
                currentInput = (parseFloat(currentInput) / 100).toString();
                expression = currentInput;
                updateScreen(expression);
            }
        }

        // Назначение обработчиков
        document.querySelectorAll('[id^="btn_digit_"]').forEach(btn => {
            btn.addEventListener('click', () => handleDigit(btn.textContent));
        });
        document.getElementById('btn_op_plus')?.addEventListener('click', () => handleOperator('+'));
        document.getElementById('btn_op_minus')?.addEventListener('click', () => handleOperator('-'));
        document.getElementById('btn_op_mult')?.addEventListener('click', () => handleOperator('*'));
        document.getElementById('btn_op_div')?.addEventListener('click', () => handleOperator('/'));
        document.getElementById('btn_op_equal')?.addEventListener('click', () => calculate());
        document.getElementById('btn_op_clear')?.addEventListener('click', () => clearAll());
        document.getElementById('btn_op_sign')?.addEventListener('click', () => changeSign());
        document.getElementById('btn_op_percent')?.addEventListener('click', () => percent());

        // Клавиатура
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            if (key >= '0' && key <= '9') {
                event.preventDefault();
                handleDigit(key);
            } else if (key === '.') {
                event.preventDefault();
                handleDigit('.');
            } else if (key === '+') {
                event.preventDefault();
                handleOperator('+');
            } else if (key === '-') {
                event.preventDefault();
                handleOperator('-');
            } else if (key === '*') {
                event.preventDefault();
                handleOperator('*');
            } else if (key === '/') {
                event.preventDefault();
                handleOperator('/');
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculate();
            } else if (key === 'Escape' || key === 'Delete' || key === 'c' || key === 'C') {
                event.preventDefault();
                clearAll();
            }
        });
    }
}
