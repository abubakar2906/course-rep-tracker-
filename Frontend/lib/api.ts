const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';

export const api = {
  // Auth
  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Students
  getStudents: async () => {
    const res = await fetch(`${API_BASE_URL}/students`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getStudent: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  createStudent: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateStudent: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteStudent: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Courses
  getCourses: async () => {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getCourse: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  createCourse: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateCourse: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteCourse: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Trackers
  getTrackers: async () => {
    const res = await fetch(`${API_BASE_URL}/trackers`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getTracker: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/trackers/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  createTracker: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/trackers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateTracker: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/trackers/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteTracker: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/trackers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Records
  updateRecord: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/records/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  bulkUpdateRecords: async (records: any[]) => {
    const res = await fetch(`${API_BASE_URL}/records/bulk`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ records }),
    });
    return res.json();
  },
};