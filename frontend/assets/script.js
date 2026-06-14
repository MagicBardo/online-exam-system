// Login vars
const loginForm = document.getElementById('loginForm');
const inputName = document.getElementById('name');
const inputClass = document.getElementById('class');
const inputCode = document.getElementById('code');

// Exam vars
const examTitle = document.getElementById('exam-title');
const examSippetDiv = document.getElementById('exam-snippet-div');
const examHandInBtn = document.getElementById('handin-btn');

// Functions
async function readExamData(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error("Could not load exam.");
    }

    return await response.json();
}

function checkCodeCorrectness(enteredCode, exam) {
    return enteredCode === exam.code;
}

function saveExamData(exam) {
    localStorage.setItem("examData", JSON.stringify(exam));
}

function openExamPage() {
    window.location.href = "exam.html";
}

async function handleLogin(event) {
    event.preventDefault();

    const enteredCode = inputCode.value;

    try {
        const exam = await readExamData();

        if (checkCodeCorrectness(enteredCode, exam)) {
            saveExamData(exam);
            openExamPage();
        } else {
            alert("Invalid exam code.");
        }
    }
    catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function loadExam() {
    const exam = JSON.parse(sessionStorage.getItem("examData"));

    if (!exam) {
        window.location.href = "login.html";
        return null;
    }

    return exam;
}

function setHeadline(exam) {
    document.getElementById("examTitle").textContent = exam.title;
}


// Main Script
loginForm.addEventListener('submit', handleLogin);

const exam = loadExam();

if (exam) {
    setHeadline(exam);
}
