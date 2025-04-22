document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('studentId');
    let exam_title = ''; // Dynamically fetched exam title
    const examRole = 'mcq'; // Hardcoded for MCQ exams

    const questionTextElement = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const statusTextElement = document.getElementById('status-text');
    const nextButton = document.querySelector('.next-btn');
    const bookmarkButton = document.querySelector('.bookmark-btn');
    const submitButton = document.querySelector('.submit-btn');
    const timerElement = document.getElementById('timer');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeRemaining = 60 * 60; // 60 minutes in seconds

    try {
        // Fetch the most recently published exam details
        const examResponse = await fetch('http://localhost:3001/api/exam_schedule/current');
        if (!examResponse.ok) {
            if (examResponse.status === 404) {
                statusTextElement.textContent = 'No exams found in the schedule.';
            } else {
                throw new Error(`Failed to fetch the current exam. Status: ${examResponse.status}`);
            }
            return;
        }

        const examData = await examResponse.json();
        exam_title = examData.exam_name;

        if (!exam_title) {
            statusTextElement.textContent = 'No active or recent exam available.';
            return;
        }

        // Fetch MCQ questions for the exam
        //const response = await fetch(`http://localhost:3001/api/exam-questions/${exam_title}/mcq`);
        const response = await fetch(`http://localhost:3001/api/exam-questions/${exam_title}`);
        if (!response.ok) {
            if (response.status === 404) {
                statusTextElement.textContent = 'No MCQ questions found for this exam.';
            } else {
                throw new Error(`Failed to fetch questions. Status: ${response.status}`);
            }
            return;
        }
        questions = await response.json();

        if (questions.length === 0) {
            statusTextElement.textContent = 'No questions available for this exam.';
            return;
        }

        // Start the timer
        startTimer();

        // Display the first question
        displayQuestion();

        nextButton.addEventListener('click', () => {
            // Check the selected answer
            const selectedOption = document.querySelector(
                `input[name="option"]:checked`
            );

            if (selectedOption) {
                const selectedAnswer = selectedOption.value;
                const correctAnswer = questions[currentQuestionIndex].correct_answer;

                if (selectedAnswer === correctAnswer) {
                    score += 1; // Increment score for correct answers
                }
            }

            // Load the next question or enable the submit button if it's the last question
            currentQuestionIndex += 1;
            if (currentQuestionIndex < questions.length) {
                displayQuestion();
            } else {
                nextButton.disabled = true; // Disable "Next" button
                submitButton.disabled = false; // Enable "Submit" button
                statusTextElement.textContent = 'You have answered all questions. Please submit.';
            }
        });

        bookmarkButton.addEventListener('click', () => {
            alert('Question bookmarked!');
        });

        submitButton.addEventListener('click', submitExam);
    } catch (error) {
        console.error('Error fetching exam or questions:', error);
        alert(`Failed to load exam or questions. Error: ${error.message}`);
    }

    function displayQuestion() {
        const question = questions[currentQuestionIndex];
        questionTextElement.textContent = `${currentQuestionIndex + 1}. ${question.question_text}`;
        optionsContainer.innerHTML = '';

        for (let i = 1; i <= 4; i++) {
            if (question[`option${i}`]) {
                const option = document.createElement('div');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'option';
                input.value = question[`option${i}`];
                input.id = `option${i}`;

                const label = document.createElement('label');
                label.htmlFor = `option${i}`;
                label.textContent = question[`option${i}`];

                option.appendChild(input);
                option.appendChild(label);
                optionsContainer.appendChild(option);
            }
        }
    }

    async function submitExam() {
        clearInterval(timer); // Stop the timer
        try {
            const resultResponse = await fetch(`http://localhost:3001/api/submit-exam`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_id: studentId,
                    exam_title: exam_title,
                    exam_role: examRole,
                    score: score,
                }),
            });

            const result = await resultResponse.json();
            alert(`Exam submitted! Your score: ${result.score}`);
            window.location.href = `studentprofile.html?studentId=${studentId}`;
        } catch (error) {
            console.error('Error submitting exam:', error);
            alert('Failed to submit the exam.');
        }
    }

    function startTimer() {
        timer = setInterval(() => {
            if (timeRemaining <= 0) {
                clearInterval(timer);
                alert('Time is up! The exam will now be submitted.');
                submitExam();
            } else {
                timeRemaining -= 1;
                const minutes = Math.floor(timeRemaining / 60);
                const seconds = timeRemaining % 60;
                timerElement.textContent = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
        }, 1000);
    }
});