//pagal gerasias praktikas reikia blobalius elementus kaip galima labiau slepti, 
// taciau DOM elementai paimti pagal ID automatiskai yra globalūs.
//ar yra būdas padaryti lokaliais? ir ar reikia?
const grid = (() => {
    const grid1 = document.getElementById("grid1");
    const grid2 = document.getElementById("grid2");
    const grid3 = document.getElementById("grid3");
    const grid4 = document.getElementById("grid4");
    const grid5 = document.getElementById("grid5");
    const grid6 = document.getElementById("grid6");
    const grid7 = document.getElementById("grid7");
    const grid8 = document.getElementById("grid8");
    const grid9 = document.getElementById("grid9");
    return { grid1, grid2, grid3, grid4, grid5, grid6, grid7, grid8, grid9 }
})();

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
    if (x.Score === null) {
        x.Score = 0;
    };
    if (zero.Score === null) {
        zero.Score = 0;
    };
    if (ties.Score === null) {
        ties.Score = 0;
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
        if (gridA.classList[1] === "clickedX" && gridB.classList[1] === "clickedX" && gridC.classList[1] === "clickedX") {
            gridA.classList.replace("clickedX", "xWin");
            gridB.classList.replace("clickedX", "xWin");
            gridC.classList.replace("clickedX", "xWin");
            misc.gameFinished = true;
            setTimeout(() => {
                winRunner()
            }, 300);
        } else if (gridA.classList[1] === "clickedZero" && gridB.classList[1] === "clickedZero" && gridC.classList[1] === "clickedZero") {
            gridA.classList.replace("clickedZero", "zeroWin");
            gridB.classList.replace("clickedZero", "zeroWin");
            gridC.classList.replace("clickedZero", "zeroWin");
            misc.gameFinished = true;
            setTimeout(() => {
                winRunner()
            }, 300);
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
    slantDown: winScenariosFactory(grid.grid1, grid5, grid9),
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

grid1.addEventListener("mouseenter", mouseEnter);
grid1.addEventListener("mouseleave", mouseLeave);
grid1.addEventListener("click", () => {
    manualClicker(grid1);
    run.top.winScenarios();
    run.left.winScenarios();
    run.slantDown.winScenarios();
    tiesRunner();
    cpuRunner();
});


// *********
grid2.addEventListener("mouseenter", mouseEnter);
grid2.addEventListener("mouseleave", mouseLeave);
grid2.addEventListener("click", () => {
    manualClicker(grid2);
    run.top.winScenarios();
    run.midVert.winScenarios();
    tiesRunner();
    cpuRunner();
});


// *********
grid3.addEventListener("mouseenter", mouseEnter);
grid3.addEventListener("mouseleave", mouseLeave);
grid3.addEventListener("click", () => {
    manualClicker(grid3);
    run.top.winScenarios();
    run.right.winScenarios();
    run.slantUp.winScenarios();
    tiesRunner();
    cpuRunner();
});


// *******
grid4.addEventListener("mouseenter", mouseEnter);
grid4.addEventListener("mouseleave", mouseLeave);
grid4.addEventListener("click", () => {
    manualClicker(grid4);
    run.left.winScenarios();
    run.midHor.winScenarios();
    tiesRunner();
    cpuRunner();
});


// ********
grid5.addEventListener("mouseenter", mouseEnter);
grid5.addEventListener("mouseleave", mouseLeave);
grid5.addEventListener("click", () => {
    manualClicker(grid5);
    run.midVert.winScenarios();
    run.slantDown.winScenarios();
    run.slantUp.winScenarios();
    run.midHor.winScenarios();
    tiesRunner();
    cpuRunner();
});


// ********
grid6.addEventListener("mouseenter", mouseEnter);
grid6.addEventListener("mouseleave", mouseLeave);
grid6.addEventListener("click", () => {
    manualClicker(grid6);
    run.right.winScenarios();
    run.midHor.winScenarios();
    tiesRunner();
    cpuRunner();
});


// *********
grid7.addEventListener("mouseenter", mouseEnter);
grid7.addEventListener("mouseleave", mouseLeave);
grid7.addEventListener("click", () => {
    manualClicker(grid7);
    run.left.winScenarios();
    run.slantUp.winScenarios();
    run.bottom.winScenarios();
    tiesRunner();
    cpuRunner();
});

// *********
grid8.addEventListener("mouseenter", mouseEnter);
grid8.addEventListener("mouseleave", mouseLeave);
grid8.addEventListener("click", () => {
    manualClicker(grid8);
    run.bottom.winScenarios();
    run.midVert.winScenarios();
    tiesRunner();
    cpuRunner();
});

// *********
grid9.addEventListener("mouseenter", mouseEnter);
grid9.addEventListener("mouseleave", mouseLeave);
grid9.addEventListener("click", () => {
    manualClicker(grid9);
    run.slantDown.winScenarios();
    run.right.winScenarios();
    run.bottom.winScenarios();
    tiesRunner();
    cpuRunner();
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
        item.className = "grid normal";
    };
    misc.excludeArray = [];
    misc.gameFinished = false;
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
    cpuRunner();
});

zero.next.addEventListener("click", (e) => {
    e.preventDefault();
    zero.modal.classList.toggle("hidden");
    nextRound();
    cpuRunner();
});

ties.next.addEventListener("click", (e) => {
    e.preventDefault();
    ties.modal.classList.toggle("hidden");
    nextRound();
    cpuRunner();
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