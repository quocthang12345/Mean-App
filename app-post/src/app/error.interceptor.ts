import {  HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";
import {MatDialog} from '@angular/material/dialog';
import { ErrorComponent } from "./error/error.component";

@Injectable({providedIn: "root"})
export class ErrorInterceptor implements HttpInterceptor{

  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler){
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          let message = "Unknown Error Occurred!";
          if(error.error.message){
            message = error.error.message
          }
          this.dialog.open(ErrorComponent, {data: {error: error.error.message}});
          return throwError(new Error(error.error.message));
        })
      )
  }
}
