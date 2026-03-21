// app/components/instagram-aside/instagram-aside.ts
import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-instagram-aside',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instagram-aside.html',
  styleUrl: './instagram-aside.scss'
})
export class InstagramAsideComponent implements AfterViewInit {
  instagramUrl = 'https://www.instagram.com/mjescritora3/';
  instagramUser = '@mjescritora3';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // Solo ejecutar en navegador
    if (isPlatformBrowser(this.platformId)) {
      this.loadInstagramScript();
    }
  }

  private loadInstagramScript(): void {
    // Verificar si el script ya existe
    if (document.querySelector('script[src="//www.instagram.com/embed.js"]')) {
      this.processEmbeds();
      return;
    }

    // Crear y cargar el script de Instagram
    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.processEmbeds();
    };
    document.body.appendChild(script);
  }

  private processEmbeds(): void {
    // Forzar a Instagram a procesar los embebidos
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }
}
