// app/components/carrito/carrito.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.scss'
})
export class CarritoComponent {
  private carritoService = inject(CarritoService);

  items = this.carritoService.items;
  total = this.carritoService.obtenerTotal;
  cantidadItems = this.carritoService.obtenerCantidadItems;

  telefonoWhatsApp = '56991524369';

  eliminarItem(id: number) {
    this.carritoService.eliminarLibro(id);
  }

  actualizarCantidad(id: number, cantidad: number) {
    this.carritoService.actualizarCantidad(id, cantidad);
  }

  vaciarCarrito() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      this.carritoService.vaciarCarrito();
    }
  }

  generarPedido() {
    if (this.items().length === 0) {
      alert('El carrito está vacío');
      return;
    }
    const url = this.carritoService.generarMensajeWhatsApp(this.telefonoWhatsApp);
    window.open(url, '_blank');
  }
}
