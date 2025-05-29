import { Component, Inject, Output, EventEmitter, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { BookService, Book } from '../../services/book'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-book-form',
  standalone: true,
  templateUrl: './book-form.html',
  styleUrls: ['./book-form.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class BookForm implements OnInit {
  @Output() saved = new EventEmitter<Book>();

  bookForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<BookForm>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Book = { title: '', author: '', reviews: [] }
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data?._id;

    this.bookForm = this.fb.group({
      title: [this.data?.title || '', Validators.required],
      author: [this.data?.author || '', Validators.required],
      description: [this.data?.description || ''],
      image: [this.data?.image || ''],
      rating: [this.data?.rating ?? null, [Validators.min(1), Validators.max(5)]]
    });
  }

  save(): void {
    if (this.bookForm.invalid) return;

    const bookToSave: Book = {
      ...this.data,
      ...this.bookForm.value
    };

    if (this.isEditMode && this.data._id) {
      this.bookService.updateBook(this.data._id, bookToSave).subscribe({
        next: () => {
          this.saved.emit(bookToSave);
          if (this.dialogRef) this.dialogRef.close();
          this.router.navigate(['/books']);
        },
        error: err => console.error('Update failed:', err)
      });
    } else {
      this.bookService.createBook(bookToSave).subscribe({
        next: () => {
          this.saved.emit(bookToSave);
          if (this.dialogRef) this.dialogRef.close();
          this.router.navigate(['/books']);
        },
        error: err => console.error('Create failed:', err)
      });
    }
  }
}