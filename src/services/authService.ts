// Mock users database
const users = [
  {
    id: 1,
    username: 'tejas',
    password: 'tejas123',
    role: 'user',
    name: 'Tejas User',
    email: 'tejas@example.com'
  },
  {
    id: 2,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    email: 'admin@example.com'
  }
];

// Simulate API call for login
export const login = async (username: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(
        u => u.username === username && u.password === password
      );
      
      if (user) {
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, 500); // Simulate network delay
  });
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};

export const resetPassword = async (email: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.email === email);
      
      if (user) {
        // In a real app, this would send an email with a reset link
        // For demo purposes, we'll just simulate a successful response
        resolve({ success: true });
      } else {
        reject(new Error('No account found with that email address'));
      }
    }, 1000); // Simulate network delay
  });
};

export const hasRole = (role: string) => {
  const user = getCurrentUser();
  return user?.role === role;
};
