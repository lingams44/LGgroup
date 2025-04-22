document.addEventListener('DOMContentLoaded', async function() {
    const scheduleContainer = document.getElementById('scheduleContainer');
    const loadingMessage = document.getElementById('loadingMessage');
    const backButton = document.getElementById('backButton');

    try {
        // Fetch the exam schedule from the server
        const response = await fetch('http://localhost:3001/api/exam_schedule');
        if (!response.ok) {
            const errorText = await response.text();
            loadingMessage.textContent = `Failed to fetch exam schedule: ${errorText}`;
            return;
        }

        const schedules = await response.json();
        loadingMessage.style.display = 'none';

        // Display the exam schedule
        if (schedules.length === 0) {
            scheduleContainer.innerHTML = '<p>No exam schedule found.</p>';
        } else {
            const table = document.createElement('table');
            const headerRow = `
                <tr>
                    <th>Exam Name</th>
                    <th>Exam Date</th>
                    <th>Exam Time</th>
                    <th>Duration</th>
                    <th>Total Marks</th>
                    <th>Department</th>
                </tr>
            `;
            table.innerHTML = headerRow;

            schedules.forEach(schedule => {
                const row = `
                    <tr>
                        <td>${schedule.exam_name}</td>
                        <td>${schedule.exam_date}</td>
                        <td>${schedule.exam_time}</td>
                        <td>${schedule.duration}</td>
                        <td>${schedule.total_marks}</td>
                        <td>${schedule.department}</td>
                    </tr>
                `;
                table.innerHTML += row;
            });

            scheduleContainer.appendChild(table);
        }
    } catch (error) {
        console.error('Error fetching exam schedule:', error);
        loadingMessage.textContent = 'An error occurred while fetching the exam schedule.';
    }

    // Back button functionality
    backButton.addEventListener('click', function() {
        window.location.href = 'studentprofile.html'; // Redirect back to the student profile page
    });
});