import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { CustomerService } from 'src/app/modules/feature/components/customer/service/customer.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  isLoading:boolean = false;
  validateCodeResponse:any;
  validateCodeEnter:any;
  sentEmail = false;
  emailForGotPassword:any;
  forgotPasswordForm: FormGroup;

  constructor(private message:ToastrService,private customerService :CustomerService,private dialogRef: MatDialogRef<ForgotPasswordComponent>) { 
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      codeConfirm: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.forgotPasswordForm.get('codeConfirm')?.disable();
    this.forgotPasswordForm.get('email')?.valueChanges.subscribe(value=> {
      if(value){
        this.emailForGotPassword = value
      }
    })
    this.forgotPasswordForm.get('codeConfirm')?.valueChanges.subscribe(value=>{
      if(value){
        this.validateCodeEnter = value
        
      }
    })
  }
  sendCode() {
    if(this.validateCodeEnter !== this.validateCodeResponse){
      this.message.error("Mã xác thực không chính xác","Thất bại",{timeOut:2000, progressBar:true})
      this.forgotPasswordForm.get('codeConfirm')?.enable();
      this.forgotPasswordForm.get('codeConfirm')?.setValue(null)
    }
    else{
      this.forgotPasswordForm.get('email')?.setValue(null)
      this.forgotPasswordForm.get('codeConfirm')?.setValue(null)
      this.forgotPasswordForm.get('email')?.enable();
      this.dialogRef.close()
      this.customerService.resetPassword(this.emailForGotPassword).pipe(
        finalize(()=>{
          this.message.success("Mật khẩu đã được làm mới","Thành công",{timeOut:2000, progressBar:true})
        })
      ).subscribe()
      
    }

  }
  sendMail() {
    this.sentEmail = true;
    this.forgotPasswordForm.get('email')?.disable();
    this.forgotPasswordForm.get('codeConfirm')?.enable();
    this.customerService.sendMailValidateCode(this.emailForGotPassword).pipe().subscribe(
      data=>{
        this.validateCodeResponse = data.data
      }
    )
  }

}
