import { Component, OnInit, Input } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { BusService } from '../service/bus.service';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { FormControl, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { ImageService } from '../service/image.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmOrderComponent } from '../order/dialog-confirm-order/dialog-confirm-order.component';
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
  user: any;
  buses: any;
  noData!:boolean;
  busForm: FormGroup;
  isLoading: boolean = false;
  busCurrent:any;
  previewImage: any[] = []
  selectedFiles: File[] = []
  currentFile?: File

  images: any[] = [];

  constructor(private busService: BusService, private auth: AuthenticationService,
    private imageService:ImageService,private message:ToastrService,private dialog:MatDialog) {
    this.busForm = new FormGroup({
      bus: new FormControl('')
    })
  }

  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.getAllBusInBrand()
    this.busForm.get('bus')?.valueChanges.subscribe(
      value => {
        this.busCurrent = value;
        this.getImageBus()
      }
    )
    
  }

  selectImage(index: number,image:any): void {
    this.selectedImageIndex = index;
  }

  prevImage(image:any): void {
    this.selectedImageIndex = (this.selectedImageIndex - 1 + this.images.length) % this.images.length;
    this.updateStartIndex();
  }

  nextImage(image:any): void {
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

  getVisibleThumbnails(): any[] {
    const maxThumbnails = 5;
    const endIndex = Math.min(this.startIndex + maxThumbnails, this.images.length);
    return this.images.slice(this.startIndex, endIndex);
  }
  getAllBusInBrand() {
    this.isLoading = true;
    this.busService.getAllBuses(this.user?.data?.id).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(
      data => {
        this.buses = data.data;
        this.busForm.get('bus')?.setValue(this.buses[0])
        this.busCurrent = this.buses[0];
      }
    )
  }
  getImageBus() {
    this.isLoading = true
    let response:any;
    this.imageService.getImage(this.busCurrent?.id).pipe(
      finalize(()=>{
        if(!response[0]?.imageId){
          this.noData = true
        }
        else{
          this.noData = false
        }
        this.isLoading = false
      })
    ).subscribe(
      data=>{
        response = data.data
        this.images = data.data
      }
    )
  }
  selectFile(event: any): void {
    const files = event.target.files
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i]
        this.selectedFiles.push(file)
        if (file) {
          this.currentFile = file
          const reader = new FileReader()

          reader.onload = (e: any) => {
            this.previewImage.push(e.target.result)
          }
          reader.readAsDataURL(this.currentFile)
        }
      }
    }
    const request: FormData = new FormData()
    for (let i = 0; i < this.selectedFiles.length; i++) {
      request.append('file', this.selectedFiles[i])
    }
    this.addImage(request,this.busCurrent?.id)
  }
  selectFileToChange(event: any): void {
    const files = event.target.files
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i]
        this.selectedFiles.push(file)
        if (file) {
          this.currentFile = file
          const reader = new FileReader()

          reader.onload = (e: any) => {
            this.previewImage.push(e.target.result)
          }
          reader.readAsDataURL(this.currentFile)
        }
      }
    }
    const request: FormData = new FormData()
    for (let i = 0; i < this.selectedFiles.length; i++) {
      request.append('file', this.selectedFiles[i])
    }
    this.updateImage(request,this.images[this.selectedImageIndex]?.imageId)
  }
  updateImage(file:any, imageId:any){
    this.isLoading = true
    this.imageService.updateImage(file,imageId).pipe(
      finalize(()=>{
        this.getImageBus()
      })
    ).subscribe(
      data=>{
        if(data.success){
          this.message.success("Chỉnh sửa ảnh","Thành công",{timeOut:2000,progressBar:true})
        }
      }
    )
  }
  addImage(file:any, busId:any){
    this.isLoading = true
    this.imageService.addImage(file,busId).pipe(
      finalize(()=>{
        this.getImageBus()
      })
    ).subscribe(
      data=>{
        if(data.success){
          this.message.success("Thêm ảnh","Thành công",{timeOut:2000,progressBar:true})
        }
      }
    )
  }
  deleteImage(){
    const dialogRef = this.dialog.open(DialogConfirmOrderComponent,{
      data:{name:"Bạn chắc chắn xóa ảnh"}
    })
    dialogRef.componentInstance.onConfirm.subscribe(()=>{
      this.handleDeleteImage()
    })
  }
  handleDeleteImage(){
    this.isLoading = true;
    this.imageService.deleteImage(this.images[this.selectedImageIndex]?.imageId).pipe(
      finalize(()=>{
        this.getImageBus()
      })
    ).subscribe(
      data=>{
        if(data.success){
          this.message.success("Xóa hình ảnh","Thành công",{timeOut:2000,progressBar:true})
        }
      }
    )
  }
}