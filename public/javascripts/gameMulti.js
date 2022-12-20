// const index = require("../javascripts/index")

const grid1 = document.querySelector("#grid1");
const grid2 = document.querySelector("#grid2");
const grid3 = document.querySelector("#grid3");
const grid4 = document.querySelector("#grid4");
const grid5 = document.querySelector("#grid5");
const grid6 = document.querySelector("#grid6");
const grid7 = document.querySelector("#grid7");
const grid8 = document.querySelector("#grid8");
const grid9 = document.querySelector("#grid9");
const zero = {
    modalZero: document.querySelector(".modalZero"),
    nextZero: document.querySelector(".nextZero"),
    zeroResult: document.querySelector(".zeroResult"),
    clickedZero: document.querySelector(".clickedZero"),
    playerZeroWins: document.querySelector(".playerZeroWins"),
    zeroP1: document.querySelector(".zeroP1"),
    initialScore: 0
};
const x = {
    modalX: document.querySelector(".modalX"),
    nextX: document.querySelector(".nextX"),
    xResult: document.querySelector(".xResult"),
    clickedX: document.querySelector(".clickedX"),
    playerXWins: document.querySelector(".playerXWins"),
    xP1: document.querySelector(".xP1"),
    initialScore: 0
};
const ties = {
    modalTies: document.querySelector(".modalTies"),
    nextTies: document.querySelector(".nextTies"),
    tiesResult: document.querySelector(".tiesResult"),
    initialScore: 0
};
const restart = {
    modalRestart: document.querySelector(".modalRestart"),
    restartBtn: document.querySelector(".restart"),
    cancel: document.querySelector(".cancel"),
    restartConfirm: document.querySelector(".restartConfirm")
};
const overlay = document.querySelector(".overlay");
const turnDisplayImg = document.querySelector("#turnDisplayImg");
const gridElement = document.querySelectorAll(".grid");
const quit = document.querySelectorAll(".quit");

let xScore = JSON.parse(sessionStorage.getItem("autosaveX"));
let zeroScore = JSON.parse(sessionStorage.getItem("autosaveZero"));
let tiesScore = JSON.parse(sessionStorage.getItem("autosaveTies"));
let gameCount = JSON.parse(sessionStorage.getItem("autosaveGameCount"));
let initialTurn = JSON.parse(sessionStorage.getItem("autosaveInitialTurn"));

if (xScore === null) {
    xScore = 0;
};
if (zeroScore === null) {
    zeroScore = 0;
};
if (tiesScore === null) {
    tiesScore = 0;
};
if (gameCount === null) {
    gameCount = 0;
};
if (initialTurn === null) {
    initialTurn = 0;
};
x.xResult.innerHTML = xScore;
zero.zeroResult.innerHTML = zeroScore;
ties.tiesResult.innerHTML = tiesScore;


// ***********************************************
// **************FUNCTIONS************************
// ***********************************************

const turnDisplaySwitch = function () {
    if (initialTurn % 2 === 0) {
        turnDisplayImg.setAttribute("src", "/starter-code/assets/icon-x-grey.svg");
    } else {
        turnDisplayImg.setAttribute("src", "/starter-code/assets/icon-o-grey.svg");
    }
};

const markSelectEnter = function () {
    if (initialTurn % 2 === 0) {
        this.classList.replace("normal", "enterX");
    } else {
        this.classList.replace("normal", "enterZero");
    }
};

const markSelectLeave = function () {
    this.classList.replace("enterX", "normal");
    this.classList.replace("enterZero", "normal");
};

const winRunner = () => {
    const xWin = document.querySelector(".xWin");
    const zeroWin = document.querySelector(".zeroWin");
    overlay.classList.remove("hidden");
    if (xWin) {
        x.modalX.classList.remove("hidden");
        xScore++;
        sessionStorage.setItem("autosaveX", JSON.stringify(xScore));
        x.xResult.innerHTML = xScore;
        gameCount++;
        sessionStorage.setItem("autosaveGameCount", JSON.stringify(gameCount));
        if (xWin && x.xP1) {
            x.playerXWins.innerHTML = "PLAYER 1 WINS!";
        } else {
            x.playerXWins.innerHTML = "PLAYER 2 WINS!";
        }
    } else if (zeroWin) {
        zero.modalZero.classList.remove("hidden");
        zeroScore++;
        sessionStorage.setItem("autosaveZero", JSON.stringify(zeroScore));
        zero.zeroResult.innerHTML = zeroScore;
        gameCount++;
        sessionStorage.setItem("autosaveGameCount", JSON.stringify(gameCount));
        if (zeroWin && zero.zeroP1) {
            zero.playerZeroWins.innerHTML = "PLAYER 1 WINS!";
        } else {
            zero.playerZeroWins.innerHTML = "PLAYER 2 WINS!";
        }
    }
};

function winScenarios(gridA, gridB, gridC) {
    try {
        if (gridA.classList[1] === "clickedX" && gridB.classList[1] === "clickedX" && gridC.classList[1] === "clickedX") {
            gridA.classList.replace("clickedX", "xWin");
            gridB.classList.replace("clickedX", "xWin");
            gridC.classList.replace("clickedX", "xWin");
            setTimeout(() => {
                winRunner();
            }, 300);
        } else if (gridA.classList[1] === "clickedZero" && gridB.classList[1] === "clickedZero" && gridC.classList[1] === "clickedZero") {
            gridA.classList.replace("clickedZero", "zeroWin");
            gridB.classList.replace("clickedZero", "zeroWin");
            gridC.classList.replace("clickedZero", "zeroWin");
            setTimeout(() => {
                winRunner();
            }, 300);
        }
    } catch (e) {
        console.log(e);
    }
};

const tiesRunner = () => {
    const clicked = document.querySelectorAll(".clicked").length;
    const xWin = document.querySelector(".xWin");
    const zeroWin = document.querySelector(".zeroWin");
    if (!zeroWin && clicked === 9 && !xWin && clicked === 9) {
        ties.modalTies.classList.remove("hidden");
        overlay.classList.remove("hidden");
        tiesScore++;
        sessionStorage.setItem("autosaveTies", JSON.stringify(tiesScore));
        ties.tiesResult.innerHTML = tiesScore;
        gameCount++;
        sessionStorage.setItem("autosaveGameCount", JSON.stringify(gameCount));
    }
};
function tiesRunners() {
    setTimeout(() => {
        tiesRunner();
    }, 300);
}

function clicker(gridInput) {
    gridInput.classList.replace("enterX", "clickedX");
    gridInput.classList.add("clicked");
    gridInput.classList.replace("enterZero", "clickedZero");
    gridInput.setAttribute("disabled", "true");
    initialTurn++;
    turnDisplaySwitch();
};


// *******************************************************
// *******************************************************

grid1.addEventListener("mouseenter", markSelectEnter);
grid1.addEventListener("mouseleave", markSelectLeave);
grid1.addEventListener("click", () => {
    clicker(grid1);
    tiesRunners();
    winScenarios(grid1, grid2, grid3);
    winScenarios(grid1, grid4, grid7);
    winScenarios(grid1, grid5, grid9);
});



grid2.addEventListener("mouseenter", markSelectEnter);
grid2.addEventListener("mouseleave", markSelectLeave);
grid2.addEventListener("click", () => {
    clicker(grid2);
    winScenarios(grid1, grid2, grid3);
    winScenarios(grid2, grid5, grid8);
    tiesRunners();
});


// *********
grid3.addEventListener("mouseenter", markSelectEnter);
grid3.addEventListener("mouseleave", markSelectLeave);
grid3.addEventListener("click", () => {
    clicker(grid3);
    winScenarios(grid1, grid2, grid3);
    winScenarios(grid3, grid6, grid9);
    winScenarios(grid3, grid5, grid7);
    tiesRunners();
});


// *******
grid4.addEventListener("mouseenter", markSelectEnter);
grid4.addEventListener("mouseleave", markSelectLeave);
grid4.addEventListener("click", () => {
    clicker(grid4);
    winScenarios(grid1, grid4, grid7);
    winScenarios(grid4, grid5, grid6);
    tiesRunners();
});


// ********
grid5.addEventListener("mouseenter", markSelectEnter);
grid5.addEventListener("mouseleave", markSelectLeave);
grid5.addEventListener("click", () => {
    clicker(grid5);
    winScenarios(grid2, grid5, grid8);
    winScenarios(grid1, grid5, grid9);
    winScenarios(grid3, grid5, grid7);
    winScenarios(grid4, grid5, grid6);
    tiesRunners();
});


// ********
grid6.addEventListener("mouseenter", markSelectEnter);
grid6.addEventListener("mouseleave", markSelectLeave);
grid6.addEventListener("click", () => {
    clicker(grid6);
    winScenarios(grid3, grid6, grid9);
    winScenarios(grid4, grid5, grid6);
    tiesRunners();
});


// *********
grid7.addEventListener("mouseenter", markSelectEnter);
grid7.addEventListener("mouseleave", markSelectLeave);
grid7.addEventListener("click", () => {
    clicker(grid7);
    winScenarios(grid1, grid4, grid7);
    winScenarios(grid3, grid5, grid7);
    winScenarios(grid7, grid8, grid9);
    tiesRunners();
});


// *********
grid8.addEventListener("mouseenter", markSelectEnter);
grid8.addEventListener("mouseleave", markSelectLeave);
grid8.addEventListener("click", () => {
    clicker(grid8);
    winScenarios(grid7, grid8, grid9);
    winScenarios(grid2, grid5, grid8);
    tiesRunners();
});


// *********
grid9.addEventListener("mouseenter", markSelectEnter);
grid9.addEventListener("mouseleave", markSelectLeave);
grid9.addEventListener("click", () => {
    clicker(grid9);
    winScenarios(grid1, grid5, grid9);
    winScenarios(grid3, grid6, grid9);
    winScenarios(grid7, grid8, grid9);
    tiesRunners();
});



const cleanup = () => {
    if (gameCount % 2 === 0) {
        initialTurn = 0;
        sessionStorage.setItem("autosaveInitialTurn", JSON.stringify(initialTurn));
    } else {
        initialTurn = 1;
        sessionStorage.setItem("autosaveInitialTurn", JSON.stringify(initialTurn));
    }
    for (let item of gridElement) {
        item.className = "grid normal"
    };
    grid1.removeAttribute("disabled");
    grid2.removeAttribute("disabled");
    grid3.removeAttribute("disabled");
    grid4.removeAttribute("disabled");
    grid5.removeAttribute("disabled");
    grid6.removeAttribute("disabled");
    grid7.removeAttribute("disabled");
    grid8.removeAttribute("disabled");
    grid9.removeAttribute("disabled");
};

// ***************************************************

const nextRound = () => {
    overlay.classList.toggle("hidden");
    cleanup();
    turnDisplaySwitch();
};

x.nextX.addEventListener("click", (e) => {
    e.preventDefault();
    x.modalX.classList.toggle("hidden");
    nextRound();
});

zero.nextZero.addEventListener("click", (e) => {
    e.preventDefault();
    zero.modalZero.classList.toggle("hidden");
    nextRound();
});

ties.nextTies.addEventListener("click", (e) => {
    e.preventDefault();
    ties.modalTies.classList.toggle("hidden");
    nextRound();
});
quit[0].addEventListener("click", () => {
    sessionStorage.clear();
})
quit[1].addEventListener("click", () => {
    sessionStorage.clear();
})
quit[2].addEventListener("click", () => {
    sessionStorage.clear();
})

restart.restartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    restart.modalRestart.classList.remove("hidden");
    overlay.classList.remove("hidden");
});

restart.cancel.addEventListener("click", (e) => {
    e.preventDefault();
    restart.modalRestart.classList.add("hidden");
    overlay.classList.add("hidden");
});

restart.restartConfirm.addEventListener("click", () => {
    sessionStorage.clear();
})