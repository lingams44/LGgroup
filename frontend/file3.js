document.addEventListener("DOMContentLoaded", function () {
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const nextBtn = document.querySelector(".next-btn");
    const bookmarkBtn = document.querySelector(".bookmark-btn");
    const statusText = document.getElementById("status-text");

    let currentQuestionIndex = 0;
    let bookmarkedQuestions = [];

    const questions = [
        {
            question: "What is Inheritance in Java?",
            options: ["A way to store data", "A method to extend a class", "A loop structure", "A built-in function"],
            correct: 1
        },
        {
            question: "Which keyword is used for Inheritance?",
            options: ["extends", "implements", "inherit", "super"],
            correct: 0
        },
        {
            question: "What is polymorphism?",
            options: ["Overriding and overloading", "Using multiple classes", "A data structure", "None of the above"],
            correct: 0
        }
    ];

    function loadQuestion(index) {
        if (index < questions.length) {
            const questionData = questions[index];

            // Set question text
            questionText.innerText = questionData.question;

            // Clear and shuffle options
            optionsContainer.innerHTML = "";
            let shuffledOptions = [...questionData.options].sort(() => Math.random() - 0.5);

            shuffledOptions.forEach((option, i) => {
                const optionElement = document.createElement("label");
                optionElement.innerHTML = `<input type="radio" name="answer" value="${i}"> ${option}`;
                optionsContainer.appendChild(optionElement);
            });

            statusText.innerText = `Question ${index + 1} of ${questions.length}`;
        } else {
            questionText.innerText = "Exam Completed!";
            optionsContainer.innerHTML = "";
            statusText.innerText = "You have completed all questions.";
            nextBtn.style.display = "none";
            bookmarkBtn.style.display = "none";
        }
    }

    nextBtn.addEventListener("click", function () {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    });

    bookmarkBtn.addEventListener("click", function () {
        bookmarkedQuestions.push(currentQuestionIndex);
        alert(`Question ${currentQuestionIndex + 1} bookmarked!`);
    });

    // Load first question
    loadQuestion(currentQuestionIndex);
});
