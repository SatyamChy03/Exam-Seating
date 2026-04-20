# Exam Seating Arrangement Optimizer - Backend

A Spring Boot REST API backend that uses a backtracking algorithm to generate optimal exam seating arrangements, ensuring students of the same branch are not seated adjacent to each other.

## 🏗️ Project Structure

```
backend/
├── pom.xml
├── src/main/
│   ├── java/com/example/seating/
│   │   ├── SeatingApplication.java
│   │   ├── controller/
│   │   │   └── SeatingController.java
│   │   ├── service/
│   │   │   └── SeatingService.java
│   │   └── model/
│   │       ├── Student.java
│   │       ├── InputData.java
│   │       └── SeatingResponse.java
│   └── resources/
│       └── application.properties
└── README.md
```

## 📋 Tech Stack

- **Java 17**: OOP-based implementation
- **Spring Boot 3.2.0**: REST API framework
- **Maven**: Project management and dependency management
- **Spring Web**: For REST endpoints and CORS support

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

### Installation & Running

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

### Verify the Backend is Running

Open your browser or use curl:
```bash
curl http://localhost:8080/api/health
```

Expected response:
```
Seating Arrangement Optimizer Backend is running
```

## 📡 API Endpoint

### POST /api/generate

Generate an optimal exam seating arrangement using backtracking algorithm.

**Request:**
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

**Response (Success):**
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

**Response (Failure):**
```json
{
  "grid": null,
  "success": false,
  "message": "No valid arrangement found. Consider increasing grid size or adjusting branch distribution."
}
```

## 🧠 Algorithm Details

### Backtracking Algorithm

The seating arrangement is generated using a backtracking algorithm that:

1. **Iterates through students**: Tries to place each student one by one
2. **Validates placement**: Before placing a student, checks the `isSafe()` function
3. **Checks constraints**: Ensures no adjacent student has the same branch
4. **Backtracks on conflict**: If no valid position is found, removes the student and tries alternative placements
5. **Returns result**: Returns the complete grid when all students are placed successfully

### Constraint Checking

The `isSafe(row, col, student)` function checks if a student can be placed at position `(row, col)` by verifying:
- **Up neighbor** (row-1, col): Must not be same branch
- **Down neighbor** (row+1, col): Must not be same branch
- **Left neighbor** (row, col-1): Must not be same branch
- **Right neighbor** (row, col+1): Must not be same branch

### Time Complexity

- **Best case**: O(n) where n is number of students (when first arrangement found quickly)
- **Worst case**: O((rows × cols)^n) in theoretical limit, but constraint checking significantly prunes the search space

## ✅ Error Handling

The backend handles the following error cases:

- **Empty students list**: Returns error message
- **Invalid grid dimensions**: Returns error message if rows or cols ≤ 0
- **Insufficient grid size**: Returns error message if grid size < number of students
- **Missing student data**: Returns error message if name or branch is empty
- **No valid arrangement**: Returns appropriate message when backtracking fails
- **Invalid JSON**: Spring automatically handles with 400 Bad Request

## 🔗 CORS Configuration

The backend is configured with `@CrossOrigin(origins = "*")` to allow requests from any frontend origin. This enables seamless communication with the frontend without CORS errors.

## 🧪 Testing with curl

### Example 1: Simple arrangement
```bash
curl -X POST http://localhost:8080/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "students": [
      {"name": "A", "branch": "CSE"},
      {"name": "B", "branch": "ECE"}
    ],
    "rows": 1,
    "cols": 2
  }'
```

### Example 2: Complex arrangement
```bash
curl -X POST http://localhost:8080/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "students": [
      {"name": "S1", "branch": "CSE"},
      {"name": "S2", "branch": "ECE"},
      {"name": "S3", "branch": "CSE"},
      {"name": "S4", "branch": "Mechanical"},
      {"name": "S5", "branch": "ECE"},
      {"name": "S6", "branch": "CSE"}
    ],
    "rows": 3,
    "cols": 2
  }'
```

## 🎯 Design Principles

✅ **Clean Code**: Proper separation of concerns (Controller → Service → Model)
✅ **OOP Design**: Uses classes, inheritance, and proper encapsulation
✅ **Constraint Validation**: Implements comprehensive input validation
✅ **Algorithm-based**: Uses real backtracking algorithm, not random placement
✅ **REST API**: Follows RESTful conventions
✅ **CORS Support**: Configured for frontend communication
✅ **Error Handling**: Comprehensive error messages for debugging

## 📝 Notes

- The algorithm tries all valid combinations until a solution is found
- If no valid arrangement exists (e.g., too many students of same branch in small grid), it returns an error message
- The grid includes empty seats (represented as empty strings) for cells not occupied by students
- All student names must be unique for best results

## 🔧 Troubleshooting

### Port already in use
If port 8080 is already in use, modify `application.properties`:
```properties
server.port=9090
```

### Build fails
Ensure Java 17+ is installed:
```bash
java -version
```

### Maven not found
Install Maven or use the Maven wrapper:
```bash
./mvnw spring-boot:run  (on Linux/Mac)
mvnw spring-boot:run    (on Windows)
```

## 📦 Dependencies

- spring-boot-starter-web (3.2.0)
- spring-boot-devtools (optional, for development)
- spring-boot-starter-test (for testing)

All dependencies are defined in `pom.xml` and automatically downloaded by Maven.

## 📄 License

This project is provided as-is for educational purposes.
