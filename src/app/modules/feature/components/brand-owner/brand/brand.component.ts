import { Component, OnInit } from '@angular/core';
import { Brand } from '../model/brand.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateBrandComponent } from './dialog-create-brand/dialog-create-brand.component';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { User } from '../../../model/user.model';
import { BrandService } from '../service/brand-service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  selectedFile:any
  isLoading:boolean = false;
  openFormAdd:boolean = false;
  isSuccess:boolean = false;
  brand:Brand ={};
  user:any
  brandForm:FormGroup;
  img!:string | undefined;
  thumb:any;

  constructor(private dialog:MatDialog, private auth:AuthenticationService,
    private brandService:BrandService, private message:ToastrService) {
      this.brandForm = new FormGroup({
        name: new FormControl(this.brand.name,[Validators.required]),
        address: new FormControl(this.brand.address,[Validators.required]),
        description: new FormControl(this.brand.description),
        phone: new FormControl(this.brand.phone,[Validators.required])
      })
     }

  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.getBrandByUserId();
    // console.log("id", this.user.data.id)
    this.brandForm.get('name')?.valueChanges.subscribe(data=>{
      this.brand.name = data;
      console.log("name", data)
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
    this.img = this.brand.image;
    
    console.log("data", this.brand)
  }
  openFormAddBrand(){
    const dialogRef = this.dialog.open(DialogCreateBrandComponent)
    dialogRef.componentInstance.createOrUpdate.subscribe(data=>{
  
      this.handleCreateOrUpdate(data);
    })
  }
  getBrandByUserId(){
    this.isLoading = true
    this.brandService.getBrandByUserId(this.user.data.id).pipe(
      finalize(()=>{
        this.isLoading = false
      })
    ).subscribe(
      data=>{
        this.brand = data.data;
        if(this.brand?.id){
          this.isSuccess = true;
          this.editBrand();
        }
      }
    )
  }
  handleCreateOrUpdate(data:any){
    let request: FormData = new FormData();
    if(data.file){
      request.append("file", data.file);
    }
    const dataBrand ={...data.brand, userId:this.user.data?.id}
    request.append("data", JSON.stringify(dataBrand));
    this.brandService.createOrUpdateBrand(request).pipe(
      finalize(()=>{
        this.editBrand();
      }
      )
    ).subscribe(
      data=>{
        if(data.success){
          this.message.success("Thêm thông tin nhà xe","Thành công",{timeOut:2000,progressBar:true})
          this.isSuccess = true;
        }
      }
    )
  }
  upLoad(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); 
      reader.onload = (event: any) => { 
        this.thumb = event.target.result;
      }
    }
  }
  saveBrand(){
    console.log("brand", this.brand, this.selectedFile)
    let request: FormData = new FormData();
    if(this.selectedFile){
      request.append("file", this.selectedFile);
    }
    const dataBrand ={...this.brand, userId:this.user.data?.id}
    request.append("data", JSON.stringify(dataBrand));
    this.brandService.createOrUpdateBrand(request).pipe(
      finalize(()=>{
        
      })
    ).subscribe(
      data=>{
        if(data.success){
          this.message.success("Cập nhật thông tin nhà xe","Thành công",{timeOut:2000,progressBar:true})
          this.isSuccess = true
          this.editBrand();
        }
      }
    )
  }
  editBrand(){
    this.brandForm.get('name')?.setValue(this.brand.name)
    this.brandForm.get('address')?.setValue(this.brand.address)
    this.brandForm.get('description')?.setValue(this.brand.description)
    this.brandForm.get('phone')?.setValue(this.brand.phone)
    this.img = this.brand.image
  }
}