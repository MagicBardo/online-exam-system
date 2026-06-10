const inputName = document.getElementById('name');
const inputClass = document.getElementById('class');
const inputCode = document.getElementById('code');
const loginForm = document.getElementById('loginForm');


loginForm.addEventListener('submit', openPage);

async function openPage(event) {
    event.preventDefault();

    const enteredCode = inputCode.value;

    try {
        const response = await fetch("../backend/JSON/math11.json");
        const exam = await response.json();

        if (enteredCode === exam.code) {
            window.location.href = "exam.html";
        } else {
            alert("Invalid exam code.");
        }
    }
    catch(error) {
        console.error(error);
        alert("Could not load exam.");
    }
}

