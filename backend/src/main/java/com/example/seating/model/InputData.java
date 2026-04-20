package com.example.seating.model;

import java.util.List;

/**
 * Represents the input data required for seating arrangement.
 */
public class InputData {
    private List<Student> students;
    private int rows;
    private int cols;

    // Constructor
    public InputData() {
    }

    public InputData(List<Student> students, int rows, int cols) {
        this.students = students;
        this.rows = rows;
        this.cols = cols;
    }

    // Getters and Setters
    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }

    public int getCols() {
        return cols;
    }

    public void setCols(int cols) {
        this.cols = cols;
    }

    @Override
    public String toString() {
        return "InputData{" +
                "students=" + students +
                ", rows=" + rows +
                ", cols=" + cols +
                '}';
    }
}
