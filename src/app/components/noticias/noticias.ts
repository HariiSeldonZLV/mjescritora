// app/components/noticias/noticias.ts
import { Component, inject, PLATFORM_ID, OnInit, signal } from '@angular/core';
import { NgIf, NgFor, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getApp } from 'firebase/app';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './noticias.html',
  styleUrl: './noticias.scss'
})
export class NoticiasComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private firestoreService = inject(FirestoreService);
  private authService = inject(AuthService);

  noticias = signal<any[]>([]);
  usuarioAutenticado = signal<boolean>(false);
  editando = false;
  loading = signal<boolean>(true);
  error = signal<string>('');

  nuevaNoticia = {
    titulo: '',
    fecha: new Date().toLocaleDateString('es-ES'),
    resumen: '',
    categoria: 'Evento'
  };

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.cargarNoticias();
      this.verificarAutenticacion();
    }
  }

 // app/components/noticias/noticias.ts

private async cargarNoticias() {
  try {
    this.loading.set(true);
    const data = await this.firestoreService.getCollection('noticias', 'timestamp', 'desc');

    // Formatear los datos para mostrar fechas bonitas
    const noticiasFormateadas = data.map((noticia: any) => {
      // Si tiene timestamp de Firebase, formatearlo
      if (noticia.timestamp) {
        let fecha: Date;

        // Si es un timestamp de Firebase (con toDate)
        if (noticia.timestamp.toDate) {
          fecha = noticia.timestamp.toDate();
        }
        // Si es un string o número
        else if (typeof noticia.timestamp === 'string') {
          fecha = new Date(noticia.timestamp);
        }
        else if (noticia.timestamp instanceof Date) {
          fecha = noticia.timestamp;
        }
        else {
          fecha = new Date();
        }

        // Formatear fecha: "21 de marzo de 2026"
        noticia.fechaFormateada = fecha.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // También guardar fecha corta si la necesitas
        noticia.fechaCorta = fecha.toLocaleDateString('es-ES');
      }
      // Si tiene fecha como string, intentar formatearla
      else if (noticia.fecha) {
        noticia.fechaFormateada = noticia.fecha;
      }
      else {
        noticia.fechaFormateada = 'Fecha no disponible';
      }

      return noticia;
    });

    this.noticias.set(noticiasFormateadas);
    this.loading.set(false);
  } catch (error) {
    console.error('Error cargando noticias:', error);
    this.error.set('Error al cargar las noticias');
    this.loading.set(false);
  }
}

  private verificarAutenticacion() {
    try {
      const auth = getAuth(getApp());
      onAuthStateChanged(auth, (user) => {
        this.usuarioAutenticado.set(!!user);
      });
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      this.usuarioAutenticado.set(false);
    }
  }

async guardarNoticia() {
  // 1. Verificar autenticación
  if (!this.usuarioAutenticado()) {
    this.error.set('No tienes permisos para publicar');
    return;
  }

  // 2. Validar campos obligatorios
  if (!this.nuevaNoticia.titulo?.trim() || !this.nuevaNoticia.resumen?.trim()) {
    this.error.set('Por favor completa título y resumen');
    return;
  }

  // 3. Validar longitud (evitar ataques de longitud excesiva)
  if (this.nuevaNoticia.titulo.length > 200) {
    this.error.set('El título no puede exceder los 200 caracteres');
    return;
  }

  if (this.nuevaNoticia.resumen.length > 5000) {
    this.error.set('El resumen no puede exceder los 5000 caracteres');
    return;
  }

  this.loading.set(true);
  this.error.set('');

  try {
    const ahora = new Date();
    const fechaFormateada = ahora.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // 4. Sanitizar entradas (eliminar HTML y scripts maliciosos)
    const tituloLimpio = this.sanitizeInput(this.nuevaNoticia.titulo.trim());
    const resumenLimpio = this.sanitizeInput(this.nuevaNoticia.resumen.trim());
    const categoriaLimpia = this.sanitizeInput(this.nuevaNoticia.categoria);

    // 5. Obtener el ID del usuario autenticado
    const user = this.authService.getCurrentUser();
    const creadoPor = user ? user.uid : 'desconocido';
    const creadoPorEmail = user ? user.email : 'desconocido';

    // 6. Guardar en Firestore con datos de auditoría
    await this.firestoreService.addDocument('noticias', {
      titulo: tituloLimpio,
      resumen: resumenLimpio,
      categoria: categoriaLimpia,
      fecha: fechaFormateada,
      timestamp: ahora,
      creado: ahora,
      // Datos de auditoría
      creadoPor: creadoPor,
      creadoPorEmail: creadoPorEmail,
      ultimaModificacion: ahora,
      modificadoPor: creadoPor,
      // Metadata
      publicada: true,
      version: 1
    });

    this.limpiarFormulario();
    await this.cargarNoticias();
    this.error.set('');

  } catch (error) {
    console.error('Error guardando noticia:', error);
    this.error.set('Error al guardar la noticia');
  } finally {
    this.loading.set(false);
  }
}


private sanitizeInput(input: string): string {
  if (!input) return '';


  let sanitized = input.replace(/<[^>]*>/g, '');


  sanitized = sanitized.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });


  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
}
  async eliminarNoticia(id: string) {
  if (!this.usuarioAutenticado()) {
    this.error.set('No tienes permisos para eliminar');
    return;
  }

  if (!confirm('¿Estás segura de eliminar esta noticia? Esta acción no se puede deshacer.')) return;

  try {
    const user = this.authService.getCurrentUser();

    await this.firestoreService.deleteDocument('noticias', id);

    console.log(`Noticia ${id} eliminada por ${user?.email}`);

    await this.cargarNoticias();
  } catch (error) {
    console.error('Error eliminando noticia:', error);
    this.error.set('Error al eliminar la noticia');
  }
}

  limpiarFormulario() {
    this.nuevaNoticia = {
      titulo: '',
      fecha: new Date().toLocaleDateString('es-ES'),
      resumen: '',
      categoria: 'Evento'
    };
    this.editando = false;
    this.error.set('');
  }
}
