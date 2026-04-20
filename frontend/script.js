(() => {
  const students = [];

  const studentForm = document.getElementById("student-form");
  const classroomForm = document.getElementById("classroom-form");
  const studentNameInput = document.getElementById("student-name");
  const branchInput = document.getElementById("branch");
  const rowsInput = document.getElementById("rows");
  const colsInput = document.getElementById("cols");
  const studentListEl = document.getElementById("student-list");
  const gridContainerEl = document.getElementById("grid-container");
  const statusMessageEl = document.getElementById("status-message");

  const branchClassMap = {
    CSE: "cse",
    ECE: "ece",
    ME: "me"
  };

  function setStatus(message, isError = true) {
    statusMessageEl.textContent = message;
    statusMessageEl.classList.remove("error", "success");
    statusMessageEl.classList.add(isError ? "error" : "success");
  }

  function clearStatus() {
    setStatus("", true);
  }

  function getBranchClass(branch) {
    return branchClassMap[branch] || "other";
  }

  function renderStudents() {
    studentListEl.innerHTML = "";

    if (students.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.textContent = "No students added yet.";
      studentListEl.appendChild(emptyItem);
      return;
    }

    students.forEach((student, index) => {
      const item = document.createElement("li");
      item.textContent = `${index + 1}. ${student.name} (${student.branch})`;
      studentListEl.appendChild(item);
    });
  }

  function normalizeStudentName(name) {
    return name.trim().replace(/\s+/g, " ");
  }

  function addStudent() {
    const name = normalizeStudentName(studentNameInput.value);
    const branch = branchInput.value;

    if (!name) {
      alert("Please enter a student name.");
      return;
    }

    if (!branch) {
      alert("Please select a branch.");
      return;
    }

    students.push({ name, branch });
    renderStudents();
    studentNameInput.value = "";
    branchInput.selectedIndex = 0;
    studentNameInput.focus();
    clearStatus();
  }

  function parsePositiveInteger(value) {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }

  async function sendDataToBackend(payload) {
    const response = await fetch("http://localhost:8080/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  }

  function normalizeArrangementResponse(data) {
    if (!data) {
      return null;
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.seatingArrangement)) {
      return data.seatingArrangement;
    }

    if (Array.isArray(data.arrangement)) {
      return data.arrangement;
    }

    if (Array.isArray(data.grid)) {
      return data.grid;
    }

    return null;
  }

  function renderGrid(arrangement, rows, cols) {
    gridContainerEl.innerHTML = "";
    gridContainerEl.style.gridTemplateColumns = `repeat(${cols}, minmax(90px, 1fr))`;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const cellData = arrangement?.[row]?.[col] ?? null;
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");

        if (cellData && typeof cellData === "object") {
          const studentName = cellData.name || "Unnamed";
          const branch = cellData.branch || "OTHER";
          cell.textContent = studentName;
          cell.classList.add(getBranchClass(branch));
          cell.title = `${studentName} (${branch})`;
        } else if (typeof cellData === "string" && cellData.trim() !== "") {
          cell.textContent = cellData;
          cell.classList.add("other");
          cell.title = cellData;
        } else {
          cell.textContent = "Empty";
          cell.classList.add("empty");
        }

        gridContainerEl.appendChild(cell);
      }
    }
  }

  async function generateSeating(event) {
    event.preventDefault();

    if (students.length === 0) {
      alert("Please add at least one student.");
      return;
    }

    const rows = parsePositiveInteger(rowsInput.value);
    const cols = parsePositiveInteger(colsInput.value);

    if (!rows || !cols) {
      alert("Please enter valid positive numbers for rows and columns.");
      return;
    }

    const payload = {
      students,
      rows,
      cols
    };

    try {
      setStatus("Generating seating arrangement...", false);
      const responseData = await sendDataToBackend(payload);
      const arrangement = normalizeArrangementResponse(responseData);

      if (!arrangement || arrangement.length === 0) {
        gridContainerEl.innerHTML = "";
        setStatus("No valid arrangement", true);
        return;
      }

      renderGrid(arrangement, rows, cols);
      setStatus("Seating arrangement generated successfully.", false);
    } catch (error) {
      gridContainerEl.innerHTML = "";
      setStatus("Failed to generate seating arrangement. Please check backend connection.", true);
      console.error("Generate seating error:", error);
    }
  }

  studentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addStudent();
  });

  classroomForm.addEventListener("submit", generateSeating);

  renderStudents();
})();
