(() => {
  "use strict";

  const OPERATIONS = {
    add: { symbol: "+", calculate: (a, b) => a + b },
    subtract: { symbol: "-", calculate: (a, b) => a - b },
    multiply: { symbol: "*", calculate: (a, b) => a * b },
    divide: { symbol: "/", calculate: (a, b) => a / b },
  };

  const getRandomIntInclusive = (min, max) => {
    const lower = Math.ceil(min);
    const upper = Math.floor(max);
    return Math.floor(Math.random() * (upper - lower + 1) + lower);
  };

  const pickOperation = () => {
    const keys = Object.keys(OPERATIONS);
    return keys[Math.floor(Math.random() * keys.length)];
  };

  const buildQuestion = () => {
    const operation = pickOperation();

    if (operation === "divide") {
      // Build the pair so the division always lands on a whole number.
      const n2 = getRandomIntInclusive(1, 10);
      const quotient = getRandomIntInclusive(1, 10);
      return { operation, n1: n2 * quotient, n2 };
    }

    return {
      operation,
      n1: getRandomIntInclusive(1, 10),
      n2: getRandomIntInclusive(1, 10),
    };
  };

  const flash = (element, className, duration) =>
    new Promise((resolve) => {
      element.classList.add(className);
      setTimeout(() => {
        element.classList.remove(className);
        resolve();
      }, duration);
    });

  const { operation, n1, n2 } = buildQuestion();
  const { symbol, calculate } = OPERATIONS[operation];
  const correctAnswer = calculate(n1, n2);

  document.getElementById("quest").innerText = `${n1} ${symbol} ${n2} = `;

  document.getElementById("form1").addEventListener("submit", async (e) => {
    e.preventDefault();

    const answerField = document.getElementById("answer");
    const isCorrect = parseFloat(answerField.value) === correctAnswer;

    if (isCorrect) {
      await flash(document.body, "green-background", 1000);
      window.location.reload();
    } else {
      document.body.style.backgroundColor = "red";
      answerField.value = "";
      setTimeout(() => {
        document.body.style.backgroundColor = "white";
      }, 1500);
    }
  });
})();
