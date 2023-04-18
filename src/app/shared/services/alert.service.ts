import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

export enum AlertIcon {
  Success = 'success',
  Information = 'info',
  Question = 'question',
  Warning = 'warning',
  Error = 'error',
}

export interface AlertButton {
  key: string;
  text: string;
  icon?: string;
  color?: string;
}

export interface AlertOptions {
  title?: string;
  text?: string;
  icon?: AlertIcon;
  toast?: boolean;
  timer?: number | undefined;
  buttons?: [AlertButton, AlertButton];
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private DEFAULT_CONFIRM_BUTTON_COLOR = '#0c69b0';

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  public alert(options: AlertOptions) {
    Swal.fire({
      title: options.title || '',
      html: options.text || '',
      icon: options.icon || AlertIcon.Information,
      confirmButtonColor: this.DEFAULT_CONFIRM_BUTTON_COLOR,
    });
  }

  alertPopup({
    title = '',
    text = '',
    icon = AlertIcon.Information,
  }: AlertOptions) {
    Swal.fire({
      title: title,
      html: text,
      icon: icon,
      timer: 2000,
      showConfirmButton: false,
    })
  }

  toastAlert({
    title = '',
    text = '',
    icon = AlertIcon.Information,
    toast = true,
    timer = 3000
  }: AlertOptions) {
    Swal.fire({
      title: title,
      html: text,
      icon: icon,
      timer: timer,
      toast: toast,
      showConfirmButton: false,
      timerProgressBar: true,
      position: 'top',
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  }

  async yesOrNoAlert({
    title = '',
    text = '',
    icon = AlertIcon.Information,
    toast = false,
  }: AlertOptions): Promise<boolean> {
    const response = await (toast ? this.toast : Swal).fire({
      title: title,
      html: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: this.DEFAULT_CONFIRM_BUTTON_COLOR,
    });

    return response.isConfirmed;
  } 

}
