import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, finalize } from "rxjs";
import { ApplicationService } from "./application.service";

@Injectable()
export class ProgressBarInterceptor implements HttpInterceptor {
  constructor(private applicationService: ApplicationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.applicationService.showProgressBar(true);
    return next.handle(req).pipe(finalize(() => this.applicationService.showProgressBar(false)));
  }

}