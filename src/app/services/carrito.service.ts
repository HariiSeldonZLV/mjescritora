// app/services/carrito.service.ts
import { Injectable, signal } from '@angular/core';

export interface CartItem {
  id: number;
  titulo: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  items = signal<CartItem[]>([]);

  agregarLibro(libro: any) {
    this.items.update((prev: CartItem[]) => {
      const existing = prev.find(item => item.id === libro.id);
      if (existing) {
        return prev.map(item =>
          item.id === libro.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, {
        id: libro.id,
        titulo: libro.titulo,
        precio: libro.precio,
        imagen: libro.imagen || 'assets/img/default.jpg',
        cantidad: 1
      }];
    });
  }

  eliminarLibro(id: number) {
    this.items.update((prev: CartItem[]) => prev.filter(item => item.id !== id));
  }

  actualizarCantidad(id: number, cantidad: number) {
    if (cantidad <= 0) {
      this.eliminarLibro(id);
      return;
    }
    this.items.update((prev: CartItem[]) =>
      prev.map(item =>
        item.id === id ? { ...item, cantidad } : item
      )
    );
  }

  obtenerTotal(): number {
    return this.items().reduce((acc: number, item: CartItem) => acc + (item.precio * item.cantidad), 0);
  }

  obtenerCantidadItems(): number {
    return this.items().reduce((acc: number, item: CartItem) => acc + item.cantidad, 0);
  }

  vaciarCarrito() {
    this.items.set([]);
  }

  generarMensajeWhatsApp(telefono: string): string {
    const total = this.obtenerTotal();
    const itemsLista = this.items().map(item => {
      return `• ${item.titulo} x${item.cantidad} = $${(item.precio * item.cantidad).toLocaleString('es-CL')}`;
    }).join('\n');

    const mensaje = encodeURIComponent(
      `🛍️ *NUEVO PEDIDO* 🛍️\n\n` +
      `*Detalle del pedido:*\n${itemsLista}\n\n` +
      `*Total:* $${total.toLocaleString('es-CL')}\n\n` +
      `*Datos para depósito:*\n` +
      `🏦 Banco: Banco Estado-Ahorro\n` +
      `💰 Cuenta: 32162185906\n` +
      `📧 Titular: María José Espinoza\n` +
      `🆔 RUT: 14.174.172-1\n\n` +
      `*Instrucciones:*\n` +
      `1. Realiza el depósito por el monto total\n` +
      `2. Envía el comprobante a este WhatsApp\n` +
      `3. Confirma tu pedido con tu nombre y dirección\n\n` +
      `¡Gracias por tu compra! 📚`
    );
    return `https://wa.me/${telefono}?text=${mensaje}`;
  }
}
