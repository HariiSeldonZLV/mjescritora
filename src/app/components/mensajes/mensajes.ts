// app/components/mensajes/mensajes.ts
import { Component, inject, PLATFORM_ID, OnInit, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mensajes.html',
  styleUrl: './mensajes.scss'
})
export class MensajesComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private firestoreService = inject(FirestoreService);
  private authService = inject(AuthService);
  private router = inject(Router);

  mensajes = signal<any[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');

  async ngOnInit() {
    // Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      await this.cargarMensajes();
    }
  }

  private async cargarMensajes() {
    try {
      this.loading.set(true);
      const data = await this.firestoreService.getCollection('mensajes_contacto', 'timestamp', 'desc');
      this.mensajes.set(data);
      this.loading.set(false);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      this.error.set('Error al cargar los mensajes');
      this.loading.set(false);
    }
  }

  async marcarComoLeido(id: string, actualLeido: boolean) {
    try {
      await this.firestoreService.updateDocument('mensajes_contacto', id, {
        leido: !actualLeido
      });
      await this.cargarMensajes();
    } catch (error) {
      console.error('Error actualizando mensaje:', error);
      this.error.set('Error al actualizar mensaje');
    }
  }

  formatearFecha(timestamp: any): string {
    if (!timestamp) return 'Fecha no disponible';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return new Date(timestamp).toLocaleString('es-ES');
  }

  // Función para recargar mensajes manualmente
  async recargar() {
    await this.cargarMensajes();
  }
}
