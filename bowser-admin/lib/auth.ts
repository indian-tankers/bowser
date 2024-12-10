import axios from 'axios';
import { User, LoginResponse, SignupResponse } from '../types/auth';
import { registerPushSubscription, unregisterPushSubscription } from '@/utils/pushNotifications';

export const API_URL = 'http://192.168.137.1:5000'; //https://bowser-backend-2cdr.onrender.com

export async function signup(userData: { userId: string; password: string; name: string; phoneNumber: string }): Promise<SignupResponse> {
    try {
        const response = await axios.post<SignupResponse>(`${API_URL}/auth/admin/signup`, userData);
        if (response.data.token) {
            localStorage.setItem('adminToken', response.data.token);
            localStorage.setItem('adminUser', JSON.stringify(response.data.user));
            return response.data;
        }
        throw new Error('Signup failed');
    } catch (error) {
        throw error;
    }
}

export async function login(userId: string, password: string): Promise<LoginResponse> {
    try {
        const response = await axios.post<LoginResponse>(`${API_URL}/auth/admin/login`, {
            userId,
            password,
            appName: 'Bowser Admin'
        });
        if (response.data.token) {
            localStorage.setItem('adminToken', response.data.token);
            localStorage.setItem('adminUser', JSON.stringify(response.data.user));
            localStorage.setItem('isLoggedIn', 'true');

            if (response.data.user.phoneNumber) {
                await registerPushSubscription(response.data.user.phoneNumber);
            }

            return response.data;
        }
        throw new Error('Login failed');
    } catch (error) {
        throw error;
    }
}

export async function logout(): Promise<void> {
    try {
        // Retrieve user data from local storage
        const userData = localStorage.getItem('adminUser');
        if (!userData) {
            console.error('No user data found in local storage.');
            return;
        }

        const jsonData = JSON.parse(userData);
        const mobileNo = jsonData.phoneNumber;

        // Attempt to unregister push subscription
        const unregisterResponse = await unregisterPushSubscription(mobileNo);

        if (unregisterResponse && unregisterResponse.success) {
            // Unregistration successful; proceed to log out
            console.log('Push subscription unregistered successfully.');

            // Clear user-related data from local storage
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            localStorage.setItem('isLoggedIn', 'false');

            // Redirect to login page
            window.location.href = "/login";
        } else {
            // Unregistration failed; do not proceed with logout
            console.error('Failed to unregister push subscription:', unregisterResponse?.error);
            alert('Failed to unregister push notifications. Logout aborted.');
        }
    } catch (error) {
        console.error('Error during logout process:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}


export function isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
}

export function getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('adminUser');
        return userData ? JSON.parse(userData) : null;
    }
    return null;
}
