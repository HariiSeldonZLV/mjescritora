// app/components/footer/footer.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  anio = new Date().getFullYear();
  socialLinks = {
    instagram: 'https://instagram.com/mjespinoza3',  // Cambiar por URL real
    linkedin: 'https://linkedin.com/in/mjespinoza3'  // Cambiar por URL real
  };
}
