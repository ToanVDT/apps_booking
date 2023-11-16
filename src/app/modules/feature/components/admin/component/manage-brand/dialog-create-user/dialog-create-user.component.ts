import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrandOwner } from '../../../model/admin.model';
import { ProfileService } from '../../../../brand-owner/service/profile.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-dialog-create-user',
  templateUrl: './dialog-create-user.component.html',
  styleUrls: ['./dialog-create-user.component.scss']
})
export class DialogCreateUserComponent implements OnInit {

  @Output() createOrUpdate = new EventEmitter<any>();
  userForm:FormGroup;
  hidePassword = true;
  user:BrandOwner = {}
  fullName:any
  duplicatePhone:any
  duplicateEmail:any
  duplicateIdentityCode:any;
  duplicatePhoneBrand:any;
  duplicateUserName:any;

  constructor(private profileService:ProfileService) { 
    this.userForm = new FormGroup({
      fullName: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email]),
      username:new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
      identityCode: new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(12),Validators.maxLength(12)]),
      phone: new FormControl('',[Validators.required,Validators.pattern(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)]),
      address: new FormControl('',[Validators.required])
    })
  }

  ngOnInit(): void {
    this.userForm.get('fullName')?.valueChanges.subscribe(
      value=>{
        if(value){
          this.user.fullName = value;
          
        }
      }
    )
    this.userForm.get('email')?.valueChanges.pipe(debounceTime(800),distinctUntilChanged()).subscribe(
      value=>{
        if(value){
          this.user.email = value
          this.checkDuplicateEmail(value)
        }
      }
    )
    this.userForm.get('username')?.valueChanges.pipe(debounceTime(800),distinctUntilChanged()).subscribe(
      value=>{
        if(value){
          this.user.username = value;
          this.checkDuplicateUsername(value)
        }
      }
    )
    this.userForm.get('identityCode')?.valueChanges.pipe(debounceTime(800),distinctUntilChanged()).subscribe(
      value=>{
        if(value){
          this.user.identityCode = value;
          this.checkDuplicateIdentityCode(value)
        }
      }
    )
    this.userForm.get('phone')?.valueChanges.pipe(debounceTime(800),distinctUntilChanged()).subscribe(
      value=>{
        if(value){
          this.user.phone = value;
          this.checkDuplicatePhone(value)
        }
      }
    )
    this.userForm.get('address')?.valueChanges.subscribe(
      value=>{
        if(value){
          this.user.address = value;
        }
      }
    )
    this.userForm.get('password')?.valueChanges.subscribe(
      value=>{
        if(value){
          this.user.password = value
        }
      }
    )
  }
  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }
  onSubmit(){
    this.fullName = this.user.fullName
    let firstName = this.fullName.split(" ").slice(-1).join(" ")
    let lastName = this.fullName.split(" ").slice(0, -1).join(" ")
    let requestTemp = {...this.user,firstName:firstName,lastName:lastName}
    const {fullName,...request} = requestTemp
    this.createOrUpdate.emit(request)
  }
  checkDuplicateUsername(username:any){
    this.profileService.checkExistUsername(username).pipe().subscribe(
      response=>{
        this.duplicateUserName = response
        if(response){
          this.userForm.get('username')?.setErrors({duplicateUserName:true})
        }
      }
    )
  }
  checkDuplicatePhone(phone:any){
    this.profileService.checkExistPhone(phone).pipe().subscribe( response=>{
      this.duplicatePhone = response
      if(response){
        this.userForm.get('phone')?.setErrors({duplicatePhone:true})
      }
    }
  )
  }

  checkDuplicateIdentityCode(identityCode:any){
    this.profileService.checkExistIdentityCode(identityCode).pipe().subscribe( response=>{
      this.duplicateIdentityCode = response
      if(response){
        this.userForm.get('identityCode')?.setErrors({duplicateIdentityCode:true})
      }
    }
  )
  }
  checkDuplicateEmail(email:any){
    this.profileService.checkExistIdentityCode(email).pipe().subscribe( response=>{
      this.duplicateEmail = response
      if(response){
        this.userForm.get('email')?.setErrors({duplicateEmail:true})
      }
    }
  )
  }
}