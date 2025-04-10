import React, { useState } from 'react';

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [marks, setMarks] = useState([]);
  const [fees, setFees] = useState(null);

  const studentId = 1; // You can make this dynamic later

  const loadCourses = async () => {
    const res = await fetch('http://localhost:5000/courses');
    const data = await res.json();
    setCourses(data);
  };

  const loadMarks = async () => {
    const res = await fetch(`http://localhost:5000/marks/${studentId}`);
    const data = await res.json();
    setMarks(data);
  };

  const loadFees = async () => {
    const res = await fetch(`http://localhost:5000/fees/${studentId}`);
    const data = await res.json();
    setFees(data);
  };

  return (
    <div style={styles.container}>
      <h2>Welcome to Dashboard</h2>
      <div style={styles.buttons}>
        <button onClick={loadCourses}>View Courses</button>
        <button onClick={loadMarks}>View Marks</button>
        <button onClick={loadFees}>View Fee Details</button>
      </div>

      {courses.length > 0 && (
        <div>
          <h3>Courses</h3>
          <ul>{courses.map(c => <li key={c.id}>{c.name} - {c.description}</li>)}</ul>
        </div>
      )}

      {marks.length > 0 && (
        <div>
          <h3>Marks</h3>
          <ul>{marks.map((m, i) => <li key={i}>{m.course}: {m.marks}</li>)}</ul>
        </div>
      )}

      {fees && (
        <div>
          <h3>Fee Details</h3>
          <p>Paid: ₹{fees.paid_amount}</p>
          <p>Total: ₹{fees.total_fee}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', padding: '20px' },
  buttons: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }
};

export default Dashboard;
