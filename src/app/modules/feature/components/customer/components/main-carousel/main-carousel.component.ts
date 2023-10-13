import { Component, OnInit } from '@angular/core';
import { homeCarouselData } from 'Data/mainCarousel';

interface Car {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-main-carousel',
  templateUrl: './main-carousel.component.html',
  styleUrls: ['./main-carousel.component.scss']
})
export class MainCarouselComponent implements OnInit {
  carouselData: any
  currentSlide = 0;
  interval: any

  constructor() { }

  ngOnInit(): void {
    this.carouselData = homeCarouselData;
    this.autoPlay();
  }

  autoPlay() {
    setInterval(() => {
      this.nextSlide();
    }, 3500)
  }
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselData.length;
  }

  cars: Car[] = [
    { value: 'ford', viewValue: 'Ford' },
    { value: 'chevrolet', viewValue: 'Chevrolet' },
    { value: 'dodge', viewValue: 'Dodge' },
  ];
  selectedCar = this.cars[0].value;

}
