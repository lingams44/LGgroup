document.addEventListener('DOMContentLoaded', function() {
    const profileDetails = document.getElementById('profileDetails');
    const loadingMessage = document.getElementById('loadingMessage');

    // Get user ID from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('userId');

    fetch(`http://localhost:3001/api/student/${studentId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('student_id').value = data.student_id;
            document.getElementById('name').value = data.full_name;
            document.getElementById('email').value = data.email;
            document.getElementById('gender').value = data.gender;
            document.getElementById('date_of_birth').value = data.date_of_birth;
            document.getElementById('department').value = data.department;
            document.getElementById('std_year').value = data.year;
            document.getElementById('institute').value = data.institute_name;
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

    // Redirect to the MCQ exam page
    document.getElementById('mcqButton').addEventListener('click', function() {
        window.location.href = `mcqtest.html?studentId=${studentId}`;
    });

    document.getElementById('descButton').addEventListener('click', function() {
        // Add functionality for descriptive exams
        window.location.href = `desc.html?studentId=${studentId}`;
    });

    document.getElementById('checkResultButton').addEventListener('click', function() {
        // Add functionality for checking result
        window.location.href = `resultlogin.html?studentId=${studentId}`;
    });

    document.getElementById('examViewButton').addEventListener('click', function() {
        // Add functionality for exam view
        window.location.href = `examschedule.html?studentId=${studentId}`;
    });
});