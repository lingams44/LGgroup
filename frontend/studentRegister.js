document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        student_id: document.getElementById('student_id').value,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        date_of_birth: document.getElementById('date_of_birth').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        address: document.getElementById('address').value,
        pin_code: document.getElementById('pin_code').value,
        email: document.getElementById('email').value,
        institute_name: document.getElementById('institute_name').value,
        department: document.getElementById('department').value,
    };

    const termsAccepted = document.getElementById('terms').checked;
    if (!termsAccepted) {
        alert('You must accept the terms and conditions');
        return;
    }

    try {
        await fetch('http://localhost:3001/api/student/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const image = document.getElementById('image').files[0];
        if (image) {
            const imageData = new FormData();
            imageData.append('name', image.name);
            imageData.append('image', image);
            await fetch('http://localhost:3001/api/student/upload', {
                method: 'POST',
                body: imageData
            });
        }

        alert('Student registered successfully');
    } catch (error) {
        console.error('Error registering student', error);
        alert('Error registering student');
    }
});

document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = '/';
});