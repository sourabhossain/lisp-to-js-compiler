const LETTERS = /[a-z]/i;
const WHITESPACE = /\s/;
const NUMBERS = /\d/;

module.exports = function tokenizer(input) {
    const tokens = [];
    let current = 0;
    const length = input.length;

    while (current < length) {
        let char = input[current];

        // Handle parentheses
        if (char === '(' || char === ')') {
            tokens.push({
                type: 'paren',
                value: char
            });
            current++;
            continue;
        }

        // Handle names (identifiers)
        if (LETTERS.test(char)) {
            let value = '';

            while (LETTERS.test(char)) {
                value += char;
                char = input[++current];
            }

            tokens.push({
                type: 'name',
                value
            });
            continue;
        }

        // Skip whitespace
        if (WHITESPACE.test(char)) {
            current++;
            continue;
        }

        // Handle numbers
        if (NUMBERS.test(char)) {
            let value = '';

            while (NUMBERS.test(char)) {
                value += char;
                char = input[++current];
            }

            tokens.push({
                type: 'number',
                value
            });
            continue;
        }

        throw new TypeError(
            `Unknown character encountered in input at position ${current}: '${char}'.\nPlease check your code for invalid symbols.`
        );
    }

    return tokens;
};
