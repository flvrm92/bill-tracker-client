import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeModule } from './home/home.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryModule } from './category/category.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppMaterialsModule } from './app-materials.module';
import { CoreModule } from './core/core.module';
import { ProgressBarInterceptor } from './core/services/progress-bar.interceptor';

@NgModule({
    declarations: [
        AppComponent,
    ],
    bootstrap: [
        AppComponent,
    ],
    imports: [BrowserModule,
        AppRoutingModule,
        HomeModule,
        BrowserModule,
        BrowserAnimationsModule,
        CategoryModule,
        AppMaterialsModule,
        CoreModule], providers: [
            {
                provide: HTTP_INTERCEPTORS,
                useClass: ProgressBarInterceptor,
                multi: true
            },
            provideHttpClient(withInterceptorsFromDi())
        ]
})
export class AppModule { }
