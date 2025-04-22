document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        staff_id: document.getElementById('staff_id').value,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        department: document.getElementById('department').value,
    };

    try {
        await fetch('http://localhost:3001/api/staff/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        alert('Staff registered successfully');
    } catch (error) {
        console.error('Error registering staff', error);
        alert('Error registering staff');
    }
});

document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = '/';
});