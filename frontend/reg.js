// Function to show the selected role's registration form
function navigateToRegister() {
    let role = document.getElementById("roleSelect").value;
    document.getElementById("studentRegister").classList.add("hidden");
    document.getElementById("staffRegister").classList.add("hidden");

    if (role === "student") {
        document.getElementById("studentRegister").classList.remove("hidden");
    } else if (role === "staff") {
        document.getElementById("staffRegister").classList.remove("hidden");
    }
}

// Handle Student Registration Form
document.getElementById("studentForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const studentData = {
        student_id: document.getElementById("student_id").value,
        full_name: document.getElementById("full_name").value,
        email: document.getElementById("email").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        date_of_birth: document.getElementById("date_of_birth").value,
        department: document.getElementById("department").value,
        std_year: document.getElementById("std_year").value,
        institute: document.getElementById("institute").value,
        address: document.getElementById("address").value,
        password: document.getElementById("password").value
    };

    fetch('http://localhost:3001/register/student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        document.getElementById("studentForm").reset(); // Reset the form
    })
    .catch(error => {
        console.error('Error registering student', error);
        alert('Error registering student');
    });
});

// Handle Staff Registration Form
document.getElementById("staffForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const staffData = {
        staff_id: document.getElementById("staff_id").value,
        full_name: document.getElementById("sfull_name").value,
        email: document.getElementById("semail").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        age: document.getElementById("age").value,
        department: document.getElementById("sdepartment").value,
        address: document.getElementById("saddress").value,
        password: document.getElementById("spassword").value // Ensure you have an ID for the password input
    };

    fetch('http://localhost:3001/register/staff', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffData)
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        document.getElementById("staffForm").reset(); // Reset the form
    })
    .catch(error => {
        console.error('Error registering staff', error);
        alert('Error registering staff');
    });
});