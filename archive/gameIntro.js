
let xButton = document.querySelector("#xButton");
let zeroButton = document.querySelector("#zeroButton");
const newGameVsCPU = document.querySelector("#newGameVsCPU")
const newGameVsPlayer = document.querySelector("#newGameVsPlayer")
const P1 = document.querySelector(".P1")

newGameVsCPU.setAttribute("disabled", "true")
newGameVsPlayer.setAttribute("disabled", "true")

xButton.addEventListener("click", function () {
    xButton.className = "P1";
    zeroButton.className = "P2";
    newGameVsCPU.removeAttribute("disabled")
    newGameVsPlayer.removeAttribute("disabled")
    // newGameVsCPU.setAttribute("onclick", "javascript: form.action='/cpugamezero'")
})

zeroButton.addEventListener("click", function () {
    zeroButton.className = "P1";
    xButton.className = "P2";
    newGameVsCPU.removeAttribute("disabled")
    newGameVsPlayer.removeAttribute("disabled")
    // newGameVsCPU.setAttribute("onclick", "javascript: form.action='/cpugamex'")
})
