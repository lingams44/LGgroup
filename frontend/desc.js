document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('studentId');
    let exam_title = ''; // Dynamically fetched exam title
    const examRole = 'descriptive'; // Hardcoded for descriptive exams

    const questionBox = document.getElementById('question');
    const answerBox = document.getElementById('answer');
    const timerDisplay = document.getElementById('time');
    const nextButton = document.querySelector('.next-btn');
    const submitButton = document.querySelector('.submit-btn');
    const statusTextElement = document.getElementById('status-text');

    let questions = [];
    let currentQuestionIndex = 0;
    let timer;
    let timeRemaining = 30 * 60; // 30 minutes in seconds
    let score = 0; // Cumulative score

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

        // Fetch descriptive questions for the exam
        const response = await fetch(`http://localhost:3001/api/exam-questions/${exam_title}/descriptive`);
        if (!response.ok) {
            if (response.status === 404) {
                statusTextElement.textContent = 'No descriptive questions found for this exam.';
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

        nextButton.addEventListener('click', calculateScoreAndLoadNext);
        submitButton.addEventListener('click', submitExam);
    } catch (error) {
        console.error('Error fetching exam or questions:', error);
        alert(`Failed to load exam or questions. Error: ${error.message}`);
    }

    function displayQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        if (currentQuestion) {
            questionBox.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question_text}`;
            answerBox.value = ''; // Clear any previous answer
            statusTextElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
        } else {
            questionBox.textContent = 'No more questions.';
            answerBox.disabled = true;
            nextButton.disabled = true;
            submitButton.disabled = false;
            statusTextElement.textContent = 'You have answered all questions. Please submit.';
        }
    }

    async function calculateScoreAndLoadNext() {
        const currentQuestion = questions[currentQuestionIndex];
        const answer = answerBox.value.trim();

        if (!answer) {
            alert('Please provide an answer before proceeding to the next question.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/exam/calculate-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question_id: currentQuestion.question_id,
                    student_answer: answer,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to calculate score. Status: ${response.status}`);
            }

            const data = await response.json();
            score += (data.score) / 10; // Update cumulative score locally

            // Load the next question
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                displayQuestion();
            } else {
                nextButton.disabled = true;
                submitButton.disabled = false;
                statusTextElement.textContent = 'You have answered all questions. Please submit.';
            }
        } catch (error) {
            console.error('Error calculating score:', error);
            alert(`Failed to calculate score. Error: ${error.message}`);
        }
    }

    async function submitExam() {
        clearInterval(timer); // Stop the timer
        try {
            const resultResponse = await fetch('http://localhost:3001/api/exam/submit-exam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_id: studentId,
                    exam_title: exam_title,
                    exam_role: examRole,
                    total_score: score,
                }),
            });

            if (!resultResponse.ok) {
                throw new Error(`Failed to submit exam. Status: ${resultResponse.status}`);
            }

            const result = await resultResponse.json();
            alert(`Exam submitted! Your total score: ${result.total_score}`);
            window.location.href = `studentprofile.html?studentId=${studentId}`;
        } catch (error) {
            console.error('Error submitting exam:', error);
            alert(`Failed to submit the exam. Error: ${error.message}`);
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
                timerDisplay.textContent = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
        }, 1000);
    }
});