import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.scss'
})
export class ServiciosComponent {
  servicios = [
    {
      titulo: 'Comunicación Estratégica',
      descripcion: 'Asesoría integral para potenciar tu marca personal o institucional.',
      detalles: ['Plan de medios', 'Redacción de discursos', 'Identidad narrativa'],
      icono: 'C'
    },
    {
      titulo: 'Edición Profesional',
      descripcion: 'Acompañamiento completo en el proceso de creación y publicación.',
      detalles: ['Corrección de estilo', 'Gestión editorial', 'Maquetación'],
      icono: 'E'
    },
    {
      titulo: 'Coaching',
      descripcion: 'Sesiones personalizadas para desbloquear la creatividad.',
      detalles: ['Coaching literario', 'Liderazgo comunicativo', 'Talleres'],
      icono: 'C'
    }
  ];
}
