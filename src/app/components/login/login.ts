// app/components/login/login.ts
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getApp } from 'firebase/app';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  async login() {
    // Validaciones
    if (!this.email.trim()) {
      this.errorMessage = 'Por favor ingresa tu email';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'Por favor ingresa tu contraseña';
      return;
    }

    // Solo ejecutar en navegador
    if (!isPlatformBrowser(this.platformId)) {
      this.errorMessage = 'El login no está disponible en este entorno';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const auth = getAuth(getApp());
      await signInWithEmailAndPassword(auth, this.email, this.password);

      // Redirigir a noticias donde está el panel de administración
      this.router.navigate(['/noticias']);

    } catch (error: any) {
      console.error('Error en login:', error);

      switch (error.code) {
        case 'auth/invalid-email':
          this.errorMessage = 'Email inválido';
          break;
        case 'auth/user-disabled':
          this.errorMessage = 'Usuario deshabilitado';
          break;
        case 'auth/user-not-found':
          this.errorMessage = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Contraseña incorrecta';
          break;
        default:
          this.errorMessage = 'Credenciales incorrectas';
      }
    } finally {
      this.loading = false;
    }
  }
}
