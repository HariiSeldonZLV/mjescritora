import { Injectable } from '@angular/core';
import { Libro } from '../models/libro.model';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private catalogo: Libro[] = [
    { id: '1', titulo: 'Matergonia', precio: 15000, stock: 20, sinopsis: '...', portadaUrl: 'assets/matergonia.jpg', genero: 'Fantasía', autor: 'María José Espinoza', formato: 'Físico' },
    // ... agrega aquí los otros 4 libros
  ];

  getLibros(): Libro[] {
    return this.catalogo;
  }
}
