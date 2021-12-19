import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth.model";

import { environment } from "../../environments/environment";

@Injectable({ providedIn:"root"})
export class AuthService{

  private token!: string;

  private timerLogout: any;

  private isAuthenticated = false;

  private authSubject = new Subject<boolean>();

  private userId!: string;

  constructor(private http: HttpClient, private router: Router){}

  getUserId(){
    return this.userId;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getToken(){
    return this.token;
  }

  getAuthListener(){
    return this.authSubject.asObservable();
  }

  signUpUser(email: string, password: string){
    const data: AuthData = {
      email: email,
      password: password
    };
    this.http.post(`zz/signup`, data).subscribe(res => {
      console.log(res);
    }, error => {
      this.authSubject.next(false);
    })
  }

  loginUser(email: string, password: string){
    const data: AuthData = {
      email: email,
      password: password
    };
    this.http.post<{message: string, token: string, expireTime: number, userId: string}>(`${environment.apiUrl}/login`, data).subscribe(res => {
      if(res.token){
        this.token = res.token;
        const now = new Date();
        this.timerLogout = new Date(now.getTime() + res.expireTime * 1000);
        this.userId = res.userId;
        this.saveAuthDataToLocalStorage(this.token, this.timerLogout, this.userId);
        this.isAuthenticated = true;
        this.authSubject.next(true);
        this.router.navigate(["/"]);
      }

    }, error => {
      this.authSubject.next(false);
    })
  }

  logoutUser(){
    this.isAuthenticated = false;
    this.token = '';
    this.authSubject.next(false);
    clearTimeout(this.timerLogout);
    this.clearAuthDataFromLocalStorage();
    this.router.navigate(["/"]);
    this.userId = '';
  }

  autoAuthUser(){
    const authInfo = this.getAuthDataFromLocalStorage();

    if(!authInfo) return;

    const expiredDate = authInfo.expiredDate.getTime() - new Date().getTime()

    if(expiredDate > 0){
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.authSubject.next(true);
      this.setExpiredTimer(expiredDate / 1000);
      this.userId = authInfo.userId || "";
    }
  }

  setExpiredTimer(duration: number){
    console.log(duration)
      setTimeout(() => {
        this.logoutUser();
      }, duration * 1000)
  }

  clearAuthDataFromLocalStorage(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiredDate");
    localStorage.removeItem("userId");
  }

  saveAuthDataToLocalStorage(token: string, expiredDate: Date, userId: string){
    localStorage.setItem("token", token);
    localStorage.setItem("expiredDate", expiredDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  getAuthDataFromLocalStorage(){
    const token = localStorage.getItem("token");
    const expiredDate = localStorage.getItem("expiredDate");
    const userId = localStorage.getItem("userId");
    if(!token || !expiredDate){
      return;
    }
    return{
      token,
      expiredDate: new Date(expiredDate),
      userId: userId
    }
  }
}
