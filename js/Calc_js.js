const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
};

let n1, n2, operation;

window.addEventListener("load", () => {
    operation = getRandomOperation();
    n1 = getRandomIntInclusive(1, 10);
    n2 = getRandomIntInclusive(1, 10);

    // Display the operation symbol based on the randomly selected operation.
    let operationSymbol;
    switch (operation) {
        case "add":
            operationSymbol = "+";
            break;
        case "subtract":
            operationSymbol = "-";
            break;
        case "multiply":
            operationSymbol = "*";
            break;
        case "divide":
            operationSymbol = "/";
            break;
    }

    document.getElementById("quest").innerText = `${n1} ${operationSymbol} ${n2} = `;

    document.getElementById("form1").addEventListener("submit", (e) => {
        e.preventDefault();


        let answer = document.getElementById("answer");
        let result;

        switch (operation) {
            case "add":
                result = n1 + n2;
                break;
            case "subtract":
                result = n1 - n2;
                break;
            case "multiply":
                result = n1 * n2;
                break;
            case "divide":
                result = n1 / n2;
                break;
        }



        if (parseFloat(answer.value) === result) {
            document.body.classList.add("green-background");
            setTimeout(() => {
                document.body.classList.remove("green-background");
                window.location.reload();
            }, 1000)
        } else {
            document.body.style.backgroundColor = "red";
            answer.value = "";
            setTimeout(()=>{
                window.location.reload();
            },1500)
        }
    });
});

const getRandomOperation = () => {
    const operations = ["add", "subtract", "multiply", "divide"];
    const randomIndex = Math.floor(Math.random() * operations.length);
    return operations[randomIndex];
};