// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { IMAGE_CONFIG } from '@angular/common';
import { environment } from '../environments/environment';

const firebaseConfig = environment.firebase;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: 'FIREBASE_APP', useValue: app },
    { provide: 'FIREBASE_AUTH', useValue: auth },
    { provide: 'FIREBASE_FIRESTORE', useValue: db },
    // Configuración opcional de imágenes
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true
      }
    }
  ]
};
