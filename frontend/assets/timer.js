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

    // Later:
    // submitExam();

    window.location.href = "index.html";
}

function startTimer(totalTime) {
    let timeLeft = totalTime;

    updateTimerDisplay(timeLeft, totalTime);

    const timer = setInterval(() => {
        timeLeft--;

        updateTimerDisplay(timeLeft, totalTime);

        if (timeLeft <= 0) {
            clearInterval(timer);

            updateTimerDisplay(0, totalTime);

            handInExam();
        }
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    const exam = loadExam();

    if (!exam) {
        return;
    }

    startTimer(exam.time);
});