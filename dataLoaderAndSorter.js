// Function to load data from the JSON file and populate the table
async function loadData() {
    const response = await fetch('UpdatedData.json'); // Make sure this path is correct
    const data = await response.json();
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

    data.forEach(item => {
        const row = tableBody.insertRow();
        const columns = ['Identifier', 'Name', 'Supply', 'SZN', 'Floor Price', 'TDH Rate', 'PPTDH']; // Adjust this list based on your needs

        columns.forEach(column => {
            const cell = row.insertCell();
            let cellValue = item[column]; // Define cellValue here

            // Check if the current column is 'PPTDH' and format the value
            if (column === 'PPTDH' && cellValue !== undefined) {
                cellValue = parseFloat(cellValue).toFixed(4); // Limit to four decimal places
            }

            cell.textContent = cellValue;

            // Apply background color for the "SZN" column based on its value
            if (column === 'SZN') {
              cell.style.fontWeight = 'bold'; // Make text bold
              cell.style.textAlign = 'center'; // Center text
                switch (item[column]) {
                    case 1:
                        cell.style.backgroundColor = '#41815c'; // Color for SZN 1
                        break;
                    case 2:
                        cell.style.backgroundColor = '#407a90'; // Color for SZN 2
                        break;
                    case 3:
                        cell.style.backgroundColor = '#ca762e'; // Color for SZN 3
                        break;
                    case 4:
                        cell.style.backgroundColor = '#a8a835'; // Color for SZN 4
                        break;
                    case 5:
                        cell.style.backgroundColor = '#8018a2'; // Color for SZN 5
                        break;
                    case 6:
                        cell.style.backgroundColor = '#100b50'; // Color for SZN 6
                        break;
                    case 7:
                        cell.style.backgroundColor = '#660000'; // Color for SZN 7
                        break;
                    // Add more cases as needed for different SZN values
                    default:
                        cell.style.backgroundColor = '#f2f2f2'; // Default color
                }
            }
        });
    });
}

async function loadTimeData() {
    const response = await fetch('UpdatedData.json');
    const { data, lastUpdated } = await response.json();

    // Assuming you have a <span> or <div> with the ID 'lastUpdate' in your HTML
    document.getElementById('lastUpdate').textContent = `Last update: ${new Date(lastUpdated).toLocaleString()}`;
}

const sortDirections ={};

// Function to sort the table by a specific column
function sortTable(column) {
    const table = document.getElementById('dataTable');
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);

    // Determine the current sorting direction and toggle it
    const isAscending = sortDirections[column] = !sortDirections[column];

    const compare = (rowA, rowB) => {
        const aValue = rowA.cells[column].textContent;
        const bValue = rowB.cells[column].textContent;

        // Modify comparison for numeric values if necessary
        const aNumber = parseFloat(aValue);
        const bNumber = parseFloat(bValue);

        if (!isNaN(aNumber) && !isNaN(bNumber)) {
            return isAscending ? aNumber - bNumber : bNumber - aNumber;
        } else {
            return isAscending ? aValue.localeCompare(bValue, undefined, {numeric: true}) : bValue.localeCompare(aValue, undefined, {numeric: true});
        }
    };

    rows.sort(compare);
    rows.forEach(row => tbody.appendChild(row)); // Re-add rows in sorted order
}

// Load data when the page loads
document.addEventListener('DOMContentLoaded', loadData);
