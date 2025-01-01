const readline = require('readline'); //  для чтения ввода с консоли
const fs = require('fs'); // для работы с файловой системой

const alphabet = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"; // алфавит (тут скам с буквой Ё)
//для кодирования
function encode(text, shift) {
    let code = '';

    for (let i = 0; i < text.length; i++) {
        const charIndex = alphabet.indexOf(text[i]); // Находим индекс символа в алфавите
        if (charIndex !== -1) { // Если символ есть в алфавите
            code += alphabet[(charIndex + shift) % alphabet.length]; // Кодируем символ
        } else {
            code += text[i]; // Если символ не в алфавите, оставляем его как есть
        }
    }
    return code;
}
//для раскодирования
function decode(text, shift) {
    let code = '';

    for (let i = 0; i < text.length; i++) {
        const charIndex = alphabet.indexOf(text[i]); // Находим индекс символа в алфавите
        if (charIndex !== -1) { // Если символ есть в алфавите
            code += alphabet[(charIndex - shift + alphabet.length) % alphabet.length]; // Раскодируем символ
        } else {
            code += text[i]; // Если символ не в алфавите, оставляем его как есть
        }
    }
    return code;
}
// для анализа частоты
function analysis(text) {
    const freq = {}; // для хранения частоты символов

    for (let char of text) {
        if (alphabet.includes(char)) { 
            freq[char] = (freq[char] || 0) + 1; // Увеличиваем счетчик частоты символа
        }
    }
    return Object.entries(freq).sort((a, b) => b[1] - a[1]);
}
// Основная функция программы
function main() {

    const rl = readline.createInterface({
        input: process.stdin, 
        output: process.stdout 
    });

    rl.question("Выберите опцию (0 - Кодировать, 1 - Раскодировать, 2 - Анализ текста): ", (choice) => {
        if (choice === '0') { 
            rl.question("Введите путь к файлу для кодирования: ", (filePath) => {
                rl.question("Введите величину сдвига: ", (shiftInput) => {
                    const shift = parseInt(shiftInput, 10); // парсим в число
                    if (isNaN(shift)) { // проверка на число
                        rl.close();
                        return;
                    }
                    const text = fs.readFileSync(filePath, 'utf8');
                    const encodedText = encode(text, shift);

                    rl.question("Введите путь для сохранения закодированного текста: ", (outputFilePath) => {
                        fs.writeFileSync(outputFilePath, encodedText, 'utf8');
                        console.log("Текст успешно закодирован и сохранен в:", outputFilePath);
                        rl.close();
                    });
                });
            });
        } else if (choice === '1') { 
            rl.question("Введите путь к файлу для раскодирования: ", (filePath) => {
                rl.question("Введите величину сдвига: ", (shiftInput) => {
                    const shift = parseInt(shiftInput, 10); 
                    if (isNaN(shift)) { 
                        rl.close();
                        return;
                    }
                    const text = fs.readFileSync(filePath, 'utf8'); 
                    const decodedText = decode(text, shift);

                    rl.question("Введите путь для сохранения раскодированного текста: ", (outputFilePath) => {
                        fs.writeFileSync(outputFilePath, decodedText, 'utf8'); 
                        console.log("Текст успешно раскодирован и сохранен в:", outputFilePath);
                        rl.close();
                    });
                });
            });
        } else if (choice === '2') { 
            rl.question("Введите путь к файлу для анализа текста: ", (filePath) => {
                const text = fs.readFileSync(filePath, 'utf8');
                const freq = analysis(text);

                console.log("Результат частотного анализа:");
                freq.forEach(([char, count]) => {
                    console.log(`${char}: ${count}`);
                });

                rl.close();
            });
        } else {
            rl.close();
        }
    });
}

main();