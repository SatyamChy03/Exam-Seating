# Frontend Integration Guide

This guide shows how to integrate the backend API with your HTML/JavaScript frontend.

## Backend API Endpoint

- **URL**: `http://localhost:8080/api/generate`
- **Method**: POST
- **Content-Type**: application/json
- **CORS**: Enabled (all origins allowed)

## JavaScript Example

Add this to your frontend HTML/JS:

```javascript
/**
 * Function to call the backend API and generate seating arrangement
 */
async function generateSeating() {
    // Prepare the input data
    const inputData = {
        students: [
            { name: "Alice", branch: "CSE" },
            { name: "Bob", branch: "ECE" },
            { name: "Charlie", branch: "CSE" },
            { name: "David", branch: "Mechanical" }
        ],
        rows: 2,
        cols: 2
    };

    try {
        // Make POST request to backend
        const response = await fetch('http://localhost:8080/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputData)
        });

        // Check if response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response
        const result = await response.json();

        // Handle the result
        if (result.success) {
            console.log('Success:', result.message);
            console.log('Grid:', result.grid);
            displayGrid(result.grid);
        } else {
            console.log('Error:', result.message);
            displayError(result.message);
        }

    } catch (error) {
        console.error('Error calling backend:', error);
        displayError('Failed to connect to backend: ' + error.message);
    }
}

/**
 * Function to display the seating grid in HTML table
 */
function displayGrid(grid) {
    const container = document.getElementById('grid-container');
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create table
    const table = document.createElement('table');
    table.border = '1';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '20px';
    
    // Populate table with grid data
    for (const row of grid) {
        const tr = document.createElement('tr');
        
        for (const cell of row) {
            const td = document.createElement('td');
            td.style.padding = '10px';
            td.style.border = '1px solid black';
            td.style.width = '80px';
            td.style.height = '80px';
            td.style.textAlign = 'center';
            td.style.verticalAlign = 'middle';
            td.style.backgroundColor = cell ? '#90EE90' : '#FFB6C6';
            td.textContent = cell || 'Empty';
            tr.appendChild(td);
        }
        
        table.appendChild(tr);
    }
    
    container.appendChild(table);
}

/**
 * Function to display error message
 */
function displayError(message) {
    const container = document.getElementById('grid-container');
    container.innerHTML = '<p style="color: red; font-size: 16px;"><strong>Error:</strong> ' + message + '</p>';
}

// Example: Call the function when a button is clicked
document.getElementById('generate-btn').addEventListener('click', generateSeating);
```

## HTML Integration

Add this to your HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exam Seating Arrangement Optimizer</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            color: #333;
            text-align: center;
        }
        
        .form-group {
            margin: 20px 0;
        }
        
        label {
            display: block;
            margin: 10px 0 5px;
            font-weight: bold;
            color: #555;
        }
        
        input, button {
            padding: 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #ddd;
        }
        
        input[type="text"],
        input[type="number"] {
            width: 100%;
            box-sizing: border-box;
        }
        
        button {
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
            border: none;
            width: 100%;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        
        button:hover {
            background-color: #45a049;
        }
        
        #grid-container {
            margin-top: 30px;
            text-align: center;
        }
        
        table {
            margin: 20px auto;
            background-color: white;
        }
        
        td {
            font-weight: bold;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Exam Seating Arrangement Optimizer</h1>
        
        <button id="generate-btn" onclick="generateSeating()">Generate Seating Arrangement</button>
        
        <div id="grid-container"></div>
    </div>
    
    <script src="integration-example.js"></script>
</body>
</html>
```

## Testing Steps

1. **Start the backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Open the frontend**: Open `index.html` in your browser

3. **Click the button**: Click "Generate Seating Arrangement" button

4. **View results**: The seating grid will be displayed in a table format

## Customizing Student Data

To customize the students in the form, modify the `inputData` object in the JavaScript function:

```javascript
const inputData = {
    students: [
        { name: "Student1", branch: "CSE" },
        { name: "Student2", branch: "ECE" },
        // Add more students as needed
    ],
    rows: 3,      // Number of rows in the exam hall
    cols: 3       // Number of columns in the exam hall
};
```

## Common Issues

### CORS Error
If you see a CORS error, make sure:
- Backend is running on `http://localhost:8080`
- Backend has `@CrossOrigin(origins = "*")` annotation
- Frontend is making the request to the correct URL

### Backend Not Responding
If the backend is not responding:
- Check if the server is running: `curl http://localhost:8080/api/health`
- Verify the port is correct (default: 8080)
- Check if Maven built successfully

### No Solution Found
If you get "No valid arrangement found":
- Try increasing grid size (more rows/cols)
- Try reducing number of students
- Try making branch distribution more balanced

## API Response Structure

```json
{
  "grid": [
    ["Student1", "Student2"],
    ["Student3", ""]
  ],
  "success": true,
  "message": "Seating arrangement generated successfully"
}
```

- `grid`: 2D array of student names and empty strings for empty seats
- `success`: true if arrangement found, false otherwise
- `message`: Status message or error description
