import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

export const authService = {
  async login(email: string, _password: string, role: UserRole): Promise<UserProfile> {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Match by role or email
    const match = INITIAL_USERS.find((u) => u.role === role);
    if (match) {
      return { ...match, email: email || match.email };
    }

    return {
      id: `usr_${Date.now()}`,
      name: role === 'principal' ? 'Dr. Ramesh Sundaram' : role === 'teacher' ? 'Prof. Anitha Vasudevan' : 'Suresh Kumar',
      email: email || `${role}@edunexus.edu`,
      role,
      designation: role === 'principal' ? 'Principal' : role === 'teacher' ? 'Faculty' : 'Parent',
      department: role === 'teacher' ? 'Computer Science & Engineering' : undefined,
    };
  },

  async getDemoUser(role: UserRole): Promise<UserProfile> {
    const user = INITIAL_USERS.find((u) => u.role === role);
    if (!user) {
      throw new Error(`Demo user for role ${role} not found`);
    }
    return user;
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
  },
};
