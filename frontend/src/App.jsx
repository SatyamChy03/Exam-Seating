import { useMemo, useState } from 'react';
import { generateSeating, getApiBaseUrl } from './lib/api';

const BRANCHES = [
  { value: 'CSE', label: 'CSE', name: 'Computer Science & Engineering', accent: '#9ec4ff', surface: 'rgba(49, 91, 141, 0.22)', border: 'rgba(49, 91, 141, 0.35)' },
  { value: 'ECE', label: 'ECE', name: 'Electronics & Communication Engineering', accent: '#a9f2df', surface: 'rgba(63, 124, 107, 0.22)', border: 'rgba(63, 124, 107, 0.35)' },
  { value: 'ME', label: 'ME', name: 'Mechanical Engineering', accent: '#f3d29d', surface: 'rgba(141, 111, 58, 0.22)', border: 'rgba(141, 111, 58, 0.35)' },
  { value: 'CE', label: 'CE', name: 'Civil Engineering', accent: '#ffb3c7', surface: 'rgba(166, 82, 114, 0.22)', border: 'rgba(166, 82, 114, 0.35)' },
  { value: 'EEE', label: 'EEE', name: 'Electrical & Electronics Engineering', accent: '#f7d77d', surface: 'rgba(168, 134, 44, 0.22)', border: 'rgba(168, 134, 44, 0.35)' },
  { value: 'IT', label: 'IT', name: 'Information Technology', accent: '#93d8ff', surface: 'rgba(57, 109, 161, 0.22)', border: 'rgba(57, 109, 161, 0.35)' },
  { value: 'AIML', label: 'AIML', name: 'Artificial Intelligence & Machine Learning', accent: '#d6b2ff', surface: 'rgba(118, 77, 180, 0.22)', border: 'rgba(118, 77, 180, 0.35)' },
  { value: 'AIDS', label: 'AIDS', name: 'Artificial Intelligence & Data Science', accent: '#8fe7c9', surface: 'rgba(47, 138, 111, 0.22)', border: 'rgba(47, 138, 111, 0.35)' },
  { value: 'CSD', label: 'CSD', name: 'Computer Science & Design', accent: '#ffcf8b', surface: 'rgba(170, 109, 42, 0.22)', border: 'rgba(170, 109, 42, 0.35)' },
  { value: 'CSBS', label: 'CSBS', name: 'Computer Science & Business Systems', accent: '#a7c7ff', surface: 'rgba(72, 100, 164, 0.22)', border: 'rgba(72, 100, 164, 0.35)' }
];

const BRANCH_LOOKUP = Object.fromEntries(BRANCHES.map((branch) => [branch.value, branch]));

const emptyStudentForm = {
  name: '',
  uid: '',
  branch: BRANCHES[0].value
};

function normalizeName(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizeUid(value) {
  return value.trim();
}

function parsePositiveInteger(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : '';
}

function App() {
  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState(emptyStudentForm);
  const [rows, setRows] = useState('4');
  const [cols, setCols] = useState('5');
  const [grid, setGrid] = useState([]);
  const [message, setMessage] = useState({ type: 'idle', text: 'Add students, verify each UID, and generate a balanced seating chart.' });
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = getApiBaseUrl();
  const normalizedUid = normalizeUid(studentForm.uid);
  const uidDuplicate = students.some((student) => student.uid === normalizedUid);
  const parsedRows = parsePositiveInteger(rows);
  const parsedCols = parsePositiveInteger(cols);
  const capacity = parsedRows && parsedCols ? parsedRows * parsedCols : 0;
  const remainingSeats = capacity - students.length;

  const securityCheckup = useMemo(() => {
    return [
      {
        label: 'Duplicate UID',
        status: uidDuplicate ? 'fail' : 'pass',
        detail: uidDuplicate ? 'This UID already exists in the roster.' : 'No duplicate UID detected.'
      },
      {
        label: 'Seat capacity',
        status: remainingSeats >= 0 ? 'pass' : 'fail',
        detail: remainingSeats >= 0 ? `${remainingSeats} seat(s) remaining.` : 'More students than available seats.'
      }
    ];
  }, [remainingSeats, uidDuplicate]);

  function showMessage(type, text) {
    setMessage({ type, text });
  }

  function addStudent() {
    const name = normalizeName(studentForm.name);
    const uid = normalizeUid(studentForm.uid);
    const branch = studentForm.branch;

    if (!name) {
      showMessage('error', 'Enter a student name before adding the record.');
      return;
    }

    if (!uid) {
      showMessage('error', 'Enter the student UID.');
      return;
    }

    if (students.some((student) => student.uid === uid)) {
      showMessage('error', 'That UID is already in the list.');
      return;
    }

    setStudents((current) => [...current, { name, uid, branch }]);
    setStudentForm(emptyStudentForm);
    showMessage('success', `${name} added with UID ${uid}.`);
  }

  function removeStudent(indexToRemove) {
    setStudents((current) => current.filter((_, index) => index !== indexToRemove));
    showMessage('idle', 'Student removed from the roster.');
  }

  function handleStudentSubmit(event) {
    event.preventDefault();
    addStudent();
  }

  function handleGenerateSubmit(event) {
    event.preventDefault();
    generateArrangement();
  }

  async function generateArrangement() {
    if (students.length === 0) {
      showMessage('error', 'Add at least one student first.');
      return;
    }

    if (!parsedRows || !parsedCols) {
      showMessage('error', 'Enter valid positive numbers for rows and columns.');
      return;
    }

    if (students.length > parsedRows * parsedCols) {
      showMessage('error', 'There are more students than seats. Increase the classroom size.');
      return;
    }

    try {
      setLoading(true);
      showMessage('idle', 'Generating elite seating layout...');

      const response = await generateSeating({
        students,
        rows: parsedRows,
        cols: parsedCols
      });

      if (!response?.success || !Array.isArray(response?.grid) || response.grid.length === 0) {
        setGrid([]);
        showMessage('error', response?.message || 'No valid arrangement was returned by the backend.');
        return;
      }

      setGrid(response.grid);
      showMessage('success', response.message || 'Seating arrangement generated successfully.');
    } catch (error) {
      setGrid([]);
      if (error?.response) {
        const status = error.response.status;
        const backendMessage = error.response.data?.message || error.response.data?.error;

        if (status === 404) {
          showMessage('error', `Backend responded with 404 at ${apiBaseUrl}/generate. Make sure the seating backend is the app running on port 8080.`);
        } else if (status >= 500) {
          showMessage('error', `Backend error ${status}. Check the Spring Boot logs for the seating service.`);
        } else {
          showMessage('error', backendMessage || `Backend returned ${status}. Please check the submitted data.`);
        }
      } else if (error?.request) {
        showMessage('error', `Could not reach the backend at ${apiBaseUrl}. Start the seating backend on port 8080 and retry.`);
      } else {
        showMessage('error', error?.message || 'Failed to generate seating arrangement.');
      }
      console.error('Generate seating error:', error);
    } finally {
      setLoading(false);
    }
  }

  const rowsCount = parsedRows || 4;
  const colsCount = parsedCols || 5;

  return (
    <main className="shell">
      <section className="hero card">
        <div>
          <p className="eyebrow">Exam Seating Optimizer</p>
          <h1>Classy seating plans with UID-aware controls.</h1>
          <p className="hero-copy">
            Build a polished exam hall map, keep branch separation intact, and verify every student UID before sending the request to the backend.
          </p>
        </div>

        <div className="hero-meta">
          <div className="meta-block">
            <span className="meta-label">Students</span>
            <span className="meta-value">{students.length}</span>
          </div>
          <div className="meta-block">
            <span className="meta-label">Capacity</span>
            <span className="meta-value">{rowsCount * colsCount}</span>
          </div>
        </div>
      </section>

      <section className="grid-layout">
        <article className="card">
          <div className="card-header">
            <div>
              <p className="section-kicker">Roster</p>
              <h2>Add students</h2>
            </div>
            <span className="pill">UID required</span>
          </div>

          <form className="form-grid" onSubmit={handleStudentSubmit}>
            <label className="field">
              <span>Student name</span>
              <input
                type="text"
                value={studentForm.name}
                placeholder="Aarav Sharma"
                onChange={(event) => setStudentForm((current) => ({ ...current, name: event.target.value }))}
              />
            </label>

            <label className="field">
              <span>Student UID</span>
              <input
                type="text"
                value={studentForm.uid}
                placeholder="Enter UID"
                onChange={(event) => setStudentForm((current) => ({ ...current, uid: event.target.value }))}
              />
            </label>

            <label className="field">
              <span>Branch</span>
              <select
                value={studentForm.branch}
                onChange={(event) => setStudentForm((current) => ({ ...current, branch: event.target.value }))}
              >
                {BRANCHES.map((branch) => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label} - {branch.name}
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" className="primary-button">Add Student</button>
          </form>

          <div className="roster">
            {students.length === 0 ? (
              <p className="empty-state">No students added yet.</p>
            ) : (
              students.map((student, index) => (
                <div key={`${student.uid}-${index}`} className="student-card">
                  <div>
                    <strong>{student.name}</strong>
                    <p>{student.uid}</p>
                  </div>
                  <div className="student-card__meta">
                    <span
                      className="branch-tag"
                      style={{
                        '--branch-accent': BRANCH_LOOKUP[student.branch]?.accent,
                        '--branch-surface': BRANCH_LOOKUP[student.branch]?.surface,
                        '--branch-border': BRANCH_LOOKUP[student.branch]?.border
                      }}
                    >
                      {student.branch}
                    </span>
                    <button type="button" className="ghost-button" onClick={() => removeStudent(index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="card">
          <div className="card-header">
            <div>
              <p className="section-kicker">Security checkup</p>
              <h2>Validation panel</h2>
            </div>
            <span className="pill pill-soft">Live</span>
          </div>

          <div className="security-list">
            {securityCheckup.map((check) => (
              <div key={check.label} className={`security-item security-${check.status}`}>
                <div>
                  <strong>{check.label}</strong>
                  <p>{check.detail}</p>
                </div>
                <span className="security-badge">{check.status}</span>
              </div>
            ))}
          </div>

          <form className="form-grid form-grid--tight" onSubmit={handleGenerateSubmit}>
            <label className="field">
              <span>Rows</span>
              <input
                type="number"
                min="1"
                value={rows}
                onChange={(event) => setRows(event.target.value)}
              />
            </label>

            <label className="field">
              <span>Columns</span>
              <input
                type="number"
                min="1"
                value={cols}
                onChange={(event) => setCols(event.target.value)}
              />
            </label>

            <button type="submit" className="accent-button" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Seating'}
            </button>
          </form>

          <p className={`status-message status-${message.type}`}>{message.text}</p>
        </article>
      </section>

      <section className="card seating-card">
        <div className="card-header">
          <div>
            <p className="section-kicker">Output</p>
            <h2>Seating arrangement</h2>
          </div>
          <span className="pill">{rowsCount} x {colsCount}</span>
        </div>

        <div className="legend">
          <span><i className="swatch cse" /> CSE</span>
          <span><i className="swatch ece" /> ECE</span>
          <span><i className="swatch me" /> ME</span>
          <span><i className="swatch empty" /> Empty</span>
        </div>

        <div
          className="seating-grid"
          style={{ gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: rowsCount * colsCount }).map((_, index) => {
            const rowIndex = Math.floor(index / colsCount);
            const colIndex = index % colsCount;
            const seatValue = grid?.[rowIndex]?.[colIndex] ?? null;

            if (!seatValue || (typeof seatValue === 'string' && !seatValue.trim())) {
              return (
                <div key={index} className="seat seat-empty">
                  Empty seat
                </div>
              );
            }

            const seat = typeof seatValue === 'string'
              ? (students.find((student) => student.name === seatValue) ?? {
                  name: seatValue,
                  uid: 'UID unavailable',
                  branch: 'Assigned'
                })
              : seatValue;

            const seatBranchClass = typeof seat.branch === 'string' ? seat.branch.toLowerCase() : 'empty';

            return (
              <div
                key={`${seat.uid ?? seat.name ?? 'seat'}-${index}`}
                className={`seat seat-${seatBranchClass}`}
              >
                <strong>{seat.name}</strong>
                <span>{seat.uid}</span>
                <small>{seat.branch}</small>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default App;