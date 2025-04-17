// Sample student data
let students = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", course: "Computer Science" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "234-567-8901", course: "Engineering" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", phone: "345-678-9012", course: "Business" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", phone: "456-789-0123", course: "Arts" },
    { id: 5, name: "Michael Brown", email: "michael@example.com", phone: "567-890-1234", course: "Medicine" }
];

// DOM elements
const studentTableBody = document.getElementById('studentTableBody');
const addStudentForm = document.getElementById('addStudentForm');
const editStudentForm = document.getElementById('editStudentForm');
const saveStudentBtn = document.getElementById('saveStudentBtn');
const updateStudentBtn = document.getElementById('updateStudentBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Modals
const addStudentModal = new bootstrap.Modal(document.getElementById('addStudentModal'));
const editStudentModal = new bootstrap.Modal(document.getElementById('editStudentModal'));
const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));

// Variables to keep track of student to edit/delete
let currentStudentId = null;

// Display students in the table
function displayStudents(studentsToDisplay = students) {
    studentTableBody.innerHTML = '';
    
    studentsToDisplay.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.course}</td>
            <td class="action-btns">
                <button class="btn btn-sm btn-warning edit-btn" data-id="${student.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${student.id}">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </td>
        `;
        studentTableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id') || e.target.parentElement.getAttribute('data-id'));
            editStudent(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id') || e.target.parentElement.getAttribute('data-id'));
            confirmDelete(id);
        });
    });
}

// Add a new student
saveStudentBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const course = document.getElementById('course').value;
    
    if (name && email && phone && course) {
        const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
        const newStudent = {
            id: newId,
            name,
            email,
            phone,
            course
        };
        
        students.push(newStudent);
        displayStudents();
        addStudentModal.hide();
        addStudentForm.reset();
        
        // Show success alert
        showAlert('Student added successfully!', 'success');
    } else {
        showAlert('Please fill in all fields!', 'danger');
    }
});

// Edit student
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (student) {
        currentStudentId = id;
        document.getElementById('editId').value = student.id;
        document.getElementById('editName').value = student.name;
        document.getElementById('editEmail').value = student.email;
        document.getElementById('editPhone').value = student.phone;
        document.getElementById('editCourse').value = student.course;
        editStudentModal.show();
    }
}

// Update student
updateStudentBtn.addEventListener('click', () => {
    const id = currentStudentId;
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const course = document.getElementById('editCourse').value;
    
    if (name && email && phone && course) {
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            students[index] = { id, name, email, phone, course };
            displayStudents();
            editStudentModal.hide();
            
            // Show success alert
            showAlert('Student updated successfully!', 'success');
        }
    } else {
        showAlert('Please fill in all fields!', 'danger');
    }
});

// Confirm delete
function confirmDelete(id) {
    currentStudentId = id;
    deleteConfirmationModal.show();
}

// Delete student
confirmDeleteBtn.addEventListener('click', () => {
    students = students.filter(s => s.id !== currentStudentId);
    displayStudents();
    deleteConfirmationModal.hide();
    
    // Show success alert
    showAlert('Student deleted successfully!', 'success');
});

// Search students
searchBtn.addEventListener('click', searchStudents);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchStudents();
    }
});

function searchStudents() {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm.trim() === '') {
        displayStudents();
        return;
    }
    
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.phone.toLowerCase().includes(searchTerm) ||
        student.course.toLowerCase().includes(searchTerm)
    );
    
    displayStudents(filteredStudents);
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Remove alert after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Initialize the table when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayStudents();
});