import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showPassword = false;
  username!: string;
  password!: string;
  form!:FormGroup;
  user!:User;

  
  constructor() { }
  @Output() logInResponse = new EventEmitter<any>();
  ngOnInit(): void {
    this.form = new FormGroup({
      username : new FormControl(this.username),
      password : new FormControl(this.password)
    });
    this.form.get('username')?.valueChanges.subscribe((value)=>this.username = value);
    this.form.get('password')?.valueChanges.subscribe((value)=>this.password = value);
  }

  public togglePasswordVisibility():void{
    this.showPassword = !this.showPassword;
  }
  login(){
    console.log("username", this.username,"pass", this.password)
    this.logInResponse.emit({
      isLoggedIn:true
    })
  }
}
