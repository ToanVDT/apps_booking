import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Brand } from '../../model/brand.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-create-brand',
  templateUrl: './dialog-create-brand.component.html',
  styleUrls: ['./dialog-create-brand.component.scss']
})
export class DialogCreateBrandComponent implements OnInit {

  @Output() createOrUpdate = new EventEmitter<any>();

  brand:Brand = {}
  brandForm:FormGroup
  selectedFile: any

  constructor() {
    this.brandForm = new FormGroup({
      name: new FormControl(this.brand.name,[Validators.required]),
      address: new FormControl(this.brand.address,[Validators.required]),
      phone: new FormControl(this.brand.phone,[Validators.required]),
      description: new FormControl(this.brand.description),
      // image: new FormControl(this.brand.image,[Validators.required]),
    })
  
   }

  ngOnInit(): void {
    this.brandForm.get('name')?.valueChanges.subscribe(data=>{
      this.brand.name = data;
    })
    this.brandForm.get('address')?.valueChanges.subscribe(data=>{
      this.brand.address = data;
    })
    this.brandForm.get('description')?.valueChanges.subscribe(data=>{
      this.brand.description = data;
    })
    this.brandForm.get('phone')?.valueChanges.subscribe(data=>{
      this.brand.phone = data;
    })
  }
  upLoad(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
    }
  }
  onSubmit(){
    if(this.brandForm.valid){
      this.createOrUpdate.emit({brand:this.brand, file:this.selectedFile})
    }
  }
}
