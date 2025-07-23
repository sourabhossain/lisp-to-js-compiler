module.exports = function parser(tokens) {
    let current = 0;

    function walk() {
        let token = tokens[current];

        // Handle number literals
        if (token.type === 'number') {
            current++;
            return {
                type: 'NumberLiteral',
                value: token.value
            };
        }

        // Handle call expressions (e.g., (add 2 3))
        if (token.type === 'paren' && token.value === '(') {
            token = tokens[++current];
            const expression = {
                type: 'CallExpression',
                name: token.value,
                params: []
            };
            token = tokens[++current];

            // Parse all parameters inside the parentheses
            while (token.value !== ')') {
                expression.params.push(walk());
                token = tokens[current];
            }

            current++;
            return expression;
        }

        throw new TypeError(
            `Unknown token encountered during parsing at position ${current}: '${JSON.stringify(token)}'.\nPlease check your code for syntax errors.`
        );
    }

    // Support multiple top-level expressions
    const ast = {
        type: 'Program',
        body: []
    };
    while (current < tokens.length) {
        ast.body.push(walk());
    }

    return ast;
};
