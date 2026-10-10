const API_URL = "http://YOUR_BACKEND_IP:3000"; // Load balancer url
async function loadEmployees() {

    try {

        const response = await fetch(
            `${API_URL}/api/employees`
        );

        const employees = await response.json();

        const table =
            document.getElementById("employeeTable");

        table.innerHTML = "";

        employees.forEach(employee => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${employee.id}</td>

                <td>${employee.name}</td>

                <td>${employee.email}</td>

                <td>${employee.department}</td>

                <td>
                    <button
                        class="delete-btn"
                        onclick="deleteEmployee(${employee.id})">
                        Delete
                    </button>
                </td>
            `;

            table.appendChild(row);

        });

    } catch (error) {

        console.error(error);

        alert("Unable to connect to backend");

    }
}


// Add employee
document
    .getElementById("employeeForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value;

        const email =
            document.getElementById("email").value;

        const department =
            document.getElementById("department").value;


        try {

            const response = await fetch(
                `${API_URL}/api/employees`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        department
                    })
                }
            );


            const result = await response.json();

            if (!response.ok) {

                alert(result.message);

                return;
            }

            alert("Employee added successfully");

            document
                .getElementById("employeeForm")
                .reset();

            loadEmployees();

        } catch (error) {

            console.error(error);

            alert("Unable to connect to backend");

        }

    });


// Delete employee
async function deleteEmployee(id) {

    if (!confirm("Delete this employee?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/employees/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        alert(result.message);

        loadEmployees();

    } catch (error) {

        console.error(error);

        alert("Unable to delete employee");

    }
}


// Load employees when page opens
loadEmployees();
