const quizData = [{
        question: "What is the most used programming language in 2020?",
        a: "Java",
        b: "C",
        c: "Python",
        d: "JavaScript",
        correct: "d",
    },
    {
        question: "Who is the President of US?",
        a: "Florin Pop",
        b: "Donald Trump",
        c: "Ivan Saldano",
        d: "Mihai Andrei",
        correct: "b",
    },
    {
        question: "What does HTML stand for?",
        a: "Hypertext Markup Language",
        b: "Cascading Style Sheet",
        c: "Jason Object Notation",
        d: "Helicopters Terminals Motorboats Lamborginis",
        correct: "a",
    },
    {
        question: "What year was JavaScript launched?",
        a: "1996",
        b: "1995",
        c: "1994",
        d: "none of the above",
        correct: "b",
    },
];

const card = document.getElementsByClassName("card");
const answerEls = document.querySelectorAll(".card-answers");
const questionEl = document.getElementById("question");
const a_text = document.getElementById("answer-a");
const b_text = document.getElementById("answer-b");
const c_text = document.getElementById("answer-c");
const d_text = document.getElementById("answer-d");
const submitBtn = document.getElementById("submit");

let currentQuiz = 0;
let score = 0;

/**
 * Esta función deselecciona todas las respuestas al iniciar una nueva pregunta.
 */
function deselectAnswers() {
    answerEls.forEach((answerEl) => {
        answerEl.checked = false;
    });
}

/**
 * Esta función carga la pregunta y sus posibles respuestas en la tarjeta.
 */
function loadQuiz() {
    deselectAnswers();

    const currentQuizData = quizData[currentQuiz];

    questionEl.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
}

/**
 * Esta función revisa cual es la respuesta seleccionada.
 * @returns {string} Retorna la respuesta seleccionada
 */
function getSelected() {
    let answer = undefined;

    answerEls.forEach((answerEl) => {
        if (answerEl.checked) {
            answer = answerEl.id;
        }
    });

    return answer;
}

loadQuiz();

/** */
submitBtn.addEventListener("click", () => {
    const answer = getSelected();

    if (answer) {
        if (answer === quizData[currentQuiz].correct) {
            score++;
        }

        currentQuiz++;
        if (currentQuiz < quizData.length) {
            loadQuiz();
        } else {
            card[0].innerHTML = `
                <div class="card-body">
                    <h3 class="card-question">
                        You answered correctly at ${score}/${quizData.length} questions.
                    </h3>
                </div>
                <button class="card-btn" onclick="location.reload()">Reload</button>
            `;
        }
    }
});