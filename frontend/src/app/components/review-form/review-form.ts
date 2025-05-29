import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../services/review';
import { Review } from '../../services/review';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-form.html',
  styleUrls: ['./review-form.css']
})

export class ReviewForm implements OnChanges {
  @Input() review?: Review;  // Si se recibe una review, es modo edición
  @Output() saved = new EventEmitter<void>();

  reviewForm: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {
    this.reviewForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      review: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['review'] && this.review) {
      this.isEditMode = true;
      this.reviewForm.patchValue({
        title: this.review.title,
        author: this.review.author,
        review: this.review.review,
        rating: this.review.rating
      });
    } else if (!this.review) {
      this.isEditMode = false;
      this.reviewForm.reset();
    }
  }

  onSubmit() {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const formValue = this.reviewForm.value;

    if (this.isEditMode && this.review?._id) {
      this.reviewService.updateReview(this.review._id, formValue).subscribe(() => {
        this.saved.emit();
      });
    } else {
      this.reviewService.createReview(formValue).subscribe(() => {
        this.saved.emit();
        this.reviewForm.reset();
      });
    }
  }
}
