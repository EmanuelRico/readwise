import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { BookList } from './components/book-list/book-list';
import { BookForm } from './components/book-form/book-form';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'books', component: BookList },
  { path: 'create', component: BookForm },
  { path: 'edit/:id', component: BookForm },
];