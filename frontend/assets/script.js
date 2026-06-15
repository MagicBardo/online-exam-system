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
const examSnippetDiv = document.querySelector('.exam-content');
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

    const enteredName = inputName.value;
    const enteredClass = inputClass.value;
    const enteredCode = inputCode.value;

    sessionStorage.setItem(
        "studentData",
        JSON.stringify({
            name: enteredName,
            class: enteredClass,
            startTime: Date.now()
        })
    );

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


function initQuestion(question, counter) {
    let html = `
        <div class="question">
            <p class="question-text">${question.question}</p>
    `;

    if (question.type === "multiple-choice") {
        html += `<div class="options">`;

        for (let i = 0; i < question.options.length; i++) {
            html += `
                <input
                    type="radio"
                    id="q${counter}o${i}"
                    name="question${counter}"
                >
                <label for="q${counter}o${i}">
                    ${question.options[i]}
                </label>
                <br>
            `;
        }

        html += `</div>`;
    }
    else if (question.type === "number") {
        html += `
            <label for="number${counter}">
                Answer:
            </label>

            <input
                type="number"
                id="number${counter}"
                name="number${counter}"
            >
        `;
    }
    html += `</div>`;

    examSnippetDiv.insertAdjacentHTML("beforeend", html);
}

function readQuestionInput(question, counter) {
    let answer;

    if (question.type === "multiple-choice") {
        const checked = document.querySelector(`input[name=question${counter}]:checked`);
        const answer = checked ? checked.id : null; 
    }
    else if (question.type === "number") {
        const answer = document.getElementById(`number${counter}`).value;
    }

    return answer;
}

function loadStudent() {
    const student = JSON.parse(sessionStorage.getItem("studentData"));

    return student;

}

function getSubmission(examData) {
        const questions = examData.questions;
        let submissions = [];

        for (let i = 0; i < questions.length; i++) {
            const answer = readQuestionInput(questions[i], i);
            submissions.push(answer);
        }

        return submissions;
}

async function uploadData(submission) {
    await fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submission)
    });
}

function handIn() {
    const examData = loadExam();
    const studentData = loadStudent();
    const answers = getSubmission(examData);

    const startedDate = new Date(studentData.startTime);
    const startedReadable = startedDate.toLocaleString();
    const finishedTime = Date.now();
    const finishedDate = new Date(finishedTime);
    const finishedReadable = finishedDate.toLocaleString();

    const duration = finishedTime - studentData.startTime;
    const durationText = Math.floor(duration / 1000); // in seconds
    
    const upload = {
        "name": studentData.name,
        "class": studentData.class,
        "exam": examData.title,
        "startedTime": startedReadable,
        "finishedTime": finishedReadable,
        "duration": duration,
        "answers": answers
    }

    uploadData(upload);
}

// Main Script
if (examList) examList.addEventListener('click', leadToSpecificLogin);

if (loginForm) loginForm.addEventListener('submit', handleLogin);

if (examTitle) {
    const examData = loadExam();

    if (examData) {
        setHeadline(examData);

        const questions = examData.questions;

        for (let i = 0; i < questions.length; i++) {
            initQuestion(questions[i], i);
        }
    }
}

if (examHandInBtn) examHandInBtn.addEventListener('click', handIn);

