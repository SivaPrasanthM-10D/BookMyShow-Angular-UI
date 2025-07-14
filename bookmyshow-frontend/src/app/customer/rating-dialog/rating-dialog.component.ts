import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Hashtag {
  label: string;
  selected: boolean;
}

@Component({
  selector: 'app-rating-dialog',
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.css']
})
export class RatingDialogComponent implements OnInit {
  rating = 0;
  hoveredRating = 0;
  stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  hasRated = false;
  question = '';
  hashtags: Hashtag[] = [];
  selectedHashtags: string[] = [];
  isLoading = true;

  // Config for questions and hashtags based on rating
  private ratingConfig: any = {
    low: {
      question: "Oh no! What went wrong?",
      hashtags: ['#Boring', '#BadActing', '#WeakStory', '#PoorDirection', '#Disappointing']
    },
    medium: {
      question: "What was your take on the movie?",
      hashtags: ['#OneTimeWatch', '#Average', '#CouldBeBetter', '#GoodMusic', '#Decent']
    },
    high: {
      question: "Awesome! What did you like the most?",
      hashtags: ['#MustWatch', '#Superb', '#Mindblowing', '#AmazingStory', '#Blockbuster']
    }
  };

  constructor(
    public dialogRef: MatDialogRef<RatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { movieId: string, customerId: string }
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 50); // Short delay is enough now
  }

  onStarHover(rating: number): void {
    this.hoveredRating = rating;
  }

  setRating(rating: number): void {
    this.rating = rating;
    this.hasRated = true;
    this.updateDynamicContent();
  }

  updateDynamicContent(): void {
    let category;
    if (this.rating <= 4) category = 'low';
    else if (this.rating <= 7) category = 'medium';
    else category = 'high';

    this.question = this.ratingConfig[category].question;
    this.hashtags = this.ratingConfig[category].hashtags.map((label: string) => ({ label, selected: false }));
  }

  toggleHashtag(hashtag: Hashtag): void {
    hashtag.selected = !hashtag.selected;
    this.selectedHashtags = this.hashtags.filter(h => h.selected).map(h => h.label);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  submitRating(): void {
    const comment = this.selectedHashtags.join(' ');
    this.dialogRef.close({ rating: this.rating, comment });
  }

  confirm(): void {
    const comment = this.selectedHashtags.join(' ');
    this.dialogRef.close({ rating: this.rating, comment });
  }
} 