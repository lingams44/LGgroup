document.addEventListener('DOMContentLoaded', () => {
    // ✅ Get staffId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const staffId = urlParams.get('userId');

    if (!staffId) {
        alert('Staff not logged in. Please log in first.');
        window.location.href = 'staff-login.html'; // Update with your login page path
        return;
    }

    document.getElementById('publishBtn').addEventListener('click', () => {
        const examName = document.getElementById('examName').value.trim();
        const examDate = document.getElementById('examDate').value;
        const examTime = document.getElementById('examTime').value;
        const duration = document.getElementById('duration').value;
        const totalMarks = document.getElementById('totalMarks').value;
        const department = document.getElementById('department').value;
        const examId = document.getElementById('examId').value.trim();

        if (!examName || !examDate || !examTime || !duration || !totalMarks || !department || !examId) {
            alert('Please fill all fields.');
            return;
        }

        // ✅ Send the request to the backend with staff_id from URL
        fetch('http://localhost:3001/api/exam-schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                exam_id: examId,
                staff_id: staffId,
                exam_name: examName,
                exam_date: examDate,
                exam_time: examTime,
                duration: duration,
                total_marks: totalMarks,
                department: department
            }),
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to publish schedule.");
            return res.text();
        })
        .then(message => {
            alert(message);
            clearFields();
        })
        .catch(error => {
            console.error(error);
            alert('Error publishing schedule: ' + error.message);
        });
    });

    document.getElementById('clearBtn').addEventListener('click', clearFields);
    document.getElementById('backBtn').addEventListener('click', () => {
        window.history.back();
    });

    function clearFields() {
        document.getElementById('examName').value = '';
        document.getElementById('examDate').value = '';
        document.getElementById('examTime').value = '';
        document.getElementById('duration').value = '';
        document.getElementById('totalMarks').value = '';
        document.getElementById('department').selectedIndex = 0;
        document.getElementById('examId').value = '';
    }
});
