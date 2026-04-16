export function concatenate(arr, separator) {
    return arr.join(separator);
}

export function erase(arr) {
    return arr.filter(item => item !== false &&  item !== '' && item !== 0 && item !== null);
}

export function maxConsecutiveOnes(str) {
    let maxLen = 0, currentLen = 0;
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

export function rle(str) {
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
