export interface Libro {
  id: string; // Un ID único para el carrito
  titulo: string;
  autor: string;
  precio: number;
  stock: number;
  sinopsis: string;
  portadaUrl: string;
  formato: 'Físico' | 'Digital' | 'Ambos';
  genero: string;
}
