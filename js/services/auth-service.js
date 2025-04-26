import { auth } from '../firebase-config.js';

class AuthService {
    constructor() {
        this.auth = auth;
    }

    // Sign up with email and password
    async signUp(email, password, userType) {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            await this.updateUserProfile(userCredential.user, { userType });
            return userCredential.user;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    // Update user profile
    async updateUserProfile(user, profileData) {
        try {
            await user.updateProfile(profileData);
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    // Sign out
    async signOut() {
        try {
            await this.auth.signOut();
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    // Handle authentication errors
    handleAuthError(error) {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return new Error('This email is already registered.');
            case 'auth/invalid-email':
                return new Error('Please enter a valid email address.');
            case 'auth/operation-not-allowed':
                return new Error('Email/password accounts are not enabled.');
            case 'auth/weak-password':
                return new Error('Password should be at least 6 characters.');
            case 'auth/user-not-found':
                return new Error('No account found with this email.');
            case 'auth/wrong-password':
                return new Error('Incorrect password.');
            case 'auth/too-many-requests':
                return new Error('Too many attempts. Please try again later.');
            default:
                return new Error('An error occurred. Please try again.');
        }
    }
}

export const authService = new AuthService(); 