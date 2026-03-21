import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // Definimos el signal con un array vacío
  items = signal<any[]>([]);

  agregarLibro(libro: any) {
    // Especificamos que 'prev' es un array
    this.items.update((prev: any[]) => [...prev, libro]);
  }

  eliminarLibro(id: number) {
    // Especificamos tipos para evitar el error TS7006
    this.items.update((prev: any[]) => prev.filter((item: any) => item.id !== id));
  }

  obtenerTotal() {
    // Especificamos tipos en el reduce
    return this.items().reduce((acc: number, item: any) => acc + item.precio, 0);
  }

  enviarWhatsApp(telefono: string) {
    const mensaje = encodeURIComponent(
      `Hola! Me interesa comprar estos libros:\n` +
      this.items().map((l: any) => `- ${l.titulo} ($${l.precio})`).join('\n') +
      `\n\nTotal: $${this.obtenerTotal()}`
    );

    // El error de 'window' se soluciona asegurando que el lib 'dom' esté en tsconfig
    // o usando (window as any) si persiste el bloqueo
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
  }
}
