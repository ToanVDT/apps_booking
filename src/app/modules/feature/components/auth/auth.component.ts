import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from './service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AppConstant } from '../common/constant';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  valCheck: string[] = ['remember'];
  loading = false;
  username!: string;
  password!: string;
  userRole: string | undefined;
  user!: User;
  form!: FormGroup;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(this.username, [Validators.required]),
      password: new FormControl(this.password, [Validators.required]),
    });

    this.form.get('username')?.valueChanges.subscribe((value) => this.username = value);
    this.form.get('password')?.valueChanges.subscribe((value) => this.password = value);
  }
  login() {
    console.log(this.username,'-',this.password);
    this.loading = true;
    this.authenticationService.login(this.username, this.password).pipe(
        finalize(() => {
          if (this.user) {
            this.userRole = this.user.role
            if (this.userRole === AppConstant.ROLE_ADMIN) {
              //  const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
              //  console.log(returnUrl)
              //  this.router.navigateByUrl(returnUrl);
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/brand-owner']);
            }
            this.loading = false;
          }
        })
      )
      .subscribe((data) => {
        (this.user = data), console.log('data ' + data);
      });
  }
}
