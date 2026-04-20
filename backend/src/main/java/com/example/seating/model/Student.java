package com.example.seating.model;

/**
 * Represents a student entity with name and branch information.
 */
public class Student {
    private String name;
    private String uid;
    private String branch;

    // Constructor
    public Student() {
    }

    public Student(String name, String branch) {
        this.name = name;
        this.branch = branch;
    }

    public Student(String name, String uid, String branch) {
        this.name = name;
        this.uid = uid;
        this.branch = branch;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", uid='" + uid + '\'' +
                ", branch='" + branch + '\'' +
                '}';
    }
}
