import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService, Review } from '../../services/review';
import { ReviewForm } from '../review-form/review-form';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, ReviewForm],
  templateUrl: './review-list.html',
  styleUrls: ['./review-list.css']
})
export class ReviewList implements OnInit {
  reviews: Review[] = [];
  selectedReview?: Review;
  showForm = false;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviews().subscribe((data) => {
      this.reviews = data;
    });
  }

  createNewReview(): void {
    this.selectedReview = undefined;
    this.showForm = true;
  }

  editReview(review: Review): void {
    this.selectedReview = review;
    this.showForm = true;
  }

  deleteReview(id: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(id).subscribe(() => {
        this.loadReviews();
      });
    }
  }

  onReviewSaved(): void {
    this.loadReviews();
    this.showForm = false;
  }
}