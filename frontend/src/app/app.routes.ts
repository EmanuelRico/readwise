import { Routes } from '@angular/router';
import { ReviewForm } from './components/review-form/review-form'; // ajusta la ruta
import { ReviewList } from './components/review-list/review-list';

export const routes: Routes = [
  { path: '', redirectTo: '/reviews', pathMatch: 'full' },
  { path: 'reviews', component: ReviewList },      // lista de reviews
  { path: 'create', component: ReviewForm },       // para crear nueva review
  { path: 'edit/:id', component: ReviewForm },     // para editar review
  // otras rutas...
];
