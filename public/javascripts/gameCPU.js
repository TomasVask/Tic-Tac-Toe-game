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
};
const x = {
    modalX: document.querySelector(".modalX"),
    nextX: document.querySelector(".nextX"),
    xResult: document.querySelector(".xResult"),
    clickedX: document.querySelector(".clickedX"),
    playerXWins: document.querySelector(".playerXWins"),
    xP1: document.querySelector(".xP1"),
};
const ties = {
    modalTies: document.querySelector(".modalTies"),
    nextTies: document.querySelector(".nextTies"),
    tiesResult: document.querySelector(".tiesResult"),
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


let gameFinished = false;
let cpuStop = false;

// ***********************************************
// **************FUNCTIONS************************
// ***********************************************

const turnDisplaySwitch = function () { //switching icon of every turn
    if (initialTurn % 2 === 0) {
        turnDisplayImg.setAttribute("src", "/starter-code/assets/icon-x-grey.svg");
    } else {
        turnDisplayImg.setAttribute("src", "/starter-code/assets/icon-o-grey.svg");
    }
};

const markSelectEnter = function () {
    if (x.xP1) {
        this.classList.replace("normal", "enterX");
    } else if (zero.zeroP1) {
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
            x.playerXWins.innerHTML = "YOU WON!";
        } else {
            x.playerXWins.innerHTML = "OH NO, YOU LOST...";
        }
    } else if (zeroWin) {
        zero.modalZero.classList.remove("hidden");
        zeroScore++;
        sessionStorage.setItem("autosaveZero", JSON.stringify(zeroScore));
        zero.zeroResult.innerHTML = zeroScore;
        gameCount++;
        sessionStorage.setItem("autosaveGameCount", JSON.stringify(gameCount));
        if (zeroWin && zero.zeroP1) {
            zero.playerZeroWins.innerHTML = "YOU WON!";
        } else {
            zero.playerZeroWins.innerHTML = "OH NO, YOU LOST...";
        }
    }
};

function winScenarios(gridA, gridB, gridC) {
    if (gridA.classList[1] === "clickedX" && gridB.classList[1] === "clickedX" && gridC.classList[1] === "clickedX") {
        gridA.classList.replace("clickedX", "xWin");
        gridB.classList.replace("clickedX", "xWin");
        gridC.classList.replace("clickedX", "xWin");
        gameFinished = true;
        setTimeout(() => {
            winRunner()
        }, 300);
    } else if (gridA.classList[1] === "clickedZero" && gridB.classList[1] === "clickedZero" && gridC.classList[1] === "clickedZero") {
        gridA.classList.replace("clickedZero", "zeroWin");
        gridB.classList.replace("clickedZero", "zeroWin");
        gridC.classList.replace("clickedZero", "zeroWin");
        gameFinished = true;
        setTimeout(() => {
            winRunner()
        }, 300);
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
        gameFinished = true;
        gameCount++;
        sessionStorage.setItem("autosaveGameCount", JSON.stringify(gameCount));
    }
};

const gameCheck = function () {
    winScenarios(grid1, grid2, grid3);
    winScenarios(grid1, grid4, grid7);
    winScenarios(grid1, grid5, grid9);
    winScenarios(grid2, grid5, grid8);
    winScenarios(grid3, grid6, grid9);
    winScenarios(grid3, grid5, grid7);
    winScenarios(grid4, grid5, grid6);
    winScenarios(grid7, grid8, grid9);
    tiesRunner();
};

// *******************************************************
// *******************************************************
let excludeArray = []; // excluding randoms that are selected

const getRandomWithExclude = (excludeArray) => {
    const randomNumber = Math.floor(Math.random() * (9 - excludeArray.length));
    return randomNumber + excludeArray.sort((a, b) => a - b).reduce((acc, element) => {
        return randomNumber >= element - acc ? acc + 1 : acc
    }, 0);
}

const cpuClickX = function () {
    const result = getRandomWithExclude(excludeArray);
    excludeArray.push(result);
    let newGrid = gridElement[result];
    if (newGrid.classList) {
        newGrid.className = "grid clickedX clicked";
    };
    newGrid.setAttribute("disabled", "true");
    initialTurn++;
    turnDisplaySwitch();
    gameCheck();
    // console.log(`RANDOM -- NextTurn ${initialTurn}, CPU added: ${excludeArray}`);
};

const cpuClickZero = async function () {
    const result = getRandomWithExclude(excludeArray);
    excludeArray.push(result);
    let newGrid = gridElement[result];
    if (newGrid.classList) {
        newGrid.className = "grid clickedZero clicked";
    };
    newGrid.setAttribute("disabled", "true");
    initialTurn++;
    turnDisplaySwitch();
    gameCheck();
    // console.log(`RANDOM -- NextTurn ${initialTurn}, CPU added: ${excludeArray}`);
}

const cpuRandomClicker = function () {
    if (x.xP1) {
        setTimeout(() => {
            if (initialTurn % 2 === 1 && !gameFinished) {
                cpuClickZero();
            };
        }, 300);
    } else
        if (zero.zeroP1) {
            setTimeout(() => {
                if (initialTurn % 2 === 0 && !gameFinished) {
                    cpuClickX();
                };
            }, 300);
        }
};

const cpuActiveClicker = function (input) {
    const array = [...gridElement]
    const index = array.indexOf(input)
    if (!excludeArray.includes(index)) {
        excludeArray.push(index);
    };
    if (x.xP1) {
        input.className = "grid clickedZero clicked";
    } else {
        input.className = "grid clickedX clicked";
    };
    input.setAttribute("disabled", "true");
    initialTurn++;
    turnDisplaySwitch();
    cpuStop = true;
    gameCheck();
    // console.log(`ACTIVE -- NextTurn ${initialTurn}, CPU added: ${excludeArray}`);
};

function cpuScenarios(grA, grB, grC, manual, cpu) {
    if (grA.classList[1] === cpu && grB.classList[1] === cpu && grC.classList[1] !== manual
        || grA.classList[1] === cpu && grC.classList[1] === cpu && grB.classList[1] !== manual
        || grB.classList[1] === cpu && grC.classList[1] === cpu && grA.classList[1] !== manual) {
        if (grA.classList[1] === cpu && grB.classList[1] === cpu) {
            setTimeout(() => {
                if (!cpuStop && !gameFinished) {
                    cpuActiveClicker(grC);
                };
            }, 270);
        } else if (grA.classList[1] === cpu && grC.classList[1] === cpu) {
            setTimeout(() => {
                if (!cpuStop && !gameFinished) {
                    cpuActiveClicker(grB);
                };
            }, 270);
        } else if (grB.classList[1] === cpu && grC.classList[1] === cpu) {
            setTimeout(() => {
                if (!cpuStop && !gameFinished) {
                    cpuActiveClicker(grA);
                };
            }, 270);
        }
    } else if (grA.classList[1] === manual && grB.classList[1] === manual && grC.classList[1] !== cpu
        || grA.classList[1] === manual && grC.classList[1] === manual && grB.classList[1] !== cpu
        || grB.classList[1] === manual && grC.classList[1] === manual && grA.classList[1] !== cpu) {
        if (grA.classList[1] === manual && grB.classList[1] === manual) {
            setTimeout(() => {
                if (!cpuStop && !gameFinished) {
                    cpuActiveClicker(grC);
                };
            }, 290);

        } else if (grA.classList[1] === manual && grC.classList[1] === manual) {
            setTimeout(() => {
                if (!cpuStop && !gameFinished) {
                    cpuActiveClicker(grB);
                };
            }, 290);
        } else if (grB.classList[1] === manual && grC.classList[1] === manual) {
            setTimeout(() => {
                if (!cpuStop && !gameFinished) {
                    cpuActiveClicker(grA);
                };
            }, 290);
        };
    } else {
        cpuRandomClicker();
    }
};

const cpuRunner = function () {
    if (x.xP1) {
        cpuScenarios(grid1, grid2, grid3, "clickedX", "clickedZero");
        cpuScenarios(grid1, grid4, grid7, "clickedX", "clickedZero");
        cpuScenarios(grid1, grid5, grid9, "clickedX", "clickedZero");
        cpuScenarios(grid2, grid5, grid8, "clickedX", "clickedZero");
        cpuScenarios(grid3, grid6, grid9, "clickedX", "clickedZero");
        cpuScenarios(grid3, grid5, grid7, "clickedX", "clickedZero");
        cpuScenarios(grid4, grid5, grid6, "clickedX", "clickedZero");
        cpuScenarios(grid7, grid8, grid9, "clickedX", "clickedZero");
    } else {
        cpuScenarios(grid1, grid2, grid3, "clickedZero", "clickedX");
        cpuScenarios(grid1, grid4, grid7, "clickedZero", "clickedX");
        cpuScenarios(grid1, grid5, grid9, "clickedZero", "clickedX");
        cpuScenarios(grid2, grid5, grid8, "clickedZero", "clickedX");
        cpuScenarios(grid3, grid6, grid9, "clickedZero", "clickedX");
        cpuScenarios(grid3, grid5, grid7, "clickedZero", "clickedX");
        cpuScenarios(grid4, grid5, grid6, "clickedZero", "clickedX");
        cpuScenarios(grid7, grid8, grid9, "clickedZero", "clickedX");
    }
};
cpuRunner();


function manualClicker(gridInput) {
    gridInput.classList.replace("enterX", "clickedX");
    gridInput.classList.add("clicked");
    gridInput.classList.replace("enterZero", "clickedZero");
    const array = [...gridElement];
    const index = array.indexOf(gridInput);
    if (!excludeArray.includes(index)) {
        excludeArray.push(index);
    };
    gridInput.setAttribute("disabled", "true");
    initialTurn++;
    turnDisplaySwitch();
    cpuStop = false;
    // console.log(`user -- NextTurn ${initialTurn}, USER added: ${excludeArray}`);
};

grid1.addEventListener("mouseenter", markSelectEnter);
grid1.addEventListener("mouseleave", markSelectLeave);
grid1.addEventListener("click", () => {
    manualClicker(grid1);
    winScenarios(grid1, grid2, grid3);
    winScenarios(grid1, grid4, grid7);
    winScenarios(grid1, grid5, grid9);
    tiesRunner();
    cpuRunner();
});


// *********
grid2.addEventListener("mouseenter", markSelectEnter);
grid2.addEventListener("mouseleave", markSelectLeave);
grid2.addEventListener("click", () => {
    manualClicker(grid2);
    winScenarios(grid1, grid2, grid3);
    winScenarios(grid2, grid5, grid8);
    tiesRunner();
    cpuRunner();
});


// *********
grid3.addEventListener("mouseenter", markSelectEnter);
grid3.addEventListener("mouseleave", markSelectLeave);
grid3.addEventListener("click", () => {
    manualClicker(grid3);
    winScenarios(grid1, grid2, grid3);
    winScenarios(grid3, grid6, grid9);
    winScenarios(grid3, grid5, grid7);
    tiesRunner();
    cpuRunner();
});


// *******
grid4.addEventListener("mouseenter", markSelectEnter);
grid4.addEventListener("mouseleave", markSelectLeave);
grid4.addEventListener("click", () => {
    manualClicker(grid4);
    winScenarios(grid1, grid4, grid7);
    winScenarios(grid4, grid5, grid6);
    tiesRunner();
    cpuRunner();
});


// ********
grid5.addEventListener("mouseenter", markSelectEnter);
grid5.addEventListener("mouseleave", markSelectLeave);
grid5.addEventListener("click", () => {
    manualClicker(grid5);
    winScenarios(grid2, grid5, grid8);
    winScenarios(grid1, grid5, grid9);
    winScenarios(grid3, grid5, grid7);
    winScenarios(grid4, grid5, grid6);
    tiesRunner();
    cpuRunner();
});


// ********
grid6.addEventListener("mouseenter", markSelectEnter);
grid6.addEventListener("mouseleave", markSelectLeave);
grid6.addEventListener("click", () => {
    manualClicker(grid6);
    winScenarios(grid3, grid6, grid9);
    winScenarios(grid4, grid5, grid6);
    tiesRunner();
    cpuRunner();
});


// *********
grid7.addEventListener("mouseenter", markSelectEnter);
grid7.addEventListener("mouseleave", markSelectLeave);
grid7.addEventListener("click", () => {
    manualClicker(grid7);
    winScenarios(grid1, grid4, grid7);
    winScenarios(grid3, grid5, grid7);
    winScenarios(grid7, grid8, grid9);
    tiesRunner();
    cpuRunner();
});

// *********
grid8.addEventListener("mouseenter", markSelectEnter);
grid8.addEventListener("mouseleave", markSelectLeave);
grid8.addEventListener("click", () => {
    manualClicker(grid8);
    winScenarios(grid7, grid8, grid9);
    winScenarios(grid2, grid5, grid8);
    tiesRunner();
    cpuRunner();
});

// *********
grid9.addEventListener("mouseenter", markSelectEnter);
grid9.addEventListener("mouseleave", markSelectLeave);
grid9.addEventListener("click", () => {
    manualClicker(grid9);
    winScenarios(grid1, grid5, grid9);
    winScenarios(grid3, grid6, grid9);
    winScenarios(grid7, grid8, grid9);
    tiesRunner();
    cpuRunner();
});

const cleanup = () => {
    if (gameCount % 2 === 0) {
        initialTurn = 0;
        sessionStorage.setItem("autosaveInitialTurn", JSON.stringify(initialTurn));

    } else {
        initialTurn = 1;
        sessionStorage.setItem("autosaveInitialTurn", JSON.stringify(initialTurn));

    };
    for (let item of gridElement) {
        item.className = "grid normal";
    };
    excludeArray = [];
    gameFinished = false;
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
    cpuRunner();
});

zero.nextZero.addEventListener("click", (e) => {
    e.preventDefault();
    zero.modalZero.classList.toggle("hidden");
    nextRound();
    cpuRunner();
});

ties.nextTies.addEventListener("click", (e) => {
    e.preventDefault();
    ties.modalTies.classList.toggle("hidden");
    nextRound();
    cpuRunner();
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