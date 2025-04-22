document.addEventListener('DOMContentLoaded', function() {
    const resultLoginForm = document.getElementById('resultLoginForm');
    const errorMessage = document.getElementById('errorMessage');
    const resultContainer = document.getElementById('resultContainer');

    resultLoginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        errorMessage.textContent = '';
        resultContainer.innerHTML = '';

        const studentId = document.getElementById('student_id').value;
        const dateOfBirth = document.getElementById('date_of_birth').value;

        try {
            const response = await fetch('http://localhost:3001/api/student-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ student_id: studentId, date_of_birth: dateOfBirth }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                errorMessage.textContent = errorText;
                return;
            }

            const { full_name, results } = await response.json();
            displayResults(full_name, studentId, results);
        } catch (error) {
            console.error('Error fetching student result:', error);
            errorMessage.textContent = 'An error occurred while fetching your result.';
        }
    });

    function displayResults(fullName, studentId, results) {
        const studentInfo = document.createElement('div');
        studentInfo.innerHTML = `
            <p><strong>Student Name:</strong> ${fullName}</p>
            <p><strong>Student ID:</strong> ${studentId}</p>
        `;
        resultContainer.appendChild(studentInfo);

        const table = document.createElement('table');
        const headerRow = `
            <tr>
                <th>Exam Title</th>
                <th>Exam Role</th>
                <th>Score</th>
                <th>Published</th>
                <th>Date</th>
            </tr>
        `;
        table.innerHTML = headerRow;

        results.forEach(result => {
            const row = `
                <tr>
                    <td>${result.exam_title}</td>
                    <td>${result.exam_role}</td>
                    <td>${result.score}</td>
                    <td>${result.publish ? 'Yes' : 'No'}</td>
                    <td>${new Date(result.created_at).toLocaleString()}</td>
                </tr>
            `;
            table.innerHTML += row;
        });

        resultContainer.appendChild(table);
    }
});