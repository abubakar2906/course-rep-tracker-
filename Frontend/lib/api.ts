const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
export const api = {
  // Auth
  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
    });
    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.json();
  },

  // Students
  getStudents: async () => {
    const res = await fetch(`${API_BASE_URL}/students`, {
      credentials: 'include',
    });
    return res.json();
  },

  getStudent: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      credentials: 'include',
    });
    return res.json();
  },

  createStudent: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateStudent: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteStudent: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.json();
  },
  // Courses
  getCourses: async () => {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      credentials: 'include',
    });
    return res.json();
  },

  getCourse: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      credentials: 'include',
    });
    return res.json();
  },

  createCourse: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateCourse: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteCourse: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.json();
  },

  // Trackers
  getTrackers: async () => {
    const res = await fetch(`${API_BASE_URL}/trackers`, {
      credentials: 'include',
    });
    return res.json();
  },

  getTracker: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/trackers/${id}`, {
      credentials: 'include',
    });
    return res.json();
  },

  createTracker: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/trackers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateTracker: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/trackers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteTracker: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/trackers/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.json();
  },

  // Records
  updateRecord: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/records/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  bulkUpdateRecords: async (records: any[]) => {
  const res = await fetch(`${API_BASE_URL}/records/bulk`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ records }),
  });
  return res.json();
},
};