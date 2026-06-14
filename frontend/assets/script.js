EXAM_DATA_BASE_PATH = "../backend/JSON/";

// Home vars
const examList = document.getElementById("examList");

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
function leadToSpecificLogin (e) {
    const card = e.target.closest(".exam-card");
    if (!card) return;

    const exam = card.dataset.exam;
    window.location.href = `frontend/login.html?exam=${exam}`;
}

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
    sessionStorage.setItem("examData", JSON.stringify(exam));
}

function openExamPage() {
    window.location.href = "exam.html";
}

async function handleLogin(event) {
    event.preventDefault();

    const enteredCode = inputCode.value;

    const params = new URLSearchParams(window.location.search);
    const examName = params.get("exam");

    const path = `${EXAM_DATA_BASE_PATH}${examName}.json`;

    try {
        const exam = await readExamData(path);

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
    examTitle.textContent = exam.title;
}


// Main Script
if (examList) examList.addEventListener("click", leadToSpecificLogin);

if (loginForm) loginForm.addEventListener('submit', handleLogin);

if (examTitle) {
    const examData = loadExam();

    if (examData) {
        setHeadline(examData);
    }
}

