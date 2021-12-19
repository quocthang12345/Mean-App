import {  HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable({providedIn: "root"})
export class AuthInterceptor implements HttpInterceptor{

  constructor(private authSerivce: AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler){
      const token = this.authSerivce.getToken();
      const requestTransform = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`)
      })
      return next.handle(requestTransform)
  }
}
