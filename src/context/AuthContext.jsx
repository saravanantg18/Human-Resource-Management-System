import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/initialData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dayflow_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    // Default to Sarah Jenkins (HR Admin) or Alex Morgan (Employee)
    return INITIAL_USERS[0]; // Admin by default for rich testing
  });

  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem('dayflow_all_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem('dayflow_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('dayflow_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dayflow_current_user');
    }
  }, [user]);

  const login = (email, password) => {
    const found = allUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      setUser(found);
      return { success: true, user: found };
    }
    return { success: false, message: 'Invalid email or password credentials.' };
  };

  const loginAsRole = (role) => {
    const demoUser = allUsers.find(u => u.role === role) || allUsers[0];
    setUser(demoUser);
    return demoUser;
  };

  const register = ({ name, email, password, role, employeeId }) => {
    // Validation
    const exists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const idExists = allUsers.some(u => u.id.toLowerCase() === employeeId.toLowerCase());
    if (idExists) {
      return { success: false, message: 'Employee ID is already taken.' };
    }

    const newUser = {
      id: employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      password,
      role: role || 'Employee',
      position: role === 'HR' ? 'HR Specialist' : 'Software Associate',
      department: role === 'HR' ? 'Human Resources' : 'Engineering',
      phone: '+1 (555) 000-1122',
      address: '100 Main Street, Innovation City',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      joinedDate: new Date().toISOString().split('T')[0],
      verified: true
    };

    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserProfile = (updatedData) => {
    setUser(prev => {
      const next = { ...prev, ...updatedData };
      setAllUsers(users => users.map(u => u.id === prev.id ? next : u));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      allUsers,
      login,
      loginAsRole,
      register,
      logout,
      updateUserProfile,
      isAdmin: user?.role === 'HR'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
