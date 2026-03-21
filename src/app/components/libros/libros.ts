import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './libros.html',
  styleUrl: './libros.scss'
})
export class LibrosComponent {
  misLibros = [
    {
      id: 1,
      titulo: 'Candelaria',
      subtitulo: 'Novela histórica',
      descripcion: 'Una inmersión en las raíces y los secretos del pasado. Debut literario de ficción histórica que explora la identidad chilena.',
      precio: 19990,
      imagen: 'assets/img/imagen1.jpg',
      amazonLink: 'https://www.amazon.com.mx/...'
    },
    {
      id: 2,
      titulo: 'El Testigo',
      subtitulo: 'Misterio y suspenso',
      descripcion: 'Parte de la colección "Cuentos Infames". Un relato que mantiene la tensión hasta la última página.',
      precio: 9990,
      imagen: 'assets/img/imagen2.jpg',
      amazonLink: 'https://www.amazon.com.mx/...'
    },
    {
      id: 3,
      titulo: 'La Batalla de Bellalis',
      subtitulo: 'Aventura juvenil',
      descripcion: 'Un viaje épico para los más jóvenes, lleno de valor, fantasía y descubrimientos inolvidables.',
      precio: 6990,
      imagen: 'assets/img/imagen3.jpg',
      amazonLink: 'https://www.amazon.com.mx/...'
    },
    {
      id: 4,
      titulo: 'Matergonia',
      subtitulo: 'Ciencia ficción',
      descripcion: 'Una visión futurista que cuestiona nuestra realidad actual a través de los ojos del mañana.',
      precio: 17990,
      imagen: 'assets/img/imagen4.jpg',
      amazonLink: 'https://www.amazon.com.mx/...'
    }
  ];

  comprar(libro: any) {
    window.open(libro.amazonLink, '_blank');
  }
}
