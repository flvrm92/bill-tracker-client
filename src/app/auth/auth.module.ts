import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../app-materials.module';
import { AuthRoutingModule } from './auth-routing.module';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  declarations: [LoginComponent, ChangePasswordComponent],
  imports: [CommonModule, ReactiveFormsModule, AppMaterialsModule, AuthRoutingModule]
})
export class AuthModule { }
