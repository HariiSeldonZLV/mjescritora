import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LibrosComponent } from './components/libros/libros';
import { ServiciosComponent } from './components/servicios/servicios';
import { NoticiasComponent } from './components/noticias/noticias';
import { ContactoComponent } from './components/contacto/contacto';
import { LoginComponent } from './components/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'libros', component: LibrosComponent },
  { path: 'servicios', component: ServiciosComponent },
    { path: 'noticias', component: NoticiasComponent, canActivate: [authGuard] },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'admin', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
