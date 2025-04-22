document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const user_id = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Basic validation
    if (!user_id || !password || !role) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    // User data
    const userData = {
        user_id: user_id,
        password: password,
        role: role
    };

    // API call
    fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User registered') {
            showMessage('Registration successful! Redirecting...', 'success');
            setTimeout(() => {
                if (role === 'student') {
                    window.location.href = 'studentRegister.html'; // Redirect to student registration page
                } else if (role === 'staff') {
                    window.location.href = 'staffreg.html'; // Redirect to staff registration page
                } else {
                    window.location.href = 'admin-register.html'; // Redirect to admin registration page
                }
            }, 200);
        } else {
            showMessage(data.message || 'Registration failed. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again later.', 'error');
    });
});

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = message;
    if (type === 'error') {
        messageDiv.style.color = '#d9534f'; // Red for error
    } else {
        messageDiv.style.color = '#5cb85c'; // Green for success
    }
    document.body.appendChild(messageDiv);
    setTimeout(() => {
        messageDiv.remove();
    }, 3001);
}