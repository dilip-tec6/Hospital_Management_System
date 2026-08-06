import { useEffect, useState } from "react";
import apiClient from "../api/client";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/patients/");
      setPatients(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load patients. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await apiClient.post("/patients/", {
        first_name: firstName,
        last_name: lastName,
        gender: gender || null,
        phone: phone || null,
        blood_group: bloodGroup || null,
      });
      setFirstName("");
      setLastName("");
      setGender("");
      setPhone("");
      setBloodGroup("");
      fetchPatients();
    } catch (err) {
      setError("Failed to create patient.");
    }
  };

  const handleDelete = async (patientId) => {
    try {
      await apiClient.delete(`/patients/${patientId}`);
      fetchPatients();
    } catch (err) {
      setError("Failed to delete patient.");
    }
  };

  return (
    <div>
      <h1>Patients</h1>

      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Blood group"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        />
        <button type="submit">Add Patient</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Blood Group</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.patient_id}>
              <td>{p.patient_id}</td>
              <td>{p.first_name} {p.last_name}</td>
              <td>{p.gender}</td>
              <td>{p.phone}</td>
              <td>{p.blood_group}</td>
              <td>
                <button onClick={() => handleDelete(p.patient_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Patients;