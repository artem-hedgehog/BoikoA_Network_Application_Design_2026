// js/pages/TasksPage.js
import { concatenate, erase, maxConsecutiveOnes, rle } from '../utils/stringUtils.js';

export class TasksPage {
    constructor(container) {
        this.container = container;
    }

    // Внедряем стили для этой страницы (если нужно дополнить)
    injectStyles() {
        if (document.getElementById('tasks-page-styles')) return;
        const style = document.createElement('style');
        style.id = 'tasks-page-styles';
        style.textContent = `
            .tasks-section {
                background: white;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .tasks-section h3 {
                margin-bottom: 16px;
                color: #242424;
                font-size: 1.3rem;
            }
            .tasks-input-group {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                align-items: center;
                margin-bottom: 16px;
            }
            .tasks-input-group input {
                flex: 1;
                min-width: 200px;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 14px;
            }
            .tasks-button {
                background-color: #b62ccb;
                color: white;
                border: none;
                padding: 8px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: background-color 0.3s;
            }
            .tasks-button:hover {
                background-color: #7b3ac9;
            }
            .tasks-result {
                background: #f5f5f5;
                padding: 10px 15px;
                border-radius: 8px;
                font-family: monospace;
                word-break: break-all;
            }
        `;
        document.head.appendChild(style);
    }

    render() {
        this.injectStyles();
        this.container.innerHTML = `
            <div class="main__container">
                <h1 class="page-title">Домашнее задание: задачи на циклы, массивы, строки</h1>

                <!-- Задача 1.1 concatenate -->
                <div class="tasks-section">
                    <h3>1.1 concatenate(arr, separator)</h3>
                    <div class="tasks-input-group">
                        <input type="text" id="concat-arr" placeholder='["Hello","world","!"]' value='["Hello","world","!"]'>
                        <input type="text" id="concat-sep" placeholder="separator" value=" ">
                        <button id="run-concat" class="tasks-button">Выполнить</button>
                    </div>
                    <div class="tasks-result">
                        Результат: <span id="concat-result"></span>
                    </div>
                </div>

                <!-- Задача 1.10 erase -->
                <div class="tasks-section">
                    <h3>1.10 erase(arr)</h3>
                    <div class="tasks-input-group">
                        <input type="text" id="erase-arr" placeholder='[0,1,false,2,"",3,null]' value='[0,1,false,2,"",3,null]'>
                        <button id="run-erase" class="tasks-button">Выполнить</button>
                    </div>
                    <div class="tasks-result">
                        Результат: <span id="erase-result"></span>
                    </div>
                </div>

                <!-- Задача 2.3 maxConsecutiveOnes -->
                <div class="tasks-section">
                    <h3>2.3 maxConsecutiveOnes(str)</h3>
                    <div class="tasks-input-group">
                        <input type="text" id="ones-str" placeholder='Строка из 0 и 1' value='1000000111100011111010111101111111'>
                        <button id="run-ones" class="tasks-button">Выполнить</button>
                    </div>
                    <div class="tasks-result">
                        Максимальная длина последовательности единиц: <span id="ones-result"></span>
                    </div>
                </div>

                <!-- Задача 3.6 RLE сжатие -->
                <div class="tasks-section">
                    <h3>3.6 rle(str) – RLE сжатие</h3>
                    <div class="tasks-input-group">
                        <input type="text" id="rle-str" placeholder='Строка для сжатия' value='AAABBCDDD'>
                        <button id="run-rle" class="tasks-button">Выполнить</button>
                    </div>
                    <div class="tasks-result">
                        Сжатая строка: <span id="rle-result"></span>
                    </div>
                </div>
            </div>
        `;

        // Привязываем обработчики
        document.getElementById('run-concat').addEventListener('click', () => {
            try {
                const arr = JSON.parse(document.getElementById('concat-arr').value);
                const sep = document.getElementById('concat-sep').value;
                const result = concatenate(arr, sep);
                document.getElementById('concat-result').textContent = result;
            } catch(e) {
                document.getElementById('concat-result').textContent = 'Ошибка: неверный формат массива';
            }
        });

        document.getElementById('run-erase').addEventListener('click', () => {
            try {
                const arr = JSON.parse(document.getElementById('erase-arr').value);
                const result = erase(arr);
                document.getElementById('erase-result').textContent = JSON.stringify(result);
            } catch(e) {
                document.getElementById('erase-result').textContent = 'Ошибка: неверный формат массива';
            }
        });

        document.getElementById('run-ones').addEventListener('click', () => {
            const str = document.getElementById('ones-str').value;
            const result = maxConsecutiveOnes(str);
            document.getElementById('ones-result').textContent = result;
        });

        document.getElementById('run-rle').addEventListener('click', () => {
            const str = document.getElementById('rle-str').value;
            const result = rle(str);
            document.getElementById('rle-result').textContent = result;
        });

        // Инициализируем отображение результатов при загрузке страницы (показываем сразу)
        document.getElementById('run-concat').click();
        document.getElementById('run-erase').click();
        document.getElementById('run-ones').click();
        document.getElementById('run-rle').click();


    }
}
