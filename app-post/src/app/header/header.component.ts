import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy{

  public userIsAuthenticated = false;

  private authSubcription = new Subscription();

  constructor(private authService: AuthService){}

  ngOnInit(): void{
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authSubcription = this.authService.getAuthListener().subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated
    });
  }

  ngOnDestroy(): void {
    this.authSubcription.unsubscribe();
  }

  onLogout(){
    this.authService.logoutUser();
  }
}
