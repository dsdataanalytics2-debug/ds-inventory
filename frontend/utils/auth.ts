interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export const hasRole = (allowedRoles: string[]): boolean => {
  const user = getUser();
  return user ? allowedRoles.includes(user.role) : false;
};

export const canAddEdit = (): boolean => {
  return hasRole(['superadmin', 'admin', 'editor']);
};

export const canDelete = (): boolean => {
  return hasRole(['superadmin', 'admin']);
};

export const canManageUsers = (): boolean => {
  return hasRole(['superadmin']);
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const apiCall = async (url: string, options: RequestInit = {}) => {
  const headers = getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });

  if (response.status === 401) {
    logout();
    throw new Error('Authentication required');
  }

  return response;
};
