import { useState, useEffect } from 'react';
import { getAppointments, createAppointment, updateAppointment } from '../api/appointments';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояние формы
  const [formData, setFormData] = useState({
    appointmentId: null, // <-- для редактирования
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

  // Изменение полей формы
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Отправка формы
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (formData.appointmentId) {
        // ===== КОД ДЛЯ РЕДАКТИРОВАНИЯ =====
        await updateAppointment(formData.appointmentId, formData);
        // ==================================
      } else {
        await createAppointment(formData);
      }
      // Очистка формы и обновление списка
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
    setFormData(appointment); // заполняем форму данными для редактирования
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
              <button onClick={() => handleEdit(a)}>Редактировать</button> {/* кнопка редактирования */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
