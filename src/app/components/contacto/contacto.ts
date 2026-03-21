// app/components/contacto/contacto.ts
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss'
})
export class ContactoComponent {
  private platformId = inject(PLATFORM_ID);
  private firestoreService = inject(FirestoreService);

  loading = signal<boolean>(false);
  success = signal<string>('');
  error = signal<string>('');

  // Control de spam
  private ultimoEnvio = 0;
  private readonly MIN_INTERVALO_MS = 60000; // 60 segundos entre mensajes
  private readonly MAX_MENSAJES_POR_DIA = 5;
  private contadorMensajes = 0;

  formulario = {
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  };

  // Validar email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar teléfono (opcional, formato chileno)
  private isValidPhone(telefono: string): boolean {
    if (!telefono) return true; // Teléfono es opcional
    const phoneRegex = /^(\+56|0)[2-9]\d{8}$/;
    return phoneRegex.test(telefono);
  }

  // Sanitizar entradas
  private sanitizeInput(input: string): string {
    if (!input) return '';

    // Eliminar etiquetas HTML
    let sanitized = input.replace(/<[^>]*>/g, '');

    // Escapar caracteres especiales
    sanitized = sanitized.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });

    // Eliminar espacios múltiples
    sanitized = sanitized.replace(/\s+/g, ' ').trim();

    return sanitized;
  }

  // Detectar spam básico
  private isSpam(): boolean {
    const ahora = Date.now();

    // Verificar intervalo mínimo entre mensajes
    if (ahora - this.ultimoEnvio < this.MIN_INTERVALO_MS) {
      this.error.set('Por favor espera un minuto antes de enviar otro mensaje');
      return true;
    }

    // Verificar límite diario
    if (this.contadorMensajes >= this.MAX_MENSAJES_POR_DIA) {
      this.error.set('Has alcanzado el límite de mensajes por día');
      return true;
    }

    // Detectar URLs sospechosas en el mensaje
    const urlPattern = /(http|https|ftp|www\.)/i;
    if (urlPattern.test(this.formulario.mensaje)) {
      this.error.set('El mensaje no puede contener enlaces');
      return true;
    }

    // Detectar palabras de spam comunes
    const spamWords = ['viagra', 'casino', 'préstamo', 'dinero fácil', 'click here', 'http'];
    const mensajeLower = this.formulario.mensaje.toLowerCase();
    for (const word of spamWords) {
      if (mensajeLower.includes(word)) {
        this.error.set('El mensaje contiene contenido no permitido');
        return true;
      }
    }

    return false;
  }

  async enviarMensaje() {
    // Validaciones básicas
    if (!this.formulario.nombre.trim()) {
      this.error.set('Por favor ingresa tu nombre');
      return;
    }

    if (!this.formulario.email.trim()) {
      this.error.set('Por favor ingresa tu email');
      return;
    }

    if (!this.isValidEmail(this.formulario.email)) {
      this.error.set('Por favor ingresa un email válido');
      return;
    }

    if (this.formulario.telefono && !this.isValidPhone(this.formulario.telefono)) {
      this.error.set('Por favor ingresa un teléfono válido (ej: +56912345678)');
      return;
    }

    if (!this.formulario.mensaje.trim()) {
      this.error.set('Por favor ingresa tu mensaje');
      return;
    }

    // Validar longitud de campos
    if (this.formulario.nombre.length > 100) {
      this.error.set('El nombre no puede exceder los 100 caracteres');
      return;
    }

    if (this.formulario.asunto.length > 200) {
      this.error.set('El asunto no puede exceder los 200 caracteres');
      return;
    }

    if (this.formulario.mensaje.length > 2000) {
      this.error.set('El mensaje no puede exceder los 2000 caracteres');
      return;
    }

    if (!isPlatformBrowser(this.platformId)) {
      this.error.set('El formulario no está disponible en este entorno');
      return;
    }

    // Control de spam
    if (this.isSpam()) {
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    try {
      // Sanitizar todos los campos
      const nombreLimpio = this.sanitizeInput(this.formulario.nombre.trim());
      const emailLimpio = this.sanitizeInput(this.formulario.email.trim().toLowerCase());
      const telefonoLimpio = this.formulario.telefono ? this.sanitizeInput(this.formulario.telefono.trim()) : '';
      const asuntoLimpio = this.formulario.asunto ? this.sanitizeInput(this.formulario.asunto.trim()) : '';
      const mensajeLimpio = this.sanitizeInput(this.formulario.mensaje.trim());

      // Obtener datos del cliente para auditoría
      const userAgent = navigator.userAgent;
      const idioma = navigator.language;
      const ip = await this.obtenerIP(); // Opcional: obtener IP

      // Guardar en Firestore
      const mensajeData = {
        nombre: nombreLimpio,
        email: emailLimpio,
        telefono: telefonoLimpio,
        asunto: asuntoLimpio,
        mensaje: mensajeLimpio,
        fecha: new Date().toLocaleString('es-ES'),
        timestamp: new Date(),
        // Estado
        leido: false,
        respondido: false,
        // Datos de auditoría
        ip: ip,
        userAgent: userAgent,
        idioma: idioma,
        // Metadata
        version: 1
      };

      await this.firestoreService.addDocument('mensajes_contacto', mensajeData);

      // Actualizar contadores
      this.ultimoEnvio = Date.now();
      this.contadorMensajes++;

      this.success.set('¡Mensaje enviado con éxito! Te contactaremos pronto.');
      this.limpiarFormulario();

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      this.error.set('Error al enviar el mensaje. Por favor intenta nuevamente.');
    } finally {
      this.loading.set(false);
    }
  }

  // Opcional: Obtener IP del cliente (usando un servicio externo)
  private async obtenerIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error obteniendo IP:', error);
      return 'no disponible';
    }
  }

  limpiarFormulario() {
    this.formulario = {
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: ''
    };
  }

  cerrarMensaje() {
    this.success.set('');
    this.error.set('');
  }
}
