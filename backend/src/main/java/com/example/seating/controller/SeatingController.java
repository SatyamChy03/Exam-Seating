package com.example.seating.controller;

import com.example.seating.model.InputData;
import com.example.seating.model.SeatingResponse;
import com.example.seating.model.Student;
import com.example.seating.service.SeatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for seating arrangement API.
 * Exposes endpoint for generating exam seating arrangements.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow cross-origin requests from frontend
public class SeatingController {

    @Autowired
    private SeatingService seatingService;

    /**
     * Endpoint to generate seating arrangement.
     * 
     * POST /api/generate
     * 
     * Request Body:
     * {
     *   "students": [
     *     {"name": "A", "branch": "CSE"},
     *     {"name": "B", "branch": "ECE"}
     *   ],
     *   "rows": 3,
     *   "cols": 3
     * }
     *
     * @param inputData Input containing students, rows, and columns
     * @return SeatingResponse with grid and status information
     */
    @PostMapping("/generate")
    public SeatingResponse generateSeating(@RequestBody InputData inputData) {
        // Validate input
        String errorMessage = seatingService.getErrorMessage(inputData);
        if (!errorMessage.isEmpty()) {
            return new SeatingResponse(null, false, errorMessage);
        }

        // Generate seating arrangement
        List<List<Student>> grid = seatingService.generateSeatingArrangement(inputData);

        // Check if solution was found
        if (grid != null && !grid.isEmpty() && hasValidArrangement(grid, inputData.getStudents().size())) {
            return new SeatingResponse(grid, true, "Seating arrangement generated successfully");
        } else {
            return new SeatingResponse(null, false, "No valid arrangement found. Consider increasing grid size or adjusting branch distribution.");
        }
    }

    /**
     * Helper method to verify if the grid contains a valid arrangement.
     *
     * @param grid The seating grid
     * @param expectedStudents Number of students to be placed
     * @return true if grid contains valid arrangement, false otherwise
     */
    private boolean hasValidArrangement(List<List<Student>> grid, int expectedStudents) {
        int count = 0;
        for (List<Student> row : grid) {
            for (Student seat : row) {
                if (seat != null) {
                    count++;
                }
            }
        }
        return count == expectedStudents;
    }

    /**
     * Health check endpoint.
     *
     * @return Status message
     */
    @GetMapping("/health")
    public String health() {
        return "Seating Arrangement Optimizer Backend is running";
    }
}
