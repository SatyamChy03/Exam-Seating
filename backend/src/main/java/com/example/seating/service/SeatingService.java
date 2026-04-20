package com.example.seating.service;

import com.example.seating.model.InputData;
import com.example.seating.model.Student;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Service class implementing the seating arrangement algorithm using backtracking.
 * Implements constraint checking to ensure students of the same branch are not adjacent.
 */
@Service
public class SeatingService {
    
    private Student[][] grid;
    private List<Student> students;
    private int rows;
    private int cols;
    private int totalStudents;

    /**
     * Main method to generate seating arrangement.
     * Validates input, initializes grid, and solves using backtracking.
     *
     * @param inputData Input containing students list, rows, and columns
     * @return 2D list of student names representing the seating arrangement
     */
    public List<List<Student>> generateSeatingArrangement(InputData inputData) {
        // Validate input
        if (!validateInput(inputData)) {
            return new ArrayList<>(); // Return empty list on invalid input
        }

        this.students = inputData.getStudents();
        this.rows = inputData.getRows();
        this.cols = inputData.getCols();
        this.totalStudents = students.size();
        this.grid = new Student[rows][cols];

        // Initialize grid with null values
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                grid[i][j] = null;
            }
        }

        // Attempt to solve using backtracking
        if (solve(0)) {
            return convertGridToStudentGrid();
        } else {
            return new ArrayList<>(); // Return empty list if no solution found
        }
    }

    /**
     * Backtracking algorithm to place students in the grid.
     * Tries to place each student one by one and backtracks if conflict occurs.
     *
     * @param studentIndex Index of the student to place
     * @return true if successful arrangement found, false otherwise
     */
    private boolean solve(int studentIndex) {
        // Base case: all students have been placed
        if (studentIndex == totalStudents) {
            return true;
        }

        Student currentStudent = students.get(studentIndex);

        // Try placing the student in each cell of the grid
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                // Check if cell is empty and placement is safe
                if (grid[row][col] == null && isSafe(row, col, currentStudent)) {
                    // Place the student
                    grid[row][col] = currentStudent;

                    // Recursively try to place the next student
                    if (solve(studentIndex + 1)) {
                        return true; // Solution found
                    }

                    // Backtrack: remove the student if no solution found
                    grid[row][col] = null;
                }
            }
        }

        return false; // No valid placement found for this student
    }

    /**
     * Checks if it is safe to place a student at a given position.
     * A placement is safe if no adjacent cell (up, down, left, right)
     * contains a student from the same branch.
     *
     * @param row Row index
     * @param col Column index
     * @param student Student to be placed
     * @return true if placement is safe, false otherwise
     */
    private boolean isSafe(int row, int col, Student student) {
        // Check all four adjacent cells: up, down, left, right
        
        // Check up neighbor
        if (row > 0 && grid[row - 1][col] != null) {
            if (grid[row - 1][col].getBranch().equals(student.getBranch())) {
                return false; // Same branch adjacent above
            }
        }

        // Check down neighbor
        if (row < rows - 1 && grid[row + 1][col] != null) {
            if (grid[row + 1][col].getBranch().equals(student.getBranch())) {
                return false; // Same branch adjacent below
            }
        }

        // Check left neighbor
        if (col > 0 && grid[row][col - 1] != null) {
            if (grid[row][col - 1].getBranch().equals(student.getBranch())) {
                return false; // Same branch adjacent to left
            }
        }

        // Check right neighbor
        if (col < cols - 1 && grid[row][col + 1] != null) {
            if (grid[row][col + 1].getBranch().equals(student.getBranch())) {
                return false; // Same branch adjacent to right
            }
        }

        return true; // Safe to place
    }

    /**
     * Converts the 2D grid of Student objects to a 2D list of student names.
     *
     * @return List of lists containing student names or empty strings for empty cells
     */
    private List<List<Student>> convertGridToStudentGrid() {
        List<List<Student>> resultGrid = new ArrayList<>();

        for (int i = 0; i < rows; i++) {
            List<Student> row = new ArrayList<>();
            for (int j = 0; j < cols; j++) {
                row.add(grid[i][j]);
            }
            resultGrid.add(row);
        }

        return resultGrid;
    }

    /**
     * Validates the input data.
     *
     * @param inputData Input to validate
     * @return true if input is valid, false otherwise
     */
    private boolean validateInput(InputData inputData) {
        // Check if input is null
        if (inputData == null) {
            return false;
        }

        // Check if students list is null or empty
        if (inputData.getStudents() == null || inputData.getStudents().isEmpty()) {
            return false;
        }

        // Check if rows and cols are positive
        if (inputData.getRows() <= 0 || inputData.getCols() <= 0) {
            return false;
        }

        // Check if grid size is sufficient for all students
        int gridSize = inputData.getRows() * inputData.getCols();
        if (inputData.getStudents().size() > gridSize) {
            return false;
        }

        // Check if any student has null or empty name/branch/uid
        Set<String> seenUids = new HashSet<>();
        for (Student student : inputData.getStudents()) {
            if (student.getName() == null || student.getName().trim().isEmpty() ||
                student.getBranch() == null || student.getBranch().trim().isEmpty()) {
                return false;
            }

            if (student.getUid() == null || student.getUid().trim().isEmpty()) {
                return false;
            }

            String normalizedUid = student.getUid().trim();

            if (!seenUids.add(normalizedUid)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Gets error message based on input validation.
     *
     * @param inputData Input to validate
     * @return Error message or empty string if valid
     */
    public String getErrorMessage(InputData inputData) {
        if (inputData == null) {
            return "Invalid input data";
        }

        if (inputData.getStudents() == null || inputData.getStudents().isEmpty()) {
            return "Students list cannot be empty";
        }

        if (inputData.getRows() <= 0 || inputData.getCols() <= 0) {
            return "Grid dimensions must be positive";
        }

        int gridSize = inputData.getRows() * inputData.getCols();
        if (inputData.getStudents().size() > gridSize) {
            return "Grid size (" + gridSize + ") is insufficient for " + inputData.getStudents().size() + " students";
        }

        for (Student student : inputData.getStudents()) {
            if (student.getName() == null || student.getName().trim().isEmpty()) {
                return "Student name cannot be empty";
            }
            if (student.getBranch() == null || student.getBranch().trim().isEmpty()) {
                return "Student branch cannot be empty";
            }
            if (student.getUid() == null || student.getUid().trim().isEmpty()) {
                return "Student UID cannot be empty";
            }
        }

        Set<String> seenUids = new HashSet<>();
        for (Student student : inputData.getStudents()) {
            String normalizedUid = student.getUid().trim();
            if (!seenUids.add(normalizedUid)) {
                return "Duplicate student UID found: " + student.getUid();
            }
        }

        return "";
    }
}
