import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { CustomerService } from 'src/app/modules/feature/components/customer/service/customer.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { AuthenticationService } from 'src/app/modules/feature/components/auth/service/authentication.service';
import { ProfileService } from 'src/app/modules/feature/components/brand-owner/service/profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showPassword = false;
  credentialValid!:boolean
  isLoading:boolean = false;
  phoneExist:boolean = false;
  emailExist:boolean = false;
  usernameExist:boolean = false;
  ForGotPassword: boolean = false;
  sentEmail = false;
  username!: string;
  password!: string;
  passwordRegister: any;
  RePasswordRegister: any;
  fullName: any;
  phone: any;
  email: any;
  formLogin: FormGroup;
  forgotPasswordForm: FormGroup;
  rePassvalid: boolean = true;
  registerForm: FormGroup;
  user:any
  hidePassword = true;
  hideRequirePassword = true;

  @Output() logInResponse = new EventEmitter<any>();
  constructor(private customerService:CustomerService,private auth:AuthenticationService,
     private message:ToastrService, private profileService:ProfileService) {
    this.registerForm = new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      rePassword: new FormControl('', [Validators.required])
    })
    this.formLogin = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      password: new FormControl('', [Validators.required])
    });
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      codeConfirm: new FormControl('', [Validators.required])
    })
  }
  ngOnInit(): void {
    this.formLogin.get('username')?.valueChanges.subscribe((value) => this.username = value);
    this.formLogin.get('password')?.valueChanges.subscribe((value) => this.password = value);

    this.registerForm.get('fullName')?.valueChanges.subscribe((value) => this.fullName = value)
    this.registerForm.get('phone')?.valueChanges.pipe(debounceTime(800),distinctUntilChanged()).subscribe((value) => {
      if(value){
        this.phone = value
        this.checkPhoneExist(value)
      }
    })
    this.registerForm.get('email')?.valueChanges.pipe(debounceTime(800),distinctUntilChanged()).subscribe((value) => {
      if(value){
        this.email = value
        this.checkEmailExist(value)
      }
    })
    this.registerForm.get('password')?.valueChanges.subscribe((value) => this.passwordRegister = value)
    this.registerForm.get('rePassword')?.valueChanges.subscribe(value => {
      if (value) {
        this.RePasswordRegister = value;
        if (this.passwordRegister !== this.RePasswordRegister) {
          this.rePassvalid = false;
          this.registerForm.get('rePassword')?.setErrors({ rePassInvalid: true })
        }
        else {
          this.rePassvalid = true;
        }
      }
    }
    )
    this.forgotPasswordForm.get('codeConfirm')?.disable();
  }
  login() {
    this.isLoading = true;
    this.auth.login(this.username,this.password).pipe(
      finalize(()=>{
        this.isLoading = false;
      })
    ).subscribe(
      data=>{
        if(data.success){
          this.logInResponse.emit({
            isLoggedIn: true
          })
          this.credentialValid = true
          this.message.success("Đăng nhập", "Thành công",{timeOut:2000, progressBar:true})
        }
        else{
          this.credentialValid = false
          this.message.error(data.message,"Thất bại",{timeOut:2000, progressBar:true})
        }
      }
    )
    
  }

  toggleRequirePassword() {
    this.hideRequirePassword = !this.hideRequirePassword;
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }
  handleRegister() {
    this.isLoading = true;
    let request = {
      firstName: this.fullName.split(" ").slice(-1).join(" "),
      lastName: this.fullName.split(" ").slice(0, -1).join(" "),
      phoneNumber: this.phone,
      email: this.email,
      password: this.passwordRegister
    }

    this.customerService.registerCustomer(request).pipe(
      finalize(()=>{
        this.isLoading = false;
        this.registerForm.get('fullName')?.setValue(null)
        this.registerForm.get('phone')?.setValue(null)
        this.registerForm.get('email')?.setValue(null)
        this.registerForm.get('password')?.setValue(null)
        this.registerForm.get('rePassword')?.setValue(null)
      })
    ).subscribe(
      data=>{
        if(data.success){
          this.message.success("Đăng ký tài khoản", "Thành công", {timeOut:2000, progressBar:true})
        }
      }
    )
  }
  openForGotPassword() {
    this.ForGotPassword = true;
  }
  closeDialogForGotPassword() {
    this.ForGotPassword = false;
    this.forgotPasswordForm.get('email')?.setValue(null)
    this.forgotPasswordForm.get('codeConfirm')?.setValue(null)
    this.forgotPasswordForm.get('email')?.enable();
  }
  sendCode() {
    //  this.ForGotPassword = false;
    //  this.forgotPasswordForm.get('email')?.setValue(null)
    //  this.forgotPasswordForm.get('codeConfirm')?.setValue(null)
    //  this.forgotPasswordForm.get('email')?.enable();

    this.forgotPasswordForm.get('codeConfirm')?.disable();
    this.forgotPasswordForm.get('codeConfirm')?.setValue(null)
  }
  sendMail() {
    this.sentEmail = true;
    this.forgotPasswordForm.get('email')?.disable();
    this.forgotPasswordForm.get('codeConfirm')?.enable();
  }
  checkPhoneExist(phone:any){
    this.customerService.checkPhoneRegisterCustomer(phone).pipe().subscribe(
      data=>{
        this.phoneExist = data;
        if(this.phoneExist){
          this.registerForm.get('phone')?.setErrors({phoneInvalid:true})
        }
      }
    )
  }
  checkEmailExist(email:any){
    this.profileService.checkExistEmail(email).pipe().subscribe(
      data=>{
        this.emailExist = data;
        if(this.emailExist){
          this.registerForm.get('email')?.setErrors({emailInvalid:true})
        }
      }
    )
  }
}
