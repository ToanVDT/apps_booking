import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandOwnerComponent } from './brand-owner.component';

describe('BrandOwnerComponent', () => {
  let component: BrandOwnerComponent;
  let fixture: ComponentFixture<BrandOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandOwnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
