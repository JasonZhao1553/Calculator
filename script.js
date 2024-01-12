let displayStr = "";

const calculatorInput = document.getElementById('calculator_interface');
const calculatorDisplay = document.getElementById('display');

function lex(displayStr){
    let tokens = new Array();
    let regex = /\s*([()+*/^-]|[-]?\d+(\.\d+)?)/g;

    while ((match = regex.exec(displayStr)) !== null){
        tokens.push(match[1])
    }

    return tokens;
}

function parse(tokens){
    let index = 0;
    function match_token(token){
        if (tokens[index] && tokens[index] == token){
            index++;
        }

        else{
            throw new Error("Unexpected Token");
        }
    }

    function peek(){
        return tokens[index] ? tokens[index] : null;
    }

    function is_number(token){
        return !isNaN(token)
    }

    function add(x, y){
        return (x+y);
    }

    function subtract(x, y){
        return (x-y);
    }

    function multiply(x, y){
        return x * y;
    }

    function divide(x, y){
        return x / y;
    }

    function exponent(x, y){
        return x ** y;
    }

    function expr(){
        let x = AS();

        while (peek() == "+" || peek() == ("-")){
            console.log("+-");
            let operator = peek();
            index++;
            let y = AS();

            if (operator == "+"){
                return add(x,y);
            }

            else{
                return subtract(x, y);
            }
        }

        return x;
    }

    function AS(){
        let x = MD();

        while(peek() == "*" || peek() == "/"){
            let operator = peek();
            index++;
            let y = MD();

            if (operator == "*"){
                return multiply(x,y);
            }

            else{
                return divide(x, y);
            }
        }

        return x;
    }

    function MD(){
        let x = exp();

        if (peek() == "^"){
            index++;
            let y = exp();
            return exponent(x, y);
        }

        return x;
    }

    function exp(){
        let x = simple_expr();

        if (peek() == "^"){
            index++;
            let y = exp();
            return exponent(x, y);
        }

        return x;
    }

    function simple_expr(){
        if (is_number(tokens[index])){
            index++;
            return parseFloat(tokens[index - 1]);
        }

        else if (peek() == "("){
            match_token("(");
            const result = expr();
            match_token(")");
            return result;
        }

        else{
            throw new Error ("failed at last stage");
        }
    }

    return expr();
}

function evaluate(tokens){
    if (tokens.length == 1){
        return tokens[0];
    }

    let rtrn = ""
    for (let i = 0; tokens.length > i ; i++){
        rtrn += tokens[i];
    }

    return rtrn;
}

function operate(displayStr){
    let tokens = lex(displayStr);
    return parse(tokens);
}

calculatorInput.addEventListener('click', (btn) =>{
    if (calculatorDisplay.textContent == "Error"){
        displayStr = "";
    }

    if (btn.target.value == "c"){
        displayStr = "";
    }

    else if (btn.target.value == "="){
        if (displayStr == ""){
            return;
        }
        displayStr = operate(displayStr);
    }

    else if (btn.target.value == undefined){
        return;
    }

    else{
        displayStr += btn.target.value;

    }

    calculatorDisplay.textContent = displayStr;
});

