(function (window, document, undefined) {
'use strict'

var Lexer = function Lexer () {
};

Lexer.TYPE = {
	COLON: "colon",
	COMMA: "comma",
	NUMBER: "number",
	STRING: "string",
	OPERATOR: "operator",
	SEMICOLON: "semicolon",
	IDENTIFIER: "identifier",
	PARENTHESIS: "parenthesis",
	QUESTION_MARK: "question_mark"
};

Lexer.prototype = {
	constructor: Lexer,

	lex: function (text) {
		this.text   = text; 
		this.index  = 0;
		this.tokens = [];

		while (this.index < this.text.length) {
			if (this.isNumberStart()) {
				this.readNumber();
			} else if (this.isStringStart()) {
				this.readString();
			} else if (this.isIndentifierStart()) {
				this.readIdentifier();
			} else if (this.isOperator()) {
				this.readOperator();
			} else if (this.isParenthesis()) {
				this.readParenthesis();
			} else if (this.isColon()) {
				this.readColon();
			} else if (this.isComma()) {
				this.readComma();
			} else if (this.isSemicolon()) {
				this.readSemicolon();
			} else if (this.isQuestionMark()) {
				this.readQuestionMark();
			} else if (this.isBlank()) {
				this.skip();
			} else {
				throw new Error("invalid at " + this.index);
			}
		}

		return this.tokens;
	},

	readNumber: function () {
		var numberStr = "";
		var hasDecimalPoint = false;

		var text  = this.text;
		var len   = text.length;
		var index = this.index;

		while (index < len) {
			var ch = text.charAt(index);

			if (/[0-9]/.test(ch)) {
				numberStr += ch;
				++index;

			} else if (/\./.test(ch)) {
				if (hasDecimalPoint) {
					throw new Error("number invalid at " + index);
				}

				numberStr += ch;
				
				++index;
				hasDecimalPoint = true;

			} else {
				break;
			}
		}

		this.tokens.push({
			type: Lexer.TYPE.NUMBER,
			value: parseFloat(numberStr, 10)
		});

		this.index = index;
	},

	readString: function () {
		var text  = this.text;
		var index = this.index;

		var ch = text.charAt(index);
		var endIndex = -1;

		if ((endIndex = text.indexOf(ch, index + 1)) < 0) {
			throw new Error("invalid string at " + index);
		}

		this.tokens.push({
			type: Lexer.TYPE.STRING,
			value: text.slice(index + 1, endIndex)
		});

		this.index = endIndex + 1;
	},

	readIdentifier: function () {
		var text  = this.text;
		var len   = text.length;
		var index = this.index;

		var identifier = text.charAt(index++);

		while (index < len) {
			var ch = text.charAt(index);

			if (/[\$_a-zA-Z0-9]/.test(ch)) {
				identifier += ch;
				++index;
			} else {
				break;
			}
		}

		this.tokens.push({
			type : Lexer.TYPE.IDENTIFIER,
			value: identifier
		});

		this.index += identifier.length;
	},

	readOperator: function () {
		var text  = this.text;
		var index = this.index;

		this.tokens.push({
			type : Lexer.TYPE.OPERATOR,
			value: text.charAt(index)
		});

		this.index = index + 1;
	},

	readParenthesis: function () {
		var text  = this.text;
		var index = this.index;

		this.tokens.push({
			type : Lexer.TYPE.PARENTHESIS,
			value: text.charAt(index)
		});

		this.index = index + 1;
	},

	readColon: function () {
		var text  = this.text;
		var index = this.index;

		this.tokens.push({
			type : Lexer.TYPE.COLON,
			value: text.charAt(index)
		});

		this.index = index + 1;
	},

	readComma: function () {
		var text  = this.text;
		var index = this.index;

		this.tokens.push({
			type : Lexer.TYPE.COMMA,
			value: text.charAt(index)
		});

		this.index = index + 1;
	},

	readSemicolon: function () {
		var text  = this.text;
		var index = this.index;

		this.tokens.push({
			type : Lexer.TYPE.SEMICOLON,
			value: text.charAt(index)
		});

		this.index = index + 1;
	},

	readQuestionMark: function () {
		var text  = this.text;
		var index = this.index;

		this.tokens.push({
			type : Lexer.TYPE.QUESTION_MARK,
			value: text.charAt(index)
		});

		this.index = index + 1;
	},

	isNumberStart: function () {
		var text  = this.text;
		var index = this.index;

		var ch = text.charAt(index);

		return /[0-9\.]/.test(ch);
	},

	isStringStart: function () {
		var text  = this.text;
		var index = this.index;

		var ch = text.charAt(index);

		return /['"]/.test(ch);
	},

	isIndentifierStart: function () {
		var text  = this.text;
		var index = this.index;

		var ch = text.charAt(index);

		return /[\$_a-zA-Z]/.test(ch);
	},

	isOperator: function () {
		var text  = this.text;
		var index = this.index;

		var ch = text.charAt(index);

		return /[\+\-\*\/]/.test(ch);
	},

	isParenthesis: function () {
		var text  = this.text;
		var index = this.index;

		var ch = text.charAt(index);

		return ch === "(" || ch === ")";
	},

	isColon: function () {
		var text  = this.text;
		var index = this.index;

		var ch = text.charAt(index);

		return ":" === ch;
	},

	isComma: function () {
		var text  = this.text;
		var index = this.index;

		var ch = text.charAt(index);

		return "," === ch;
	},

	isSemicolon: function () {
		var text  = this.text;
		var index = this.index;

		var ch = text.charAt(index);

		return ";" === ch;
	},

	isQuestionMark: function () {
		var text  = this.text;
		var index = this.index;

		var ch = text.charAt(index);

		return "?" === ch;
	},

	isBlank: function () {
		var text  = this.text;
		var index = this.index;

		var ch = text.charAt(index);

		return /\s/.test(ch);
	},

	skip: function (step) {
		step = step || 1;
		this.index += step;
	}
};

var AST = function AST (lexer) {
	this.lexer = lexer;
};

AST.TYPE = {
	PROGRAM: "program",
	NUMBER: "number",
	STRING: "string", 
	STATEMENT: "statement", // 通过','隔开的多个表达式语句
	IDENTIFIER: "identifier",
	DYADIC_EXPRESSION: "dyadic_expression", // 二元运算
	CALL_EXPRESSION: "call_expression", // 函数调用
	CONDITION_EXPRESSION: "condition_expression", // 条件表达式
};

AST.prototype = {
	constructor: AST,

	ast: function (text) {
		this.tokens = this.lexer.lex(text);

		var value = this.program();

		if (this.tokens.length > 0) {
			throw new Error("unexpected token: " + this.tokens[0]);
		}

		return value;
	},

	program: function () {
		var statements = [];
		
		while (this.tokens.length > 0) {
			if (!this.isString() 
				&& !this.isNumber() 
				&& !this.isIdentifier() 
				&& !this.isLeftParenthesis()) {
				throw new Error("program: expect token: string number identifier (");
			}

			statements.push(this.statement());

			if (!this.isSemicolon()) {
				throw new Error("program: expect token: ;");		
			}

			this.skip();
		}

		return {
			type: AST.TYPE.PROGRAM,
			statements: statements
		};
	},

	statement: function () {
		var expressions = [];

		while (this.tokens.length > 0) {
			if (!this.isString() 
				&& !this.isNumber() 
				&& !this.isIdentifier() 
				&& !this.isLeftParenthesis()) {
				throw new Error("statement: expect token: string number identifier (");
			}

			expressions.push(this.expression());

			if (this.isSemicolon() || this.isRightParentthesis()) {
				break;
			}

			if (!this.isComma()) {
				throw new Error("statement: expect token: ; ) ,");
			}

			this.skip();
		}

		return {
			type: AST.TYPE.STATEMENT,
			expressions: expressions 
		};
	},

	expression: function () {
		if (!this.isString() 
			&& !this.isNumber() 
			&& !this.isIdentifier() 
			&& !this.isLeftParenthesis()) {
			throw new Error("expression: expect token: string number identifier (");
		}

		var addExpression = this.additive();

		if (!this.isQuestionMark()) {
			return addExpression;
		}

		var firstExpression = addExpression;

		this.skip();
		
		var secondExpresion = this.additive();

		if (!this.isColon()) {
			throw new Error("expression: expect token: colon");
		}

		this.skip();

		var thirdExpression = this.additive();

		return {
			type: AST.TYPE.CONDITION_EXPRESSION,
			expressions: [
				firstExpression,
				secondExpresion,
				thirdExpression
			]
		};
	},

	additive: function () {
		if (!this.isString() 
			&& !this.isNumber() 
			&& !this.isIdentifier() 
			&& !this.isLeftParenthesis()) {
			throw new Error("additive: expect token: string number identifier (");
		}

		var multipleExpression = this.multiplicative();

		if (this.isSemicolon() 
			|| this.isQuestionMark()
			|| this.isColon()
			|| this.isRightParentthesis()
			|| this.isComma()) {
			return multipleExpression;
		}

		if (this.isAdditiveOperator()) {
			var token = this.tokens.shift();

			return {
				type: AST.TYPE.DYADIC_EXPRESSION,
				operator: token.value,
				left: multipleExpression,
				right: this.additive()
			};
		}

		throw new Error("additive: expect token: ; ? : ) , + -");
	},

	multiplicative: function () {
		if (!this.isString() 
			&& !this.isNumber() 
			&& !this.isIdentifier() 
			&& !this.isLeftParenthesis()) {
			throw new Error("multiplicative: expect token: string number identifier (");
		}

		var factor = this.primary();

		if (this.isAdditiveOperator()
			|| this.isSemicolon() 
			|| this.isQuestionMark()
			|| this.isColon()
			|| this.isRightParentthesis()
			|| this.isComma()) {
			return factor;
		}

		if (this.isMultiplicativeOperator()) {
			var token = this.tokens.shift();

			return {
				type: AST.TYPE.DYADIC_EXPRESSION,
				operator: token.value,
				left: factor,
				right: this.multiplicative()
			};
		}

		throw new Error("multiplicative: expect token: ; ? : ) , + - * /");
	},

	primary: function () {
		if (this.isNumber()) {
			var token = this.tokens.shift();
			return {
				type: AST.TYPE.NUMBER,
				value: token.value
			};

		} else if (this.isString()) {
			var token = this.tokens.shift();
			return {
				type: AST.TYPE.STRING,
				value: token.value
			};

		} else if (this.isIdentifier()) {
			var token = this.tokens.shift();

			if (!this.isLeftParenthesis()) {
				return {
					type: AST.TYPE.IDENTIFIER,
					value: token.value
				};
			}
			
			this.skip();
			
			var args = this.parseArguments();

			if (!this.isRightParentthesis()) {
				throw new Error("primary: expect token: )");
			}

			this.skip();

			return {
				type: AST.TYPE.CALL_EXPRESSION,
				identifier: token.value,
				args: args
			};

		} else if (this.isLeftParenthesis()) {
			this.skip();

			var statement = this.statement();

			if (!this.isRightParentthesis()) {
				throw new Error("primary: expect token: )");
			}

			this.skip();

			return statement;

		} else {
			throw new Error("primary: expect token: number string identifier (");
		}
	},

	parseArguments: function () {
		if (!this.isString() 
			&& !this.isNumber() 
			&& !this.isIdentifier() 
			&& !this.isLeftParenthesis()
			&& !this.isRightParentthesis()) {
			throw new Error("parseArguments: expect token: string number identifier ( )");
		}

		if (this.isRightParentthesis()) {
			return [];
		}

		var args = [];

		args.push(this.expression());

		if (this.isRightParentthesis()) {
			return args;
		}

		if (this.isComma()) {
			this.skip();

			return args.concat(this.parseArguments());
		}

		throw new Error("parseArguments: expect token: ) ,");
	},

	skip: function (step) {
		step = step || 1;

		while (step-- > 0) {
			this.tokens.shift();
		}
	},

	isAdditiveOperator: function () {
		var token = this.tokens[0];

		return token.type === Lexer.TYPE.OPERATOR 
				&& (token.value === "+" || token.value === "-");
	},

	isMultiplicativeOperator: function () {
		var token = this.tokens[0];

		return token.type === Lexer.TYPE.OPERATOR 
				&& (token.value === "*" || token.value === "/");
	},

	isColon: function () {
		var token = this.tokens[0];

		return token.type === Lexer.TYPE.COLON;
	},

	isQuestionMark: function () {
		var token = this.tokens[0];

		return token.type === Lexer.TYPE.QUESTION_MARK;
	},

	isComma: function () {
		var token = this.tokens[0];

		return token.type === Lexer.TYPE.COMMA;
	},

	isSemicolon: function () {
		var token = this.tokens[0];

		return token.type === Lexer.TYPE.SEMICOLON;
	},

	isIdentifier: function () {
		var token = this.tokens[0];

		return token.type === Lexer.TYPE.IDENTIFIER;
	},

	isString: function () {
		var token = this.tokens[0];

		return token.type === Lexer.TYPE.STRING;
	},

	isNumber: function () {
		var token = this.tokens[0];

		return token.type === Lexer.TYPE.NUMBER;
	},

	isLeftParenthesis: function () {
		var token = this.tokens[0];

		return token.type === Lexer.TYPE.PARENTHESIS && token.value === "(";
	},

	isRightParentthesis: function () {
		var token = this.tokens[0];

		return token.type === Lexer.TYPE.PARENTHESIS && token.value === ")";
	}
};

var Compile = function Compile (ast) {
	this.ast = ast;
};

Compile.prototype = {
	constructor: Compile,

	compile: function (text) {
		var self = this;

		return function (scope) {
			return self.execute(self.ast.ast(text), scope || {});
		};
	},

	execute: function (astNode, scope) {
		var ret = null;

		switch (astNode.type) {
			case AST.TYPE.IDENTIFIER:
				ret = this.getIdentifierValue(astNode, scope);
				break;

			case AST.TYPE.NUMBER:
				ret = this.getNumber(astNode, scope);
				break;

			case AST.TYPE.STRING:
				ret = this.getString(astNode, scope);
				break;

			case AST.TYPE.CALL_EXPRESSION:
				ret = this.executeCallExpression(astNode, scope);
				break;

			case AST.TYPE.CONDITION_EXPRESSION:
				ret = this.executeConditionExpression(astNode, scope);
				break;

			case AST.TYPE.DYADIC_EXPRESSION:
				ret = this.executeDyadicExpression(astNode, scope);
				break;

			case AST.TYPE.STATEMENT:
				ret = this.executeStatement(astNode, scope);
				break;

			case AST.TYPE.PROGRAM:
				ret = this.executeProgram(astNode, scope);
				break;

			default:
				throw new Error("ast node type invalid: " + astNode.type);
		}

		return ret;
	},

	executeProgram: function (astNode, scope) {
		var statements = astNode.statements;

		var ret = undefined;

		for (var i = 0, len = statements.length; i < len; ++i) {
			ret = this.execute(statements[i], scope);
		}

		return ret;
	},

	executeStatement: function (astNode, scope) {
		var expressions = astNode.expressions;

		var ret = undefined;

		for (var i = 0, len = expressions.length; i < len; ++i) {
			ret = this.execute(expressions[i], scope);
		}

		return ret;
	},

	executeCallExpression: function (astNode, scope) {
		var args = astNode.args;

		for (var i = 0, len = args.length; i < len; ++i) {
			args[i] = this.execute(args[i], scope); 
		}

		var func = scope[astNode.identifier];

		return func.apply(scope, args);
	},

	executeConditionExpression: function (astNode, scope) {
		var expressions = astNode.expressions;

		var condition  = this.execute(expressions[0], scope);
		var expression = Boolean(condition) ? expressions[1] : expressions[2];

		return this.execute(expression, scope);
	},

	executeDyadicExpression: function (astNode, scope) {
		var left  = this.execute(astNode.left, scope);
		var right = this.execute(astNode.right, scope);

		var ret = null;

		switch (astNode.operator) {
			case "+":
				ret = left + right;
				break;

			case "-":
				ret = left - right;
				break;

			case "*":
				ret = left * right;
				break;

			case "/":
				ret = left / right;
				break;

			default: 
				throw new Error("executeDyadicExpression: invalid operator " + astNode.operator);
		}

		return ret;
	},

	getIdentifierValue: function (astNode, scope) {
		return scope[astNode.value];
	},

	getNumber: function (astNode, scope) {
		return astNode.value;
	},

	getString: function (astNode, scope) {
		return astNode.value;
	}
};

var Parser = function Parser() {
	this.lexer   = new Lexer();
	this.ast     = new AST(this.lexer);
	this.astCompile = new Compile(this.ast); 
};

Parser.prototype = {
	constructor: Parser,

	parse: function (text) {
		return this.astCompile.compile(text)
	}
};

window.Lexer   = Lexer;
window.AST     = AST;
window.Compile = Compile;
window.Parser  = Parser;

})(window, document);