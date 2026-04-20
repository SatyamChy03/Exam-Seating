# Test Cases and Examples

This file contains various test cases you can use to verify the backend implementation.

## Test Case 1: Simple Success Case (2x2 grid with 4 students)

### Request
```json
{
  "students": [
    {"name": "Alice", "branch": "CSE"},
    {"name": "Bob", "branch": "ECE"},
    {"name": "Charlie", "branch": "CSE"},
    {"name": "David", "branch": "Mechanical"}
  ],
  "rows": 2,
  "cols": 2
}
```

### Expected Response
```json
{
  "grid": [
    ["Alice", "Bob"],
    ["David", "Charlie"]
  ],
  "success": true,
  "message": "Seating arrangement generated successfully"
}
```

### Explanation
- Alice (CSE) at (0,0)
- Bob (ECE) at (0,1) - different branch from Alice
- David (Mechanical) at (1,0) - different from Alice above
- Charlie (CSE) at (1,1) - Bob above (ECE, different branch) ✓

---

## Test Case 2: No Valid Arrangement (Too many same branch)

### Request
```json
{
  "students": [
    {"name": "S1", "branch": "CSE"},
    {"name": "S2", "branch": "CSE"},
    {"name": "S3", "branch": "CSE"},
    {"name": "S4", "branch": "CSE"}
  ],
  "rows": 2,
  "cols": 2
}
```

### Expected Response
```json
{
  "grid": null,
  "success": false,
  "message": "No valid arrangement found. Consider increasing grid size or adjusting branch distribution."
}
```

### Explanation
- 4 students all from CSE branch
- In a 2x2 grid, at least two CSE students will be adjacent
- No valid arrangement exists

---

## Test Case 3: Empty Students List (Error)

### Request
```json
{
  "students": [],
  "rows": 3,
  "cols": 3
}
```

### Expected Response
```json
{
  "grid": null,
  "success": false,
  "message": "Students list cannot be empty"
}
```

---

## Test Case 4: Grid Too Small (Error)

### Request
```json
{
  "students": [
    {"name": "A", "branch": "CSE"},
    {"name": "B", "branch": "ECE"},
    {"name": "C", "branch": "Mechanical"},
    {"name": "D", "branch": "Civil"}
  ],
  "rows": 1,
  "cols": 2
}
```

### Expected Response
```json
{
  "grid": null,
  "success": false,
  "message": "Grid size (2) is insufficient for 4 students"
}
```

---

## Test Case 5: Larger Grid with Multiple Branches

### Request
```json
{
  "students": [
    {"name": "A1", "branch": "CSE"},
    {"name": "B1", "branch": "ECE"},
    {"name": "A2", "branch": "CSE"},
    {"name": "C1", "branch": "Civil"},
    {"name": "B2", "branch": "ECE"},
    {"name": "A3", "branch": "CSE"}
  ],
  "rows": 3,
  "cols": 2
}
```

### Expected Response
```json
{
  "grid": [
    ["A1", "B1"],
    ["C1", "A2"],
    ["B2", "A3"]
  ],
  "success": true,
  "message": "Seating arrangement generated successfully"
}
```

### Explanation
- Alternating branches in all directions
- No two CSE students adjacent
- Valid checkerboard-like pattern

---

## Test Case 6: Grid with Empty Seats

### Request
```json
{
  "students": [
    {"name": "Student1", "branch": "CSE"},
    {"name": "Student2", "branch": "ECE"}
  ],
  "rows": 2,
  "cols": 3
}
```

### Expected Response
```json
{
  "grid": [
    ["Student1", "Student2", ""],
    ["", "", ""]
  ],
  "success": true,
  "message": "Seating arrangement generated successfully"
}
```

### Explanation
- 2 students in a 6-seat grid
- Empty seats represented as empty strings ""
- Valid arrangement with empty seats

---

## Test Case 7: Missing Student Name (Error)

### Request
```json
{
  "students": [
    {"name": "", "branch": "CSE"},
    {"name": "Bob", "branch": "ECE"}
  ],
  "rows": 2,
  "cols": 2
}
```

### Expected Response
```json
{
  "grid": null,
  "success": false,
  "message": "Student name cannot be empty"
}
```

---

## Test Case 8: Missing Student Branch (Error)

### Request
```json
{
  "students": [
    {"name": "Alice", "branch": ""},
    {"name": "Bob", "branch": "ECE"}
  ],
  "rows": 2,
  "cols": 2
}
```

### Expected Response
```json
{
  "grid": null,
  "success": false,
  "message": "Student branch cannot be empty"
}
```

---

## Test Case 9: Invalid Grid Dimensions (Error)

### Request
```json
{
  "students": [
    {"name": "A", "branch": "CSE"}
  ],
  "rows": 0,
  "cols": 5
}
```

### Expected Response
```json
{
  "grid": null,
  "success": false,
  "message": "Grid dimensions must be positive"
}
```

---

## Test Case 10: Complex Scenario (8 students, 4 branches, 4x2 grid)

### Request
```json
{
  "students": [
    {"name": "CS1", "branch": "CSE"},
    {"name": "CS2", "branch": "CSE"},
    {"name": "EC1", "branch": "ECE"},
    {"name": "EC2", "branch": "ECE"},
    {"name": "ME1", "branch": "Mechanical"},
    {"name": "ME2", "branch": "Mechanical"},
    {"name": "CV1", "branch": "Civil"},
    {"name": "CV2", "branch": "Civil"}
  ],
  "rows": 4,
  "cols": 2
}
```

### Expected Response (Example)
```json
{
  "grid": [
    ["CS1", "EC1"],
    ["ME1", "CV1"],
    ["CS2", "EC2"],
    ["ME2", "CV2"]
  ],
  "success": true,
  "message": "Seating arrangement generated successfully"
}
```

### Explanation
- Perfectly balanced distribution
- Each row has different branches
- All constraints satisfied
- No two students of same branch are adjacent

---

## cURL Testing Commands

### Test Case 1 (Windows PowerShell)
```powershell
$body = @{
    students = @(
        @{ name = "Alice"; branch = "CSE" },
        @{ name = "Bob"; branch = "ECE" },
        @{ name = "Charlie"; branch = "CSE" },
        @{ name = "David"; branch = "Mechanical" }
    )
    rows = 2
    cols = 2
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/generate" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body | ConvertTo-Json
```

### Test Case 2 (Windows PowerShell)
```powershell
$body = @{
    students = @(
        @{ name = "S1"; branch = "CSE" },
        @{ name = "S2"; branch = "CSE" },
        @{ name = "S3"; branch = "CSE" },
        @{ name = "S4"; branch = "CSE" }
    )
    rows = 2
    cols = 2
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/generate" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body | ConvertTo-Json
```

### Test Case 3 (bash/WSL)
```bash
curl -X POST http://localhost:8080/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "students": [
      {"name": "Alice", "branch": "CSE"},
      {"name": "Bob", "branch": "ECE"},
      {"name": "Charlie", "branch": "CSE"},
      {"name": "David", "branch": "Mechanical"}
    ],
    "rows": 2,
    "cols": 2
  }' | jq
```

---

## Health Check Endpoint

### Request
```
GET /api/health
```

### Expected Response
```
Seating Arrangement Optimizer Backend is running
```

### cURL Command (bash/WSL)
```bash
curl http://localhost:8080/api/health
```

### cURL Command (Windows PowerShell)
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/health" -Method GET
```

---

## Testing With Postman

1. **Create New Request**
   - Method: POST
   - URL: http://localhost:8080/api/generate
   - Header: Content-Type: application/json

2. **Body (raw JSON)**
   ```json
   {
     "students": [
       {"name": "Alice", "branch": "CSE"},
       {"name": "Bob", "branch": "ECE"},
       {"name": "Charlie", "branch": "CSE"},
       {"name": "David", "branch": "Mechanical"}
     ],
     "rows": 2,
     "cols": 2
   }
   ```

3. **Send** - View response in the Response panel

---

## Performance Test

### Request: Maximum Capacity (9x9 grid with 81 students)

This test checks if the algorithm can handle a large grid:

```json
{
  "students": [
    {"name": "S1", "branch": "B1"},
    {"name": "S2", "branch": "B2"},
    ... (up to S81)
  ],
  "rows": 9,
  "cols": 9
}
```

**Expected**: Algorithm should complete quickly and find valid arrangement
**Time**: Should be under 5 seconds for typical scenarios

---

## Notes

- All responses follow the SeatingResponse structure
- Error messages are descriptive to help with debugging
- Empty seats are represented as empty strings ""
- Grid is row-major order (rows first, then columns)
- Algorithm uses backtracking (may take longer for impossible cases)

---

## How to Interpret Results

### Success Response
- `success`: true
- `grid`: Non-null 2D array with student names
- `message`: "Seating arrangement generated successfully"

### Failure Response (No Solution)
- `success`: false
- `grid`: null
- `message`: "No valid arrangement found..."

### Error Response (Invalid Input)
- `success`: false
- `grid`: null
- `message`: Specific error description (e.g., "Students list cannot be empty")
