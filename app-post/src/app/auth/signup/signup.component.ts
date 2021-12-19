import { Component,OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  selector:"app-signup",
  templateUrl:"./signup.component.html",
  styleUrls:["./signup.component.css"]
})
export class SignUpComponent implements OnInit, OnDestroy{
  public isLoading = false;

  public signUpSub !: Subscription;

  constructor(public authService: AuthService){}

  ngOnInit(){
    this.signUpSub = this.authService.getAuthListener().subscribe(isAuth => {
      this.isLoading = isAuth;
    })
  }

  onSignUp(form: NgForm){
    if(form.invalid) return;

    this.isLoading = true;
    this.authService.signUpUser(form.value.email, form.value.password);

  }

  ngOnDestroy(): void {
    this.signUpSub.unsubscribe();
}
}
