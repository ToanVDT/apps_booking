import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { ProfileService } from '../service/profile.service';
import { ChangePassDTO, Profile } from '../model/profile.model';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  hideReNew :boolean= true;
  hideNew:boolean= true;
  isEditable = true;
  password:ChangePassDTO = {}
  credentials:Profile = {};
  fullName:any;
  existFullName:any;
  existPhone:any
  existEmail:any
  existIdentityCode:any;
  duplicatePhone:any
  duplicateEmail:any
  duplicateIdentityCode:any;
  reNewPassValid:boolean = true;
  oldPasswordValid:boolean = true;
  isLoading:boolean = false;
  user:any
  profileForm:FormGroup;
  changePasswordForm:FormGroup
  constructor(private profileService:ProfileService,
    private authService:AuthenticationService , private messageService:ToastrService) {
      this.profileForm = new FormGroup({
        username:new FormControl('', [Validators.required]),
        address:new FormControl(this.credentials.address, [Validators.required]),
        email:new FormControl('', [Validators.required, Validators.email]),
        fullName:new FormControl(this.fullName, [Validators.required]),
        phone:new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
        identityCode:new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      })
      this.changePasswordForm = new FormGroup({
        oldPass: new FormControl('',[Validators.required]),
        newPass: new FormControl('',[Validators.required]),
        reNewPass: new FormControl('',[Validators.required]),
      })
     }
  ngOnInit(): void {
    this.user = this.authService.userValue;
    this.getProfile()
    this.profileForm.get('username')?.valueChanges.subscribe(
      value=>{
        
      }
    )
    this.profileForm.get('address')?.valueChanges.subscribe(
      value=>{
        if(value){
          this.credentials.address = value
        }
      }
    )
    this.profileForm.get('email')?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(
      value=>{
        this.credentials.email = value
        if(value !== this.existEmail){
          if(value){
            this.checkDuplicateEmail(value)
          }
        }
      }
    )
    this.profileForm.get('fullName')?.valueChanges.subscribe(
      value=>{
        if(value){
          this.fullName = value
        }
      }
    )
    this.profileForm.get('phone')?.valueChanges.pipe(debounceTime(700), distinctUntilChanged()).subscribe(
      value=>{
        this.credentials.phone = value
        if(value !== this.existPhone){
          if(value){
            this.checkDuplicatePhone(value)
          }
        }
      }
    )
    this.profileForm.get('identityCode')?.valueChanges.pipe(debounceTime(900), distinctUntilChanged()).subscribe(
      value=>{
        this.credentials.identityCode = value
        if(value !== this.existIdentityCode){
          if(value){
            this.checkDuplicateIdentityCode(value)
          }
        }
      }
    )
    this.changePasswordForm.get('oldPass')?.valueChanges.pipe(debounceTime(700), distinctUntilChanged()).subscribe(
      value=>{
        if(value){
          this.checkOldPasswordValid(value)
        }
      }
    )
    this.changePasswordForm.get('newPass')?.valueChanges.subscribe(
      value=>{
        if(value){
          this.password.newPass = value;
        }
      }
    )
    this.changePasswordForm.get('reNewPass')?.valueChanges.subscribe(
      value=>{
        if(value){
          this.password.reNewPass = value;
          if(this.password.newPass !== this.password.reNewPass){
            this.reNewPassValid = false;
            this.changePasswordForm.get('reNewPass')?.setErrors({reNewPasswordInValid:true})
          }
          else{
            this.reNewPassValid = true;
          }
        }
      }
    )
  }
  getProfile(){
    this.isLoading = true;
    this.profileService.getProfile(this.user.data?.id).pipe(
      finalize(()=>{
        this.isLoading = false;
        if(this.credentials?.username){
          this.existEmail = this.credentials.email;
          this.existFullName = this.credentials.fullName;
          this.existIdentityCode = this.credentials.identityCode;
          this.existPhone = this.credentials.phone;
          this.profileForm.get('username')?.setValue(this.credentials.username)
          this.profileForm.get('address')?.setValue(this.credentials.address)
          this.profileForm.get('email')?.setValue(this.credentials.email)
          this.profileForm.get('fullName')?.setValue(this.credentials.fullName)
          this.profileForm.get('identityCode')?.setValue(this.credentials.identityCode)
          this.profileForm.get('phone')?.setValue(this.credentials.phone)
        }
      })
    ).subscribe(
      data=>{
        this.credentials = data
      }
    )
  }
  checkOldPasswordValid(oldPassword:any){
    this.profileService.checkOldPasswordValid(this.user.data?.id,oldPassword).subscribe(
      data=>{
        this.oldPasswordValid = data
          if(data ===false){
            this.changePasswordForm.get('oldPass')?.setErrors({oldPasswordInValid:true})
          }
      }
    )
  }
  updateProfile(){
    this.isLoading = true;
    let request = {
      userId:this.user.data?.id,
      firstName:this.fullName.split(" ").slice(-1).join(" "),
      lastName:this.fullName.split(" ").slice(0, -1).join(" "),
      address:this.credentials.address,
      email:this.credentials.email,
      phone:this.credentials.phone,
      identityCode:this.credentials.identityCode
    }
    this.profileService.updateProfile(request).pipe(
      finalize(()=>{
        this.getProfile()
      })
    ).subscribe(
      data=>{
        if(data.success){
          this.messageService.success(data.message,"Thành công",{timeOut:2000, progressBar:true})
        }
      }
    )
  }
  changePassword() {
    let request = {
      userId:this.user.data?.id,
      newPassword:this.password.newPass
    }
    this.profileService.changePassword(request).pipe().subscribe(
      data=>{
        if(data.success){
          this.messageService.success("Đổi mật khẩu", "Thành công",{timeOut:2000, progressBar:true})
        }
      }
    )
  }
  checkDuplicateEmail(email:any){
    this.profileService.checkExistEmail(email).pipe().subscribe(
      data=>{
       this.duplicateEmail = data;
       if(data){
        if(data){
          this.profileForm.get('email')?.setErrors({duplicateEmail:true})
        }
       }
      }
    )
  }
  checkDuplicatePhone(phone:any){
    this.profileService.checkExistPhone(phone).pipe().subscribe(
      data=>{
       this.duplicatePhone = data;
       console.log("data", data)
       if(data){
        if(data){
          this.profileForm.get('phone')?.setErrors({duplicatePhone:true})
        }
       }
      }
    )
  }
  checkDuplicateIdentityCode(identityCode:any){
    this.profileService.checkExistIdentityCode(identityCode).pipe().subscribe(
      data=>{
       this.duplicateIdentityCode = data;
       if(data){
        if(data){
          this.profileForm.get('identityCode')?.setErrors({duplicateIdentityCode:true})
        }
       }
      }
    )
  }
}
