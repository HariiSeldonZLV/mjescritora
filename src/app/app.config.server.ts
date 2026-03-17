import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // <--- Esto le da la "identidad" de servidor
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
