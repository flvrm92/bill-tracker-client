import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeModule } from './home/home.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryModule } from './category/category.module';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialsModule } from './app-materials.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,    
    HomeModule,
    BrowserModule,
    BrowserAnimationsModule,
    CategoryModule,
    HttpClientModule,
    AppMaterialsModule,
  ],
  providers: [],
  bootstrap: [
    AppComponent, 
  ]
})
export class AppModule { }
