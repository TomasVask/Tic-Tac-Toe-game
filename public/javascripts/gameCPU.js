//pagal gerasias praktikas reikia blobalius elementus kaip galima labiau slepti, 
// taciau DOM elementai paimti pagal ID automatiskai yra globalūs.
//ar yra būdas padaryti lokaliais? ir ar reikia?
const grid = {};
for (let item of [grid1, grid2, grid3, grid4, grid5, grid6, grid7, grid8, grid9]) {
    grid[item] = document.getElementById(`${item}`); // kodel veikia ir be sito?
};

const zero = {
    modal: document.querySelector(".modalZero"),
    next: document.querySelector(".nextZero"),
    Result: document.querySelector(".zeroResult"),
    clicked: document.querySelector(".clickedZero"),
    playerWins: document.querySelector(".playerZeroWins"),
    P1: document.querySelector(".zeroP1"),
    Score: JSON.parse(sessionStorage.getItem("autosavezero")),
};

const x = {
    modal: document.querySelector(".modalX"),
    next: document.querySelector(".nextX"),
    Result: document.querySelector(".xResult"),
    clicked: document.querySelector(".clickedX"),
    playerWins: document.querySelector(".playerXWins"),
    P1: document.querySelector(".xP1"),
    Score: JSON.parse(sessionStorage.getItem("autosavex")),
};
const ties = {
    modal: document.querySelector(".modalTies"),
    next: document.querySelector(".nextTies"),
    Result: document.querySelector(".tiesResult"),
    Score: JSON.parse(sessionStorage.getItem("autosaveTies"))
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
    initialTurn: JSON.parse(sessionStorage.getItem("autosaveInitialTurn")),
    gameFinished: false,
    cpuStop: false,
    excludeArray: [] // excluding randoms that are selected
}


// ***********************************************
// **************FUNCTIONS************************
// ***********************************************
const session = () => {
    for (let item of [x, zero, ties]) {
        if (item.Score === null) {
            item.Score = 0;
        };
    };
    if (misc.gameCount === null) {
        misc.gameCount = 0;
    };
    if (misc.initialTurn === null) {
        misc.initialTurn = 0;
    };
    x.Result.innerHTML = x.Score;
    zero.Result.innerHTML = zero.Score;
    ties.Result.innerHTML = ties.Score;
};
session();

const turnMark = (() => { //switching icon of every turn
    const turnDisplayImg = document.querySelector("#turnDisplayImg");
    return () => {
        if (misc.initialTurn % 2 === 0) {
            turnDisplayImg.setAttribute("src", "/starter-code/assets/icon-x-grey.svg");
        } else {
            turnDisplayImg.setAttribute("src", "/starter-code/assets/icon-o-grey.svg");
        };
    };
})();

const winScenariosFactory = (gridA, gridB, gridC) => { // čia FACTORY funkcija
    const winRunner = () => { // ar geriau winRunner funkcija laikyti viduje, ar išorėje, ar nėra skirtumo?
        const xwin = document.querySelector(".xWin");
        const zerowin = document.querySelector(".zeroWin");
        const input = (input, win) => {
            input.modal.classList.remove("hidden");
            input.Score++;
            input.Result.innerHTML = input.Score;
            misc.gameCount++;
            sessionStorage.setItem("autosaveGameCount", JSON.stringify(misc.gameCount));
            misc.overlay.classList.remove("hidden");
            if (win && input.P1) {
                input.playerWins.innerHTML = "YOU WON!";
            } else {
                input.playerWins.innerHTML = "OH NO, YOU LOST...";
            };
        };
        if (xwin) {
            input(x, xwin);
            sessionStorage.setItem("autosavex", JSON.stringify(x.Score));
        } else if (zerowin) {
            input(zero, zerowin);
            sessionStorage.setItem("autosavezero", JSON.stringify(zero.Score));
        };
    };
    const winScenarios = () => {
        function repl(clicked, win) {
            for (let item of [gridA, gridB, gridC]) {
                item.classList.replace(clicked, win);
            };
            misc.gameFinished = true;
            setTimeout(() => {
                winRunner()
            }, 300);
        };
        if (gridA.classList[1] === "clickedX" && gridB.classList[1] === "clickedX" && gridC.classList[1] === "clickedX") {
            repl("clickedX", "xWin");
        } else if (gridA.classList[1] === "clickedZero" && gridB.classList[1] === "clickedZero" && gridC.classList[1] === "clickedZero") {
            repl("clickedZero", "zeroWin");
        };
    };
    //pagal factory funkcijos konstrukciją, norėdamas toliau naudoti gridA, gridB, gridC elementus
    // juos turėčiau return'inti, kaip dabar padaryta žemiau. 
    //bet tolimesnės funkcijos veikia ir jeigu šie parametrai nėra "returninti".
    //Ar tai dėl to, kad jie yra globalūs?
    return { winScenarios, gridA, gridB, gridC };
};

const run = { //šitas dėl Factory Funkcijos
    top: winScenariosFactory(grid1, grid2, grid3),
    left: winScenariosFactory(grid1, grid4, grid7),
    slantDown: winScenariosFactory(grid1, grid5, grid9),
    midVert: winScenariosFactory(grid2, grid5, grid8),
    right: winScenariosFactory(grid3, grid6, grid9),
    slantUp: winScenariosFactory(grid3, grid5, grid7),
    midHor: winScenariosFactory(grid4, grid5, grid6),
    bottom: winScenariosFactory(grid7, grid8, grid9),
};

const tiesRunner = (() => {
    return () => { // čia tiesRunner yra model Pattern. Ar pagal good case practice čia yra OK?\
        const clicked = document.querySelectorAll(".clicked").length;
        const xwin = document.querySelector(".xWin");
        const zerowin = document.querySelector(".zeroWin");
        if (!zerowin && clicked === 9 && !xwin && clicked === 9) {
            ties.modal.classList.remove("hidden");
            misc.overlay.classList.remove("hidden");
            ties.Score++;
            sessionStorage.setItem("autosaveTies", JSON.stringify(ties.Score));
            ties.Result.innerHTML = ties.Score;
            misc.gameFinished = true;
            misc.gameCount++;
            sessionStorage.setItem("autosaveGameCount", JSON.stringify(misc.gameCount));
        }
    };
})();

const gameCheck = function () {
    run.top.winScenarios();
    run.left.winScenarios();
    run.slantDown.winScenarios();
    run.midVert.winScenarios();
    run.right.winScenarios();
    run.slantUp.winScenarios();
    run.midHor.winScenarios();
    run.bottom.winScenarios();
    tiesRunner();
};

// *******************************************************
// *******************************************************


const getRandomWithExclude = (excludeArray) => {
    const randomNumber = Math.floor(Math.random() * (9 - excludeArray.length));
    return randomNumber + excludeArray.sort((a, b) => a - b).reduce((acc, element) => {
        return randomNumber >= element - acc ? acc + 1 : acc
    }, 0);
}

const cpuClickX = (() => {
    return () => {// ar Module Pattern čia duoda naudos?
        const result = getRandomWithExclude(misc.excludeArray);
        misc.excludeArray.push(result);
        let newGrid = misc.gridElement[result];
        if (newGrid.classList) {
            newGrid.className = "grid clickedX clicked";
        };
        newGrid.setAttribute("disabled", "true");
        misc.initialTurn++;
        turnMark();
        gameCheck();
        // console.log(`RANDOM -- NextTurn ${initialTurn}, CPU added: ${excludeArray}`);
    };
})();

const cpuClickZero = (() => {
    return () => { // ar Module Pattern čia duoda naudos?
        const result = getRandomWithExclude(misc.excludeArray);
        misc.excludeArray.push(result);
        let newGrid = misc.gridElement[result];
        if (newGrid.classList) {
            newGrid.className = "grid clickedZero clicked";
        };
        newGrid.setAttribute("disabled", "true");
        misc.initialTurn++;
        turnMark();
        gameCheck();
        // console.log(`RANDOM -- NextTurn ${initialTurn}, CPU added: ${excludeArray}`);
    };
})();

const cpuRandomClicker = function () {
    if (x.P1) {
        setTimeout(() => {
            if (misc.initialTurn % 2 === 1 && !misc.gameFinished) {
                cpuClickZero();
            };
        }, 300);
    } else
        if (zero.P1) {
            setTimeout(() => {
                if (misc.initialTurn % 2 === 0 && !misc.gameFinished) {
                    cpuClickX();
                };
            }, 300);
        }
};

const cpuActiveClicker = function (input) {
    const array = [...misc.gridElement]
    const index = array.indexOf(input)
    if (!misc.excludeArray.includes(index)) {
        misc.excludeArray.push(index);
    };
    if (x.P1) {
        input.className = "grid clickedZero clicked";
    } else {
        input.className = "grid clickedX clicked";
    };
    input.setAttribute("disabled", "true");
    misc.initialTurn++;
    turnMark();
    misc.cpuStop = true;
    gameCheck();
    // console.log(`ACTIVE -- NextTurn ${initialTurn}, CPU added: ${excludeArray}`);
};

function cpuScenarios(grA, grB, grC, manual, cpu) {
    if (grA.classList[1] === cpu && grB.classList[1] === cpu && grC.classList[1] !== manual
        || grA.classList[1] === cpu && grC.classList[1] === cpu && grB.classList[1] !== manual
        || grB.classList[1] === cpu && grC.classList[1] === cpu && grA.classList[1] !== manual) {
        if (grA.classList[1] === cpu && grB.classList[1] === cpu) {
            setTimeout(() => {
                if (!misc.cpuStop && !misc.gameFinished) {
                    cpuActiveClicker(grC);
                };
            }, 270);
        } else if (grA.classList[1] === cpu && grC.classList[1] === cpu) {
            setTimeout(() => {
                if (!misc.cpuStop && !misc.gameFinished) {
                    cpuActiveClicker(grB);
                };
            }, 270);
        } else if (grB.classList[1] === cpu && grC.classList[1] === cpu) {
            setTimeout(() => {
                if (!misc.cpuStop && !misc.gameFinished) {
                    cpuActiveClicker(grA);
                };
            }, 270);
        }
    } else if (grA.classList[1] === manual && grB.classList[1] === manual && grC.classList[1] !== cpu
        || grA.classList[1] === manual && grC.classList[1] === manual && grB.classList[1] !== cpu
        || grB.classList[1] === manual && grC.classList[1] === manual && grA.classList[1] !== cpu) {
        if (grA.classList[1] === manual && grB.classList[1] === manual) {
            setTimeout(() => {
                if (!misc.cpuStop && !misc.gameFinished) {
                    cpuActiveClicker(grC);
                };
            }, 290);

        } else if (grA.classList[1] === manual && grC.classList[1] === manual) {
            setTimeout(() => {
                if (!misc.cpuStop && !misc.gameFinished) {
                    cpuActiveClicker(grB);
                };
            }, 290);
        } else if (grB.classList[1] === manual && grC.classList[1] === manual) {
            setTimeout(() => {
                if (!misc.cpuStop && !misc.gameFinished) {
                    cpuActiveClicker(grA);
                };
            }, 290);
        };
    } else {
        cpuRandomClicker();
    }
};

const cpuRunner = function () {
    if (x.P1) {
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

//**************MANUAL actions*************** */

function manualClicker(gridInput) {
    gridInput.classList.replace("enterX", "clickedX");
    gridInput.classList.add("clicked");
    gridInput.classList.replace("enterZero", "clickedZero");
    const array = [...misc.gridElement];
    const index = array.indexOf(gridInput);
    if (!misc.excludeArray.includes(index)) {
        misc.excludeArray.push(index);
    };
    gridInput.setAttribute("disabled", "true");
    misc.initialTurn++;
    turnMark();
    misc.cpuStop = false;
    // console.log(`user -- NextTurn ${initialTurn}, USER added: ${excludeArray}`);
};

const mouseEnter = (() => {
    return function () {
        if (x.P1) {
            this.classList.replace("normal", "enterX");
        } else if (zero.P1) {
            this.classList.replace("normal", "enterZero");
        }
    };
})();

const mouseLeave = (() => {
    return function () {
        this.classList.replace("enterX", "normal");
        this.classList.replace("enterZero", "normal");
    };
})();

for (let item of [grid1, grid2, grid3, grid4, grid5, grid6, grid7, grid8, grid9]) {
    item.addEventListener("mouseenter", mouseEnter);
    item.addEventListener("mouseleave", mouseLeave);
    item.addEventListener("click", () => {
        manualClicker(item);
        gameCheck();
        cpuRunner();
    });
};

//***********************game end, cleanup************/

const cleanup = () => {
    if (misc.gameCount % 2 === 0) {
        misc.initialTurn = 0;
        sessionStorage.setItem("autosaveInitialTurn", JSON.stringify(misc.initialTurn));

    } else {
        misc.initialTurn = 1;
        sessionStorage.setItem("autosaveInitialTurn", JSON.stringify(misc.initialTurn));

    };
    for (let item of misc.gridElement) {
        item.className = "grid normal";
    };
    misc.excludeArray = [];
    misc.gameFinished = false;
    for (let item of [grid1, grid2, grid3, grid4, grid5, grid6, grid7, grid8, grid9]) {
        item.removeAttribute("disabled");
    };
};

const nextRound = () => {
    misc.overlay.classList.toggle("hidden");
    cleanup();
    turnMark();

};
for (let item of [x, zero, ties]) {
    item.next.addEventListener("click", (e) => {
        e.preventDefault();
        item.modal.classList.toggle("hidden");
        nextRound();
        cpuRunner();
    });
};
for (let item of [0, 1, 2]) {
    misc.quit[item].addEventListener("click", () => {
        sessionStorage.clear();
    });
}
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