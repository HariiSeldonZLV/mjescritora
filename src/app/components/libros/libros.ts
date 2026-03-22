// app/components/libros/libros.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service'; // ← Ruta corregida

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './libros.html',
  styleUrl: './libros.scss'
})
export class LibrosComponent {
  private carritoService = inject(CarritoService);

  misLibros = [
    {
      id: 1,
      titulo: 'Candelaria',
      subtitulo: 'Novela histórica',
      descripcion: 'Una inmersión en las raíces y los secretos del pasado. Debut literario de ficción histórica que explora la identidad chilena.',
      precio: 19990,
      imagen: 'assets/img/imagen1.jpg',
      amazonLink: 'https://www.amazon.com.mx/Candelaria-María-Jose-Espinoza-ebook/dp/B09WW489FM?ref_=ast_author_dp&th=1&psc=1'
    },
    {
      id: 2,
      titulo: 'El Testigo',
      subtitulo: 'Misterio y suspenso',
      descripcion: 'Parte de la colección "Cuentos Infames". Un relato que mantiene la tensión hasta la última página.',
      precio: 9990,
      imagen: 'assets/img/imagen2.jpg',
      amazonLink: 'https://www.amazon.com.mx/El-Testigo-colección-Cuentos-Infames/dp/B0F1KMB9MR?ref_=ast_author_dp&th=1&psc=1'
    },
    {
      id: 3,
      titulo: 'La Batalla de Bellalis',
      subtitulo: 'Aventura juvenil',
      descripcion: 'Un viaje épico para los más jóvenes, lleno de valor, fantasía y descubrimientos inolvidables.',
      precio: 6990,
      imagen: 'assets/img/imagen3.jpg',
      amazonLink: 'https://www.amazon.com.mx/Batalla-Bellalis-Spanish-Maria-Espinoza/dp/B0BM898VW9?ref_=ast_author_dp&th=1&psc=1'
    },
    {
      id: 4,
      titulo: 'Matergonia',
      subtitulo: 'Ciencia ficción',
      descripcion: 'Una visión futurista que cuestiona nuestra realidad actual a través de los ojos del mañana.',
      precio: 17990,
      imagen: 'assets/img/imagen4.jpg',
      amazonLink: 'https://www.amazon.com.mx/Matergonia-Spanish-María-José-Espinoza/dp/B0C1JDKNPT/ref=sr_1_1?__mk_es_MX=ÅMÅŽÕÑ&crid=XZ7SS8CZZR5A&dib=eyJ2IjoiMSJ9.g224s1EQVhfqH1LlvChpHQ.nRXCr4OSAgoyKCjsuBWAE7rw8IBrPfv06rl0bxrsQ48&dib_tag=se&keywords=matergonia&qid=1774223356&s=books&sprefix=matergonia%2Cstripbooks%2C243&sr=1-1&ufe=app_do%3Aamzn1.fos.de93fa6a-174c-4df7-be7c-5bc8e9c5a71b'
    }
  ];

  comprar(libro: any) {
    window.open(libro.amazonLink, '_blank');
  }

  agregarAlCarrito(libro: any) {
    this.carritoService.agregarLibro(libro);
    console.log('Agregado al carrito:', libro.titulo);
  }
}
