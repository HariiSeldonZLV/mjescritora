import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importamos esto para el botón "Ver Catálogo"

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], // Añadimos RouterModule aquí
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

  // Lógica para el desplegable de biografía
  mostrarBio: boolean = false;

  toggleBio() {
    this.mostrarBio = !this.mostrarBio;
  }

  // Tu lista de libros destacados
  librosDestacados = [
    { id: 1, titulo: 'Candelaria', genero: 'Novela histórica', precio: 7900, imagen: 'assets/img/imagen1.jpg', link: 'https://www.amazon.com.mx/...' },
    { id: 2, titulo: 'El Testigo', genero: 'Misterio y suspenso', precio: 7500, imagen: 'assets/img/imagen2.jpg', link: 'https://www.amazon.com.mx/...' },
    { id: 3, titulo: 'La Batalla de Bellalis', genero: 'Aventura juvenil', precio: 6900, imagen: 'assets/img/imagen3.jpg', link: 'https://www.amazon.com.mx/...' },
    { id: 4, titulo: 'Matergonia', genero: 'Ciencia ficción', precio: 8200, imagen: 'assets/img/imagen4.jpg', link: 'https://www.amazon.com.mx/...' },
    { id: 5, titulo: 'Memorias de una profesora rural', genero: 'Relatos autobiográficos', precio: 7200, imagen: 'assets/img/imagen5.jpg', link: 'https://www.amazon.com.mx/...' }
  ];

  agregarAlCarrito(libro: any) {
    console.log('Agregado al carrito:', libro.titulo);
  }
}
