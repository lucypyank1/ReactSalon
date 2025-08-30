import { useState, useEffect } from 'react';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../api/appointments';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    appointmentId: null,
    clientId: '',
    masterId: '',
    serviceId: '',
    appointmentTime: '',
    status: ''
  });

  const [formError, setFormError] = useState(null);

  // Загрузка списка
  async function loadAppointments() {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (formData.appointmentId) {
        await updateAppointment(formData.appointmentId, formData);
      } else {
        await createAppointment(formData);
      }
      setFormData({
        appointmentId: null,
        clientId: '',
        masterId: '',
        serviceId: '',
        appointmentTime: '',
        status: ''
      });
      setFormError(null);
      loadAppointments();
    } catch (err) {
      setFormError(err.message);
    }
  }

  // ===== КОД ДЛЯ РЕДАКТИРОВАНИЯ =====
  function handleEdit(appointment) {
    setFormData(appointment);
  }
  // ==================================

  // ===== КОД ДЛЯ УДАЛЕНИЯ =====
  async function handleDelete(id) {
    if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
    try {
      await deleteAppointment(id);
      loadAppointments(); // обновляем список после удаления
    } catch (err) {
      setError(err.message);
    }
  }
  // ==================================

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h2>{formData.appointmentId ? 'Редактировать запись' : 'Добавить новую запись'}</h2>
      {formError && <p style={{ color: 'red' }}>Ошибка: {formError}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="number"
          name="clientId"
          placeholder="Client ID"
          value={formData.clientId}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="masterId"
          placeholder="Master ID"
          value={formData.masterId}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="serviceId"
          placeholder="Service ID"
          value={formData.serviceId}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="appointmentTime"
          value={formData.appointmentTime}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="status"
          placeholder="Status"
          value={formData.status}
          onChange={handleChange}
        />
        <button type="submit">{formData.appointmentId ? 'Обновить' : 'Добавить'}</button>
      </form>

      <h2>Список записей</h2>
      {appointments.length === 0 ? (
        <p>Записей нет</p>
      ) : (
        <ul>
          {appointments.map(a => (
            <li key={a.appointmentId}>
              ID: {a.appointmentId}, Время: {a.appointmentTime}, Статус: {a.status || 'не указан'}
              <button onClick={() => handleEdit(a)}>Редактировать</button>
              <button onClick={() => handleDelete(a.appointmentId)} style={{ marginLeft: '10px', color: 'red' }}>Удалить</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
