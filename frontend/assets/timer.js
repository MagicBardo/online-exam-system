const HOME_PAGE = "/index.html";

let timerInterval = null;
let currentTimeLeft = 0;
let currentTotalTime = 0;

function loadExam() {
    return JSON.parse(sessionStorage.getItem("examData"));
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateTimerDisplay(timeLeft, totalTime) {
    const timerText = document.getElementById("timer-text");
    const timerBar = document.getElementById("timer-bar");

    timerText.textContent = formatTime(timeLeft);

    const percentage = (timeLeft / totalTime) * 100;
    timerBar.style.width = `${percentage}%`;
}

function handInExam() {
    alert("Time is up!");

    window.handIn();

    window.location.href = "../index.html";
}

export function startTimer(totalTime) {
    currentTimeLeft = totalTime;
    currentTotalTime = totalTime;

    updateTimerDisplay(currentTimeLeft, currentTotalTime);

    timerInterval = setInterval(() => {
        currentTimeLeft--;

        updateTimerDisplay(currentTimeLeft, currentTotalTime);

        if (currentTimeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            handInExam();
        }
    }, 1000);
}

export function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const exam = loadExam();

    if (!exam) {
        return;
    }

    startTimer(exam.time);
});