document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const staffId = urlParams.get('userId');
    document.getElementById('staffId').value = staffId;

    function toggleQuestionType() {
        const type = document.getElementById("questionType").value;
        document.getElementById("mcqContainer").classList.add("hidden");
        document.getElementById("descriptiveContainer").classList.add("hidden");

        if (type === "mcq") {
            document.getElementById("mcqContainer").classList.remove("hidden");
        } else {
            document.getElementById("descriptiveContainer").classList.remove("hidden");
        }
    }

    document.getElementById("questionType").addEventListener("change", toggleQuestionType);

    document.getElementById("examForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const questionType = document.getElementById("questionType").value;
        const payload = {
            exam_title: document.getElementById("examTitle").value,
            question_type: questionType,
            created_by: staffId
        };

        if (questionType === "mcq") {
            payload.question_text = document.getElementById("mcqQuestion").value;
            payload.option1 = document.getElementById("option1").value;
            payload.option2 = document.getElementById("option2").value;
            payload.option3 = document.getElementById("option3").value;
            payload.option4 = document.getElementById("option4").value;
            payload.correct_answer = document.getElementById("correctAnswer").value;
        } else {
            payload.question_text = document.getElementById("descQuestion").value;
            payload.full_answer = document.getElementById("fullAnswer").value;
            payload.partial_answer = document.getElementById("partialAnswer").value;
        }

        try {
            const res = await fetch("http://localhost:3001/api/exam-questions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await res.text();
            alert(result);

            // Clear only question/answer-related fields — not the exam title
            if (questionType === "mcq") {
                document.getElementById("mcqQuestion").value = "";
                document.getElementById("option1").value = "";
                document.getElementById("option2").value = "";
                document.getElementById("option3").value = "";
                document.getElementById("option4").value = "";
                document.getElementById("correctAnswer").value = "";
            } else {
                document.getElementById("descQuestion").value = "";
                document.getElementById("fullAnswer").value = "";
                document.getElementById("partialAnswer").value = "";
            }

            // Don't reset examTitle, staffId, or questionType
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to submit question.");
        }
    });

    toggleQuestionType(); // On load
});
