import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { debounceTime, distinctUntilChanged, finalize } from "rxjs";
import { AuthenticationService } from "../../../auth/service/authentication.service";
import {
  ChangePassDTO,
  Profile,
  ProfileCustomer,
} from "../../../brand-owner/model/profile.model";
import { ProfileService } from "../../../brand-owner/service/profile.service";
import { CustomerService } from "../../service/customer.service";

@Component({
  selector: "app-profile-customer",
  templateUrl: "./profile-customer.component.html",
  styleUrls: ["./profile-customer.component.scss"],
})
export class ProfileCustomerComponent implements OnInit {
  hideReNew: boolean = true;
  hideNew: boolean = true;
  isEditable = true;
  password: ChangePassDTO = {};
  credentials: ProfileCustomer = {};
  fullName: any;
  existEmail: any;
  duplicateEmail: any;
  reNewPassValid: boolean = true;
  oldPasswordValid: boolean = true;
  isLoading: boolean = false;
  user: any;
  profileForm: FormGroup;
  changePasswordForm: FormGroup;
  constructor(
    private profileService: ProfileService,
    private authService: AuthenticationService,
    private messageService: ToastrService,
    private customerService:CustomerService
  ) {
    this.profileForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      fullName: new FormControl(this.fullName, [Validators.required]),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)]),
    });
    this.changePasswordForm = new FormGroup({
      oldPass: new FormControl("", [Validators.required]),
      newPass: new FormControl("", [Validators.required]),
      reNewPass: new FormControl("", [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.user = this.authService.userValue;
    this.getProfile();
    this.profileForm.get("username")?.valueChanges.subscribe((value) => {});
    this.profileForm
      .get("email")
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.credentials.email = value;
        if (value !== this.existEmail) {
          if (value) {
            this.checkDuplicateEmail(value);
          }
        }
      });
    this.profileForm.get("fullName")?.valueChanges.subscribe((value) => {
      if (value) {
        this.fullName = value;
      }
    });
    this.profileForm.get("phone")?.valueChanges.pipe().subscribe();

    this.changePasswordForm.get("oldPass")?.valueChanges.pipe(debounceTime(700), distinctUntilChanged()).subscribe((value) => {
        if (value) {
          this.checkOldPasswordValid(value);
        }
      });
    this.changePasswordForm.get("newPass")?.valueChanges.subscribe((value) => {
      if (value) {
        this.password.newPass = value;
      }
    });
    this.changePasswordForm.get("reNewPass")?.valueChanges.subscribe((value) => {
        if (value) {
          this.password.reNewPass = value;
          if (this.password.newPass !== this.password.reNewPass) {
            this.reNewPassValid = false;
            this.changePasswordForm
              .get("reNewPass")
              ?.setErrors({ reNewPasswordInValid: true });
          } else {
            this.reNewPassValid = true;
          }
        }
      });
      this.profileForm.get('phone')?.disable()
  }
  getProfile() {
    this.isLoading = true;
    this.customerService.getProfile(this.user.data?.id).pipe(
        finalize(() => {
          this.isLoading = false;
          if (this.credentials?.phone) {
            this.existEmail = this.credentials.email;
            this.profileForm.get("email")?.setValue(this.credentials.email);
            this.profileForm.get("fullName")?.setValue(this.credentials.fullName);
            this.profileForm.get("phone")?.setValue(this.credentials.phone);
          }
        })
      )
      .subscribe((data) => {
        this.credentials = data.data;
      });
  }
  checkOldPasswordValid(oldPassword: any) {
    this.profileService
      .checkOldPasswordValid(this.user.data?.id, oldPassword)
      .subscribe((data) => {
        this.oldPasswordValid = data;
        if (data === false) {
          this.changePasswordForm
            .get("oldPass")
            ?.setErrors({ oldPasswordInValid: true });
        }
      });
  }
  updateProfile() {
    this.isLoading = true;
    let request = {
      userId: this.user.data?.id,
      firstName: this.fullName.split(" ").slice(-1).join(" "),
      lastName: this.fullName.split(" ").slice(0, -1).join(" "),
      email: this.credentials.email,
    };
    this.customerService
      .updateProfile(request)
      .pipe(
        finalize(() => {
          this.getProfile();
        })
      )
      .subscribe((data) => {
        if (data.success) {
          this.messageService.success(data.message, "Thành công", {
            timeOut: 2000,
            progressBar: true,
          });
        }
      });
  }
  changePassword() {
    let request = {
      userId: this.user.data?.id,
      newPassword: this.password.newPass,
    };
    this.profileService.changePassword(request).pipe()
      .subscribe((data) => {
        if (data.success) {
          this.messageService.success("Đổi mật khẩu", "Thành công", {
            timeOut: 2000,
            progressBar: true,
          });
        }
      });
  }
  checkDuplicateEmail(email: any) {
    this.profileService
      .checkExistEmail(email)
      .pipe()
      .subscribe((data) => {
        this.duplicateEmail = data;
        if (data) {
          if (data) {
            this.profileForm.get("email")?.setErrors({ duplicateEmail: true });
          }
        }
      });
  }
  
}
