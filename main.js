// ------------------- Words -------------------

const easyWords = [
    "Hello",
    "Code",
    "Town",
    "Test",
    "Task",
    "Rust",
    "Funny",
    "Roles",
    "Play",
    "Book",
    "Tree",
    "Sun",
    "Car",
    "Fish",
    "Run",
    "Game",
    "Chat",
    "Good",
    "Note",
    "Ball",
];

const normalWords = [
    "Country",
    "Github",
    "Python",
    "Coding",
    "Testing",
    "Twitter",
    "Youtube",
    "Working",
    "Leetcode",
    "Styling",
    "Internet",
    "Scala",
    "Library",
    "Server",
    "Backend",
    "Frontend",
    "Browser",
    "Design",
    "Control",
    "Package",
];

const hardWords = [
    "Programming",
    "Javascript",
    "Linkedin",
    "Paradigm",
    "Cascade",
    "Dependencies",
    "Documentation",
    "Destructuring",
    "Integration",
    "Optimization",
    "Architecture",
    "Deployment",
    "Automation",
    "Repository",
    "Versioning",
    "Refactoring",
    "Encapsulation",
    "Polymorphism",
    "Inheritance",
    "Abstraction",
];

// ------------------- Settings -------------------

const levels = {
    Easy: 5,
    Normal: 3,
    Hard: 2,
};

const beginningBuff = 3; // extra seconds for first attempt

let words = [...normalWords]; // clone to avoid mutation
let timer = null; // store current interval
let currentBuff = beginningBuff; // to track first attempt buff

let DefaultLevelName = "Normal";
let DefaultSeconds = levels[DefaultLevelName];

// ------------------- DOM Elements -------------------

const startButton = document.querySelector(".start");
const lvlSpan = document.querySelector(".message .lvl");
const secondsSpan = document.querySelector(".message .seconds");
const theWord = document.querySelector(".the-word");
const upComingWords = document.querySelector(".upcoming-words");
const input = document.querySelector(".input");
const timeLeftSpan = document.querySelector(".time span");
const scoreGot = document.querySelector(".score .got");
const scoreTotal = document.querySelector(".score .total");
const finishMessage = document.querySelector(".finish");
const diffBtn = document.querySelector(".change-lvl");
const instructions = document.querySelector(".instructions");

// ------------------- Initialization -------------------

lvlSpan.textContent = DefaultLevelName;
secondsSpan.textContent = DefaultSeconds;
timeLeftSpan.textContent = DefaultSeconds;
scoreTotal.textContent = words.length;

// ------------------- Difficulty Switch -------------------

let levelIndex = 1;
const levelNames = Object.keys(levels);

diffBtn.addEventListener("click", () => {
    levelIndex = (levelIndex + 1) % levelNames.length;
    const selected = levelNames[levelIndex];

    lvlSpan.textContent = selected;
    secondsSpan.textContent = levels[selected];
    timeLeftSpan.textContent = levels[selected];

    switch (selected) {
        case "Easy":
            words = [...easyWords];
            break;
        case "Normal":
            words = [...normalWords];
            break;
        case "Hard":
            words = [...hardWords];
            break;
    }
    scoreTotal.textContent = words.length;
});

// ------------------- Disable Paste -------------------

input.onpaste = () => false;

// ------------------- Start Game -------------------

startButton.addEventListener("click", () => {
    startButton.remove();
    diffBtn.remove();
    input.focus();
    timeLeftSpan.parentElement.classList.remove("buff");
    instructions.remove();
    genWords();
});

// ------------------- Generate Words -------------------

function genWords() {
    if (words.length === 0) return;

    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words.splice(randomIndex, 1)[0]; // remove from array safely

    theWord.textContent = randomWord;

    // upcoming words
    upComingWords.innerHTML = "";
    words.forEach((word) => {
        const div = document.createElement("div");
        div.textContent = word;
        upComingWords.appendChild(div);
    });

    startPlay();
}

// ------------------- Timer / Gameplay -------------------

function startPlay() {
    clearInterval(timer); // prevent multiple intervals

    let timeLeft = parseInt(secondsSpan.textContent) + currentBuff;
    currentBuff = 0; // reset buff after first use
    timeLeftSpan.textContent = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timeLeftSpan.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);

            if (
                theWord.textContent.toLowerCase() ===
                input.value.toLowerCase().trim()
            ) {
                input.value = "";
                scoreGot.textContent = parseInt(scoreGot.textContent) + 1;

                if (words.length > 0) {
                    genWords();
                } else {
                    finishGame(
                        "good",
                        "Congrats",
                        addScore(parseInt(scoreGot.textContent))
                    );
                    upComingWords.remove();
                }
            } else {
                finishGame(
                    "bad",
                    "Game Over",
                    addScore(parseInt(scoreGot.textContent))
                );
            }
        }
    }, 1000);
}

// ------------------- High Score -------------------

function addScore(currentScore) {
    const storedScore = parseInt(window.localStorage.getItem("Score")) || 0;
    if (currentScore > storedScore) {
        window.localStorage.setItem("Score", currentScore);
        return [true, storedScore]; // breakScore for finishGame
    }
}

// ------------------- Finish Game -------------------

function finishGame(status, message, breakScore = [false, null]) {
    const span = document.createElement("span");
    span.className = status;

    if (breakScore[0]) {
        span.textContent = `${message}. You Have A New High Score! Previous: ${breakScore[1]}`;
    } else {
        span.textContent = message;
    }

    finishMessage.appendChild(span);
    let restart = document.createElement("button");
    restart.className = "restart";
    restart.append(document.createTextNode("Restart"));
    finishMessage.append(restart);
    restart.onclick = () => {
        window.location.reload();
    };
}
