import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookService, Book } from '../../services/book';
import { BookForm } from '../book-form/book-form';
import { ReviewModal } from '../review-modal/review-modal';  // <-- Importa tu modal de reseñas
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, RouterModule, BookForm, ReviewModal],
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.css']
})
export class BookList implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data: Book[]) => {
        console.log('Books loaded:', data); // <- Revisa aquí si el rating está presente
        this.books = data;
      },
      error: err => console.error('Error loading books:', err)
    });
  }

  openReviewModal(book: Book): void {
    this.dialog.open(ReviewModal, {
      width: '500px',
      data: book
    });
  }

  getAverageRating(reviews: { rating: number }[]): number {
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return reviews.length ? total / reviews.length : 0;
  }

  addNewBook(): void {
    const dialogRef = this.dialog.open(BookForm, {
      width: '400px',
      data: {}
    });

    dialogRef.componentInstance.saved.subscribe((bookData) => {
      this.bookService.createBook(bookData).subscribe(() => {
        dialogRef.close();
        this.loadBooks();
      });
    });
  }

  editBook(book: Book): void {
    const dialogRef = this.dialog.open(BookForm, {
      width: '400px',
      data: book
    });

    dialogRef.componentInstance.saved.subscribe((bookData) => {
      this.bookService.updateBook(book._id!, bookData).subscribe(() => {
        dialogRef.close();
        this.loadBooks();
      });
    });
  }

  deleteBook(bookId: string) {
    if (!bookId) return;

    if (confirm('¿Estás seguro que quieres eliminar este libro?')) {
      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          // Quitar el libro eliminado de la lista local para actualizar UI sin recargar todo
          this.books = this.books.filter(book => book._id !== bookId);
          console.log('Libro eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar el libro:', err);
          alert('Error eliminando el libro');
        }
      });
    }
  }
}