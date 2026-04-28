function concatenate(arr, separator) {
    return arr.join(separator);
}

console.log(concatenate(['Hello', 'world', '!'], ' '));


function erase(arr) {
    return arr.filter(item => item !== false && item !== undefined && item !== '' && item !== 0 && item !== null);
}
const data = [0, 1, false, 2, undefined, '', 3, null];
console.log(erase(data)); 


function maxConsecutiveOnes(str) {
    let maxLen = 0;
    let currentLen = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '1') {
            currentLen++;
            if (currentLen > maxLen) maxLen = currentLen;
        } else {
            currentLen = 0;
        }
    }
    return maxLen;
}

// Пример:
console.log(maxConsecutiveOnes('1000000111100011111010111101111111'));


function rle(str) {
    if (str.length === 0) return '';
    let result = '';
    let count = 1;
    for (let i = 1; i <= str.length; i++) {
        if (i < str.length && str[i] === str[i - 1]) {
            count++;
        } else {
            result += str[i - 1] + count;
            count = 1;
        }
    }
    return result;
}

// Пример:
console.log(rle('AAABBCDDD1111'));
console.log(rle(''));   