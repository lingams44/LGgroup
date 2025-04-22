document.addEventListener('DOMContentLoaded', function() {
    const manageStaffButton = document.getElementById('manageStaffButton');
    const manageStudentsButton = document.getElementById('manageStudentsButton');
    const viewExamsButton = document.getElementById('viewExamsButton');
    const viewResultsButton = document.getElementById('viewResultsButton');
    const backButton = document.getElementById('backButton');
    const dataTable = document.getElementById('dataTable');
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');

    let currentTable = '';

    const fetchData = async (tableName) => {
        try {
            const response = await fetch(`http://localhost:3001/api/${tableName}`);
            const data = await response.json();
            displayData(data, tableName);
        } catch (error) {
            console.error('Error fetching data', error);
            alert('Database error');
        }
    };

    const getPrimaryKey = (tableName) => {
        switch (tableName) {
            case 'students':
                return 'student_id';
            case 'staff':
                return 'staff_id';
            default:
                return 'id';
        }
    };

    const handleDelete = async (row) => {
        const primaryKey = getPrimaryKey(currentTable);
        const userId = row[primaryKey];
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await fetch(`http://localhost:3001/api/${currentTable}/${userId}`, {
                    method: 'DELETE'
                });
                fetchData(currentTable);
            } catch (error) {
                console.error('Error deleting record', error);
                alert('Database error');
            }
        }
    };

    const displayData = (data, tableName) => {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            const actionTh = document.createElement('th');
            actionTh.textContent = 'Action';
            headerRow.appendChild(actionTh);
            tableHead.appendChild(headerRow);

            data.forEach(row => {
                const rowElement = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = row[header];
                    rowElement.appendChild(td);
                });
                const actionTd = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => handleDelete(row));
                actionTd.appendChild(deleteButton);
                rowElement.appendChild(actionTd);
                tableBody.appendChild(rowElement);
            });

            dataTable.style.display = 'table';
            currentTable = tableName;
        } else {
            dataTable.style.display = 'none';
        }
    };

    manageStaffButton.addEventListener('click', () => fetchData('staff'));
    manageStudentsButton.addEventListener('click', () => fetchData('students'));
    viewExamsButton.addEventListener('click', () => fetchData('exam_schedule'));
    viewResultsButton.addEventListener('click', () => fetchData('results'));
    backButton.addEventListener('click', () => {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';
        dataTable.style.display = 'none';
        currentTable = '';
    });
});