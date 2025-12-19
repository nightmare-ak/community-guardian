
import { UserProfile, UserRole } from "../types";
import { CREATOR_EMAIL } from "../constants";

const USERS_STORAGE_KEY = 'guardian_profiles';
const AUTH_KEY = 'guardian_current_user';
const CREDENTIALS_KEY = 'guardian_credentials';

export const authService = {
  // Simulated SignUp with Email/Password
  signUp: (email: string, password: string, name: string): UserProfile => {
    const profiles = authService.getProfiles();
    const credentials = authService.getCredentials();

    if (profiles.find(p => p.email === email)) {
      throw new Error("Email already registered.");
    }

    const role: UserRole = email.toLowerCase() === CREATOR_EMAIL.toLowerCase() ? 'Creator' : 'User';
    
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      email,
      displayName: name,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      role
    };

    profiles.push(profile);
    credentials[email] = password; // Mocking password storage

    authService.saveProfiles(profiles);
    authService.saveCredentials(credentials);

    localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
    return profile;
  },

  // Simulated SignIn with Email/Password
  signIn: (email: string, password: string): UserProfile => {
    const profiles = authService.getProfiles();
    const credentials = authService.getCredentials();

    if (credentials[email] !== password) {
      throw new Error("Invalid email or password.");
    }

    const profile = profiles.find(p => p.email === email);
    if (!profile) throw new Error("User profile not found.");

    localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
    return profile;
  },

  // Simulated Google Sign-In
  loginWithGoogle: (email: string, name: string): UserProfile => {
    const profiles = authService.getProfiles();
    let profile = profiles.find(p => p.email === email);

    if (!profile) {
      const role: UserRole = email.toLowerCase() === CREATOR_EMAIL.toLowerCase() ? 'Creator' : 'User';
      profile = {
        id: crypto.randomUUID(),
        email,
        displayName: name,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        role
      };
      profiles.push(profile);
      authService.saveProfiles(profiles);
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
    return profile;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser: (): UserProfile | null => {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  getProfiles: (): UserProfile[] => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  saveProfiles: (profiles: UserProfile[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(profiles));
  },

  getCredentials: (): Record<string, string> => {
    const saved = localStorage.getItem(CREDENTIALS_KEY);
    return saved ? JSON.parse(saved) : {};
  },

  saveCredentials: (credentials: Record<string, string>) => {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  },

  updateRole: (userId: string, newRole: UserRole) => {
    const profiles = authService.getProfiles();
    const updated = profiles.map(p => 
      p.id === userId && p.email.toLowerCase() !== CREATOR_EMAIL.toLowerCase() ? { ...p, role: newRole } : p
    );
    authService.saveProfiles(updated);
  }
};
