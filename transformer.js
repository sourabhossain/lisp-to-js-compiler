const traverse = require('./traverse');

module.exports = function transformer(originalAST) {
    const jsAST = {
        type: 'Program',
        body: []
    };

    traverse(originalAST, {
        NumberLiteral() {
            // Do nothing here; handled in CallExpression
        },
        CallExpression(node, parent) {
            // Build the call expression
            let expression = {
                type: 'CallExpression',
                callee: {
                    type: 'Identifier',
                    name: node.name
                },
                arguments: node.params.map(param => {
                    if (param.type === 'CallExpression') {
                        // Recursively transform nested call expressions
                        return transformCall(param);
                    } else if (param.type === 'NumberLiteral') {
                        return {
                            type: 'NumericLiteral',
                            value: param.value
                        };
                    }
                })
            };
            // If top-level, wrap in ExpressionStatement
            if (parent && parent.type === 'Program') {
                jsAST.body.push({
                    type: 'ExpressionStatement',
                    expression
                });
            } else {
                return expression;
            }
        }
    });

    // Helper to recursively transform call expressions
    function transformCall(node) {
        return {
            type: 'CallExpression',
            callee: {
                type: 'Identifier',
                name: node.name
            },
            arguments: node.params.map(param => {
                if (param.type === 'CallExpression') {
                    return transformCall(param);
                } else if (param.type === 'NumberLiteral') {
                    return {
                        type: 'NumericLiteral',
                        value: param.value
                    };
                }
            })
        };
    }

    return jsAST;
};
