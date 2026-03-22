// app/components/home/home.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InstagramAsideComponent } from '../instagram-aside/instagram-aside';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, InstagramAsideComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  private carritoService = inject(CarritoService);

  mostrarBio: boolean = false;

  toggleBio() {
    this.mostrarBio = !this.mostrarBio;
  }

  librosDestacados = [
    { id: 1, titulo: 'Candelaria', genero: 'Novela histórica', precio: 19990, imagen: 'assets/img/imagen1.jpg', link: 'https://www.amazon.com.mx/Candelaria-María-Jose-Espinoza-ebook/dp/B09WW489FM?ref_=ast_author_dp&th=1&psc=1' },
    { id: 2, titulo: 'El Testigo', genero: 'Misterio y suspenso', precio: 9990, imagen: 'assets/img/imagen2.jpg', link: 'https://www.amazon.com.mx/El-Testigo-colección-Cuentos-Infames/dp/B0F1KMB9MR?ref_=ast_author_dp&th=1&psc=1' },
    { id: 3, titulo: 'La Batalla de Bellalis', genero: 'Aventura juvenil', precio: 6990, imagen: 'assets/img/imagen3.jpg', link: 'https://www.amazon.com.mx/Batalla-Bellalis-Spanish-Maria-Espinoza/dp/B0BM898VW9?ref_=ast_author_dp&th=1&psc=1' },
    { id: 4, titulo: 'Matergonia', genero: 'Ciencia ficción', precio: 17990, imagen: 'assets/img/imagen4.jpg', link: 'https://www.amazon.com.mx/Matergonia-Spanish-María-José-Espinoza/dp/B0C1JDKNPT/ref=sr_1_1?__mk_es_MX=ÅMÅŽÕÑ&crid=XZ7SS8CZZR5A&dib=eyJ2IjoiMSJ9.g224s1EQVhfqH1LlvChpHQ.nRXCr4OSAgoyKCjsuBWAE7rw8IBrPfv06rl0bxrsQ48&dib_tag=se&keywords=matergonia&qid=1774223264&s=books&sprefix=matergonia%2Cstripbooks%2C243&sr=1-1&ufe=app_do%3Aamzn1.fos.de93fa6a-174c-4df7-be7c-5bc8e9c5a71b' }
  ];

  agregarAlCarrito(libro: any) {
    this.carritoService.agregarLibro(libro);
    console.log('Agregado al carrito:', libro.titulo);
  }
}
