import { Component, OnInit } from '@angular/core';
import { homeCarouselData } from 'src/assets/data/carousel';

interface Car {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-marousel',
  templateUrl: './marousel.component.html',
  styleUrls: ['./marousel.component.scss'],
})
export class MarouselComponent implements OnInit {
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
