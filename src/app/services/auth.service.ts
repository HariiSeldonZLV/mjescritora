// app/services/auth.service.ts (mejorado)
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { getAuth, onAuthStateChanged, User, signOut, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { getApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  public currentUser = signal<User | null>(null);
  public authError = signal<string | null>(null);
  private maxAttempts = 3;
  private attemptCount = 0;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAuth();
    }
  }

  private initAuth(): void {
    try {
      const app = getApp();
      const auth = getAuth(app);

      onAuthStateChanged(auth, (user) => {
        this.currentUser.set(user);
        this.attemptCount = 0; // Resetear intentos al autenticar
      });
    } catch (error) {
      console.error('Error inicializando Firebase Auth:', error);
    }
  }

  async login(email: string, password: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('Auth no disponible en este entorno');
    }

    // Validación de entrada
    if (!this.isValidEmail(email)) {
      throw new Error('Email inválido');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Prevenir fuerza bruta
    if (this.attemptCount >= this.maxAttempts) {
      throw new Error('Demasiados intentos. Espera unos minutos.');
    }

    try {
      const auth = getAuth(getApp());
      const result = await signInWithEmailAndPassword(auth, email, password);
      this.attemptCount = 0;
      this.authError.set(null);
    } catch (error) {
      this.attemptCount++;
      const authError = error as AuthError;
      this.authError.set(this.getErrorMessage(authError.code));
      throw error;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/user-disabled':
        return 'Usuario deshabilitado';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Espera unos minutos.';
      default:
        return 'Error al iniciar sesión';
    }
  }

  async logout(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const auth = getAuth(getApp());
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }
}
