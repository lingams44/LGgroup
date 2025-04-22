document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // User data
    const userData = {
        user_id: userId,
        password: password,
        role: role
    };

    // API call
    fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user)); // Store user details
            localStorage.setItem('role', role); // Store user role
            alert('Successfully logged in');
            if (role === 'student') {
                window.location.href = `studentprofile.html?userId=${userId}`; // Redirect to student profile page with user ID
            } else if (role === 'staff') {
                window.location.href = `staffprof.html?userId=${userId}`; // Redirect to staff profile page with user ID
            } else {
                window.location.href = `adminprofile.html?userId=${userId}`; // Redirect to admin profile page with user ID
            }
        } else {
            alert('Invalid credentials');
        }
    })
    .catch(error => {
        console.error('Error logging in', error);
        alert('Invalid credentials');
    });
});