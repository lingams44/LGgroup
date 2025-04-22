document.addEventListener('DOMContentLoaded', function() {
    const profileDetails = document.getElementById('profileDetails');
    const loadingMessage = document.getElementById('loadingMessage');

    // Get staff ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const staffId = urlParams.get('userId');

    if (!staffId) {
        loadingMessage.textContent = "Staff ID not found. Please login again.";
        return;
    }

    // Fetch staff data from backend
    fetch(`http://localhost:3001/api/staff/${staffId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('staff_id').value = data.staff_id;
            document.getElementById('name').value = data.full_name;
            document.getElementById('email').value = data.email;
            document.getElementById('gender').value = data.gender;
            document.getElementById('age').value = data.age;
            document.getElementById('department').value = data.department;
            document.getElementById('address').value = data.address;
            profileDetails.style.display = 'block';
            loadingMessage.style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading profile:', error);
            loadingMessage.textContent = 'Error loading profile';
        });

    document.getElementById('backButton').addEventListener('click', function() {
        window.location.href = '/';
    });

    document.getElementById('createExamButton').addEventListener('click', function() {
        window.location.href = `create.html?userId=${staffId}`;
    });

    document.getElementById('uploadExamDetailsButton').addEventListener('click', function() {
        window.location.href = `file2.html?userId=${staffId}`;
    });

    document.getElementById('checkResultsButton').addEventListener('click', async function() {
        try {
            const response = await fetch(`http://localhost:3001/api/results`);
            if (!response.ok) {
                const errorMessage = await response.text();
                alert(`Failed to fetch results: ${errorMessage}`);
                return;
            }
            const results = await response.json();
            displayResults(results);
        } catch (error) {
            console.error('Error fetching results:', error);
            alert('An error occurred while fetching results.');
        }
    });

    document.getElementById('publishResultsButton').addEventListener('click', async function() {
        const confirmPublish = confirm("Are you sure you want to publish all results?");
        if (!confirmPublish) return;

        try {
            const response = await fetch(`http://localhost:3001/api/publish-results`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert("All results have been successfully published.");
            } else {
                const errorMessage = await response.text();
                alert(`Failed to publish results: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error publishing results:', error);
            alert('An error occurred while publishing results.');
        }
    });
});

function displayResults(results) {
    const resultsContainer = document.createElement('div');
    resultsContainer.classList.add('results-container');

    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('result');

        resultDiv.innerHTML = `
            <p><strong>Student Name:</strong> ${result.student_name}</p>
            <p><strong>Student ID:</strong> ${result.student_id}</p>
            <p><strong>Exam Title:</strong> ${result.exam_title}</p>
            <p><strong>Exam Role:</strong> ${result.exam_role}</p>
            <p><strong>Score:</strong> ${result.score}</p>
            <p><strong>Published:</strong> ${result.publish ? 'Yes' : 'No'}</p>
            <p><strong>Date:</strong> ${new Date(result.created_at).toLocaleString()}</p>
        `;

        resultsContainer.appendChild(resultDiv);
    });

    // Append results to the document body or a specific container
    document.body.appendChild(resultsContainer);
}