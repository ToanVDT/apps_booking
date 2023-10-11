import { Component, OnInit } from '@angular/core';
import { homeCarouselData } from 'src/assets/data/carousel';

@Component({
  selector: 'app-marousel',
  templateUrl: './marousel.component.html',
  styleUrls: ['./marousel.component.scss'],
})
export class MarouselComponent implements OnInit {
  carouselData: any;
  currentSlide = 0;
  interval: any;

  constructor() {}

  ngOnInit(): void {
    this.carouselData = homeCarouselData;
    this.autoPlay();
  }
  autoPlay() {
    setInterval(() => {
      this.nextSlide();
    }, 4000);
  }
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselData.length;
  }
}
