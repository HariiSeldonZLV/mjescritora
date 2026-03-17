import { Injectable, signal } from '@angular/core';
import { Libro } from '../models/libro.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  items = signal<Libro[]>([]);

  agregar(libro: Libro) {
    this.items.update(prev => [...prev, libro]);
  }

  // Este método DEBE estar dentro de la clase
  eliminar(id: string) {
    this.items.update(prev => prev.filter(item => item.id !== id));
  }

  obtenerTotal() {
    return this.items().reduce((acc, item) => acc + item.precio, 0);
  }

  generarPedidoWhatsApp() {
    const telefono = "569XXXXXXXX";
    const listaLibros = this.items().map(l => `- ${l.titulo} ($${l.precio})`).join('%0A');
    const mensaje = `Hola María José! 🖋️ Me interesa comprar:%0A${listaLibros}%0A%0ATotal: $${this.obtenerTotal()}`;
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
  }
}
