import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';  // <--- Importa CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    CommonModule  // <--- Agrega CommonModule aquí
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'frontend';
  currentYear: number = new Date().getFullYear();

  showLogout = true;

  constructor(private router: Router) {
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Oculta el logout si estamos en /login
      this.showLogout = event.url !== '/';
      console.log(`Ruta actual: ${event.url} Mostrar logout: ${this.showLogout}`);
    });
  }

  logout() {
    localStorage.removeItem('token'); // Ejemplo
    window.location.href = '/';
  }
}