
const dom = {
    newGameVsCPU: document.querySelector("#newGameVsCPU"),
    newGameVsPlayer: document.querySelector("#newGameVsPlayer"),
    xButton: document.querySelector("#xButton"),
    zeroButton: document.querySelector("#zeroButton"),
    P1: document.querySelector(".P1"),
};

const initialState = (() => {
    return () => {
        dom.newGameVsCPU.setAttribute("disabled", "true");
        dom.newGameVsPlayer.setAttribute("disabled", "true");
    };
})();
initialState();

const xClick = (() => {
    return () => {
        xButton.className = "P1";
        zeroButton.className = "P2";
        dom.newGameVsCPU.removeAttribute("disabled");
        dom.newGameVsPlayer.removeAttribute("disabled");
    };
})();

dom.xButton.addEventListener("click", xClick);

const zeroClick = (() => {
    return () => {
        zeroButton.className = "P1";
        xButton.className = "P2";
        dom.newGameVsCPU.removeAttribute("disabled");
        dom.newGameVsPlayer.removeAttribute("disabled");
    };
})();
dom.zeroButton.addEventListener("click", zeroClick);


