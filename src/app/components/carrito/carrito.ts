import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito'; // <-- Ruta corregida

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.scss']
})
export class CarritoComponent {
  private carritoService = inject(CarritoService);

  items = this.carritoService.items;
  total = computed(() => this.carritoService.obtenerTotal());

  eliminar(id: string) {
    this.carritoService.eliminar(id);
  }

  finalizarPedido() {
    this.carritoService.generarPedidoWhatsApp();
  }
}
