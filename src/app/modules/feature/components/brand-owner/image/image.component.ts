import { Component, OnInit, Input } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  animations: [
    trigger('imageAnimation', [
        state('*', style({ transform: 'translateX(0)' })),
        transition(':increment', [
            style({ transform: 'translateX(100%)' }),
            animate('0.3s ease-out', style({ transform: 'translateX(0)' })),
        ]),
        transition(':decrement', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.3s ease-out', style({ transform: 'translateX(0)' })),
        ]),
    ]),
],
})
export class ImageComponent implements OnInit {

  selectedImageIndex = 0;
  startIndex = 0;

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  @Input() images: string[] = [
    'https://static.vexere.com/production/images/1688797618225.jpeg',
    'https://static.vexere.com/production/images/1688797618903.jpeg',
    'https://static.vexere.com/production/images/1689065858222.jpeg',
    'https://static.vexere.com/production/images/1688797528210.jpeg',
    'https://static.vexere.com/production/images/1675916351798.jpeg',
    'https://static.vexere.com/production/images/1689065858222.jpeg',
    'https://static.vexere.com/production/images/1688797611253.jpeg',
];

  constructor() { }

  ngOnInit(): void {
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
}

prevImage(): void {
    this.selectedImageIndex = (this.selectedImageIndex - 1 + this.images.length) % this.images.length;
    this.updateStartIndex();
}

nextImage(): void {
    this.selectedImageIndex = (this.selectedImageIndex + 1) % this.images.length;
    this.updateStartIndex();
}

updateStartIndex(): void {
    const maxThumbnails = 5;
    if (this.selectedImageIndex < this.startIndex) {
        this.startIndex = this.selectedImageIndex;
    } else if (this.selectedImageIndex >= this.startIndex + maxThumbnails) {
        this.startIndex = Math.max(0, this.selectedImageIndex - maxThumbnails + 1);
    }
}

getVisibleThumbnails(): string[] {
    const maxThumbnails = 5;
    const endIndex = Math.min(this.startIndex + maxThumbnails, this.images.length);
    return this.images.slice(this.startIndex, endIndex);
}

}