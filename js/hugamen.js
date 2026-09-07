
const wordE1 = document.getElementById('word');
const wrongLettersE1 = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

const figureParts = document.querySelectorAll('.figure-part');
const keyboard = document.getElementById('keyboard');

const words = ['apple', 'banana', 'cherry', 'grape'];

let selectedWord = words[Math.floor(Math.random() * words.length)];

const correctLetters = [];
const wrongLetters = [];

// Show hidden word
const displayWord = () => {
  wordE1.innerHTML = `
    ${selectedWord
      .split('')
      .map(
        letter => `
        <span class="letter">
        ${correctLetters.includes(letter) ? letter : ''}
        </span>
        `
      )
      .join('')}
    `;

  const innerWord = wordE1.innerText.replace(/\n/g, '').replace(/\s/g, '');

  if (innerWord === selectedWord) {
    finalMessage.innerText = 'Congratulation 😃';
    popup.style.display = 'flex';
  }
};

// Update the wrong letters
const updateWrongLetterE1 = () => {
  // Display wrong letters
  wrongLettersE1.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong Letters:</p>' : ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`).join('')}
    `;

  // Display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = 'block';
    } else {
      part.style.display = 'none';
    }
  });

  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = 'You Lost,🤐';
    popup.style.display = 'flex';
  }
};


const showNotification = () => {
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
};

// Shared by both the physical keyboard and the on-screen keyboard (mobile has no keydown source).
const guessLetter = letter => {
  if (correctLetters.includes(letter) || wrongLetters.includes(letter)) {
    showNotification();
    return;
  }

  if (selectedWord.includes(letter)) {
    correctLetters.push(letter);
    displayWord();
  } else {
    wrongLetters.push(letter);
    updateWrongLetterE1();
  }

  updateKeyboardState();
};

const buildKeyboard = () => {
  keyboard.innerHTML = '';
  for (let code = 97; code <= 122; code++) {
    const letter = String.fromCharCode(code);
    const key = document.createElement('button');
    key.type = 'button';
    key.textContent = letter;
    key.addEventListener('click', () => guessLetter(letter));
    keyboard.appendChild(key);
  }
};

const updateKeyboardState = () => {
  keyboard.querySelectorAll('button').forEach(key => {
    const letter = key.textContent;
    key.disabled = correctLetters.includes(letter) || wrongLetters.includes(letter);
  });
};

window.addEventListener('keydown', e => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    guessLetter(e.key.toLowerCase());
  }
});

playAgainBtn.addEventListener('click', () => {

  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = words[Math.floor(Math.random() * words.length)];

  displayWord();

  updateWrongLetterE1();

  updateKeyboardState();

  popup.style.display = 'none';
});

buildKeyboard();
displayWord();

