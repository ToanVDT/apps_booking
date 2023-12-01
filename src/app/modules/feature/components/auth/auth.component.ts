import { Component, OnInit } from "@angular/core";
import { User } from "../../model/user.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "./service/authentication.service";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs";
import { AppConstant } from "../common/constant";
import { ToastrService } from "ngx-toastr";
import { ForgotPasswordComponent } from "src/app/modules/share/components/forgot-password/forgot-password.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  hide: boolean = true;
  valCheck: string[] = ["remember"];
  isLoading: boolean = false;
  username!: string;
  password!: string;
  userRole: string | undefined;
  user: any;
  form!: FormGroup;
  credentialValid!: boolean;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog:MatDialog,
    private messService: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(this.username, [Validators.required]),
      password: new FormControl(this.password, [Validators.required]),
    });

    this.form.get("username")?.valueChanges.subscribe((value) => (this.username = value));
    this.form.get("password")?.valueChanges.subscribe((value) => (this.password = value));
  }
  login() {
    this.isLoading = true;
    this.authenticationService.login(this.username, this.password).pipe(
      finalize(() => {
          if (this.credentialValid) {
            if (this.user?.success) {
              if (this.user?.data?.roles.includes(AppConstant.ROLE_ADMIN)) {
                //  const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                //  console.log(returnUrl)
                //  this.router.navigateByUrl(returnUrl);
                this.router.navigate(["/admin"]);
              } else {
                this.router.navigate(["/brand-owner"]);
              }
              this.isLoading = false;
            }
          }
          else {
            this.isLoading = false;
            this.router.navigate(['/auth'])
          }
        })
      )
      .subscribe((data) => {
        (this.user = data)
        if (data.success) 
        {
          this.messService.success(data.message, "Thành công", {timeOut: 2000,progressBar: true,});
          this.credentialValid = true;
        } else if (!data.success) 
        {
          this.messService.error(data.message, "Thất bại", {timeOut: 2000, progressBar: true,});
          this.credentialValid = false;
        }
      });
  }
  openDialogForGotPassword(){
    let dialgoRef  =this.dialog.open(ForgotPasswordComponent,{width:'500px'})
  }
}
