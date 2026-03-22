import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LibrosComponent } from './components/libros/libros';
import { ServiciosComponent } from './components/servicios/servicios';
import { NoticiasComponent } from './components/noticias/noticias';
import { ContactoComponent } from './components/contacto/contacto';
import { LoginComponent } from './components/login/login';
import { MensajesComponent } from './components/mensajes/mensajes';
import { authGuard } from './guards/auth.guard';
import { CarritoComponent } from './components/carrito/carrito';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'libros', component: LibrosComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'admin', component: LoginComponent },
  { path: 'mensajes', component: MensajesComponent, canActivate: [authGuard] },
   { path: 'carrito', component: CarritoComponent },
  { path: '**', redirectTo: '' }
];
