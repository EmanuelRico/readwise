import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { BookService, Book, Review } from '../../services/book';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
})
export class ReviewModal {
  newReviewText = '';
  reviews: Review[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Book,
    private dialogRef: MatDialogRef<ReviewModal>,
    private bookService: BookService,
    private cdr: ChangeDetectorRef
  ) {
    this.reviews = [...(data.reviews || [])];
  }

  addReview() {
    const trimmed = this.newReviewText.trim();

    if (trimmed && this.data._id) {
      const newReview = { review: trimmed };

      this.bookService.addReview(this.data._id, newReview).subscribe({
        next: () => {
          this.newReviewText = '';
          // Recargar libro completo para obtener reviews actualizadas
          this.bookService.getBook(this.data._id!).subscribe((updatedBook) => {
            this.reviews = [...(updatedBook.reviews || [])]; // spread para referencia nueva
            this.cdr.detectChanges();  // fuerza refresco vista
            console.log('Updated Book reviews:', this.reviews);
            console.log('Review saved and book reloaded');
          });
        },
        error: (err) => console.error('Error saving review:', err),
      });
    }
  }

  deleteReview(reviewId?: string) {
    if (!reviewId || !this.data._id) return;

    if (confirm('¿Seguro que quieres eliminar esta reseña?')) {
      this.bookService.deleteReview(this.data._id, reviewId).subscribe({
        next: (updatedBook) => {
          this.reviews = updatedBook.reviews || [];
          console.log('Review deleted');
        },
        error: (err) => console.error('Error deleting review:', err),
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}