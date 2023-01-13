// const index = require("../javascripts/index")
const grid = {
    grid1: document.querySelector("#grid1"),
    grid2: document.querySelector("#grid2"),
    grid3: document.querySelector("#grid3"),
    grid4: document.querySelector("#grid4"),
    grid5: document.querySelector("#grid5"),
    grid6: document.querySelector("#grid6"),
    grid7: document.querySelector("#grid7"),
    grid8: document.querySelector("#grid8"),
    grid9: document.querySelector("#grid9"),
};

const zero = {
    modal: document.querySelector(".modalZero"),
    next: document.querySelector(".nextZero"),
    result: document.querySelector(".zeroResult"),
    clicked: document.querySelector(".clickedZero"),
    playerWins: document.querySelector(".playerZeroWins"),
    P1: document.querySelector(".zeroP1"),
    score: JSON.parse(sessionStorage.getItem("autosaveZero")),
};
const x = {
    modal: document.querySelector(".modalX"),
    next: document.querySelector(".nextX"),
    result: document.querySelector(".xResult"),
    clicked: document.querySelector(".clickedX"),
    playerWins: document.querySelector(".playerXWins"),
    P1: document.querySelector(".xP1"),
    score: JSON.parse(sessionStorage.getItem("autosaveX"))
};
const ties = {
    modal: document.querySelector(".modalTies"),
    next: document.querySelector(".nextTies"),
    result: document.querySelector(".tiesResult"),
    score: JSON.parse(sessionStorage.getItem("autosaveTies")),
};
const restart = {
    modalRestart: document.querySelector(".modalRestart"),
    restartBtn: document.querySelector(".restart"),
    cancel: document.querySelector(".cancel"),
    restartConfirm: document.querySelector(".restartConfirm")
};
const misc = {
    overlay: document.querySelector(".overlay"),
    gridElement: document.querySelectorAll(".grid"),
    quit: document.querySelectorAll(".quit"),
    gameCount: JSON.parse(sessionStorage.getItem("autosaveGameCount")),
    initialTurn: JSON.parse(sessionStorage.getItem("autosaveInitialTurn"))
};

// ***********************************************
// **************FUNCTIONS************************
// ***********************************************
const session = () => {
    if (x.score === null) {
        x.score = 0;
    };
    if (zero.score === null) {
        zero.score = 0;
    };
    if (ties.score === null) {
        ties.score = 0;
    };
    if (misc.gameCount === null) {
        misc.gameCount = 0;
    };
    if (misc.initialTurn === null) {
        misc.initialTurn = 0;
    };
    x.result.innerHTML = x.score;
    zero.result.innerHTML = zero.score;
    ties.result.innerHTML = ties.score;
};
session();

const turnMark = (() => {
    const turnDisplayImg = document.querySelector("#turnDisplayImg");
    return () => {
        if (misc.initialTurn % 2 === 0) {
            turnDisplayImg.setAttribute("src", "/starter-code/assets/icon-x-grey.svg");
        } else {
            turnDisplayImg.setAttribute("src", "/starter-code/assets/icon-o-grey.svg");
        };
    };
})();

function winScenariosFactory() {
    const winRunner = () => {
        const xwin = document.querySelector(".xWin");
        const zerowin = document.querySelector(".zeroWin");
        const input = (input, win) => {
            input.modal.classList.remove("hidden");
            input.score++;
            input.result.innerHTML = input.score;
            misc.gameCount++;
            misc.overlay.classList.remove("hidden");
            sessionStorage.setItem("autosaveGameCount", JSON.stringify(misc.gameCount));
            if (win && input.P1) {
                input.playerWins.innerHTML = "PLAYER 1 WINS!";
            } else {
                input.playerWins.innerHTML = "PLAYER 2 WINS!";
            };
        };
        if (xwin) {
            input(x, xwin);
            sessionStorage.setItem("autosaveX", JSON.stringify(x.score));
        } else if (zerowin) {
            input(zero, zerowin);
            sessionStorage.setItem("autosaveZero", JSON.stringify(zero.score));
        };
    };
    const winScenarios = (gridA, gridB, gridC) => {
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
        };
    };
    return { winScenarios };
};

const run = winScenariosFactory();
// const run = { //šitas dėl Factory Funkcijos
//     top: winScenariosFactory(grid.grid1, grid.grid2, grid.grid3),
//     left: winScenariosFactory(grid.grid1, grid.grid4, grid.grid7),
//     slantDown: winScenariosFactory(grid.grid1, grid.grid5, grid.grid9),
//     midVert: winScenariosFactory(grid.grid2, grid.grid5, grid.grid8),
//     right: winScenariosFactory(grid.grid3, grid.grid6, grid.grid9),
//     slantUp: winScenariosFactory(grid.grid3, grid.grid5, grid.grid7),
//     midHor: winScenariosFactory(grid.grid4, grid.grid5, grid.grid6),
//     bottom: winScenariosFactory(grid.grid7, grid.grid8, grid.grid9),
// }



const tiesRunners = () => {
    const tiesRunner = () => {
        const clicked = document.querySelectorAll(".clicked").length;
        const xWin = document.querySelector(".xWin");
        const zeroWin = document.querySelector(".zeroWin");
        if (!zeroWin && clicked === 9 && !xWin && clicked === 9) {
            ties.modal.classList.remove("hidden");
            misc.overlay.classList.remove("hidden");
            ties.score++;
            sessionStorage.setItem("autosaveTies", JSON.stringify(ties.score));
            ties.result.innerHTML = ties.score;
            misc.gameCount++;
            sessionStorage.setItem("autosaveGameCount", JSON.stringify(misc.gameCount));
        };
    };
    setTimeout(() => {
        tiesRunner();
    }, 300);
};

const clickerFactory = function () { //factory funkcija
    const clicker = (gridInput) => {
        gridInput.classList.replace("enterX", "clickedX");
        gridInput.classList.add("clicked");
        gridInput.classList.replace("enterZero", "clickedZero");
        gridInput.setAttribute("disabled", "true");
        misc.initialTurn++;
        turnMark();
    };
    return { clicker };
};
const click = clickerFactory();

const mouseEnter = (() => {
    return function () {
        if (misc.initialTurn % 2 === 0) {
            this.classList.replace("normal", "enterX");
        } else {
            this.classList.replace("normal", "enterZero");
        };
    };
})();

const mouseLeave = (() => {
    return function () {
        this.classList.replace("enterX", "normal");
        this.classList.replace("enterZero", "normal");
    };
})();

// *******************************************************
// *******************************************************

grid.grid1.addEventListener("mouseenter", mouseEnter);
grid.grid1.addEventListener("mouseleave", mouseLeave);
grid.grid1.addEventListener("click", () => {
    click.clicker(grid.grid1);
    tiesRunners();
    run.winScenarios(grid.grid1, grid.grid2, grid.grid3);
    run.winScenarios(grid.grid1, grid.grid4, grid.grid7);
    run.winScenarios(grid.grid1, grid.grid5, grid.grid9);
});



grid.grid2.addEventListener("mouseenter", mouseEnter);
grid.grid2.addEventListener("mouseleave", mouseLeave);
grid.grid2.addEventListener("click", () => {
    click.clicker(grid.grid2);
    run.winScenarios(grid.grid1, grid.grid2, grid.grid3);
    run.winScenarios(grid.grid2, grid.grid5, grid.grid8);
    tiesRunners();
});


// *********
grid.grid3.addEventListener("mouseenter", mouseEnter);
grid.grid3.addEventListener("mouseleave", mouseLeave);
grid.grid3.addEventListener("click", () => {
    click.clicker(grid.grid3);
    run.winScenarios(grid.grid1, grid.grid2, grid.grid3);
    run.winScenarios(grid.grid3, grid.grid6, grid.grid9);
    run.winScenarios(grid.grid3, grid.grid5, grid.grid7);
    tiesRunners();
});


// *******
grid.grid4.addEventListener("mouseenter", mouseEnter);
grid.grid4.addEventListener("mouseleave", mouseLeave);
grid.grid4.addEventListener("click", () => {
    click.clicker(grid.grid4);
    run.winScenarios(grid.grid1, grid.grid4, grid.grid7);
    run.winScenarios(grid.grid4, grid.grid5, grid.grid6);
    tiesRunners();
});


// ********
grid.grid5.addEventListener("mouseenter", mouseEnter);
grid.grid5.addEventListener("mouseleave", mouseLeave);
grid.grid5.addEventListener("click", () => {
    click.clicker(grid.grid5);
    run.winScenarios(grid.grid2, grid.grid5, grid.grid8);
    run.winScenarios(grid.grid1, grid.grid5, grid.grid9);
    run.winScenarios(grid.grid3, grid.grid5, grid.grid7);
    run.winScenarios(grid.grid4, grid.grid5, grid.grid6);
    tiesRunners();
});


// ********
grid.grid6.addEventListener("mouseenter", mouseEnter);
grid.grid6.addEventListener("mouseleave", mouseLeave);
grid.grid6.addEventListener("click", () => {
    click.clicker(grid.grid6);
    run.winScenarios(grid.grid3, grid.grid6, grid.grid9);
    run.winScenarios(grid.grid4, grid.grid5, grid.grid6);
    tiesRunners();
});


// *********
grid.grid7.addEventListener("mouseenter", mouseEnter);
grid.grid7.addEventListener("mouseleave", mouseLeave);
grid.grid7.addEventListener("click", () => {
    click.clicker(grid.grid7);
    run.winScenarios(grid.grid1, grid.grid4, grid.grid7);
    run.winScenarios(grid.grid3, grid.grid5, grid.grid7);
    run.winScenarios(grid.grid7, grid.grid8, grid.grid9);
    tiesRunners();
});


// *********
grid.grid8.addEventListener("mouseenter", mouseEnter);
grid.grid8.addEventListener("mouseleave", mouseLeave);
grid.grid8.addEventListener("click", () => {
    click.clicker(grid.grid8);
    run.winScenarios(grid.grid7, grid.grid8, grid.grid9);
    run.winScenarios(grid.grid2, grid.grid5, grid.grid8);
    tiesRunners();
});


// *********
grid.grid9.addEventListener("mouseenter", mouseEnter);
grid.grid9.addEventListener("mouseleave", mouseLeave);
grid.grid9.addEventListener("click", () => {
    click.clicker(grid.grid9);
    run.winScenarios(grid.grid1, grid.grid5, grid.grid9);
    run.winScenarios(grid.grid3, grid.grid6, grid.grid9);
    run.winScenarios(grid.grid7, grid.grid8, grid.grid9);
    tiesRunners();
});



const cleanup = () => {
    if (misc.gameCount % 2 === 0) {
        misc.initialTurn = 0;
        sessionStorage.setItem("autosaveInitialTurn", JSON.stringify(misc.initialTurn));
    } else {
        misc.initialTurn = 1;
        sessionStorage.setItem("autosaveInitialTurn", JSON.stringify(misc.initialTurn));
    };
    for (let item of misc.gridElement) {
        item.className = "grid normal"
    };
    grid.grid1.removeAttribute("disabled");
    grid.grid2.removeAttribute("disabled");
    grid.grid3.removeAttribute("disabled");
    grid.grid4.removeAttribute("disabled");
    grid.grid5.removeAttribute("disabled");
    grid.grid6.removeAttribute("disabled");
    grid.grid7.removeAttribute("disabled");
    grid.grid8.removeAttribute("disabled");
    grid.grid9.removeAttribute("disabled");
};

// ***************************************************

const nextRound = () => {
    misc.overlay.classList.toggle("hidden");
    cleanup();
    turnMark();
};

x.next.addEventListener("click", (e) => {
    e.preventDefault();
    x.modal.classList.toggle("hidden");
    nextRound();
});

zero.next.addEventListener("click", (e) => {
    e.preventDefault();
    zero.modal.classList.toggle("hidden");
    nextRound();
});

ties.next.addEventListener("click", (e) => {
    e.preventDefault();
    ties.modal.classList.toggle("hidden");
    nextRound();
});
misc.quit[0].addEventListener("click", () => {
    sessionStorage.clear();
})
misc.quit[1].addEventListener("click", () => {
    sessionStorage.clear();
})
misc.quit[2].addEventListener("click", () => {
    sessionStorage.clear();
})

restart.restartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    restart.modalRestart.classList.remove("hidden");
    misc.overlay.classList.remove("hidden");
});

restart.cancel.addEventListener("click", (e) => {
    e.preventDefault();
    restart.modalRestart.classList.add("hidden");
    misc.overlay.classList.add("hidden");
});

restart.restartConfirm.addEventListener("click", () => {
    sessionStorage.clear();
})