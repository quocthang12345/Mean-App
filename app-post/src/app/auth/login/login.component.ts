import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  selector:"app-login",
  templateUrl:"./login.component.html",
  styleUrls:["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy{
  public isLoading = false;

  public loginSub!: Subscription;

  constructor(public authService: AuthService){}

  ngOnInit(){
    this.loginSub = this.authService.getAuthListener().subscribe(isAuth => {
      this.isLoading = isAuth;
    })
  }

  onLogin(form: NgForm){
    if(form.invalid) return;

    this.isLoading = true;
    this.authService.loginUser(form.value.email,form.value.password);
  }

  ngOnDestroy(): void {
      this.loginSub.unsubscribe();
  }
}
