package com.example.seating.model;

import java.util.List;

/**
 * Represents the response containing the seating arrangement grid.
 */
public class SeatingResponse {
    private List<List<Student>> grid;
    private boolean success;
    private String message;

    // Constructor
    public SeatingResponse() {
    }

    public SeatingResponse(List<List<Student>> grid, boolean success, String message) {
        this.grid = grid;
        this.success = success;
        this.message = message;
    }

    // Getters and Setters
    public List<List<Student>> getGrid() {
        return grid;
    }

    public void setGrid(List<List<Student>> grid) {
        this.grid = grid;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "SeatingResponse{" +
                "grid=" + grid +
                ", success=" + success +
                ", message='" + message + '\'' +
                '}';
    }
}
