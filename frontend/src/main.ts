import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';  // <--- nuevo import
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes)),
    provideHttpClient()  // <--- esta es la forma recomendada en Angular 20
  ]
}).catch(err => console.error(err));
