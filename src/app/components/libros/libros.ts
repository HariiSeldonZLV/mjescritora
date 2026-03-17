import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para el pipe currency
import { LibrosService } from '../../services/libros'; // Ruta corregida
import { CarritoService } from '../../services/carrito'; // Ruta corregida

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './libros.html',
  styleUrls: ['./libros.scss']
})
export class LibrosComponent {
  private librosService = inject(LibrosService);
  private carritoService = inject(CarritoService);

  libros = signal(this.librosService.getLibros());

  agregarAlCarrito(libro: any) {
    this.carritoService.agregar(libro);
  }
}
