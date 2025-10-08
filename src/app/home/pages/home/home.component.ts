import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent {

    constructor(private readonly authService: AuthService) {
        this.authService.login({ email: 'flvrm92@gmail.com', password: 'Change@me1' }).subscribe({
            next: (response) => console.log('Login successful:', response),
            error: (error) => console.error('Login failed:', error)
        });
    }

}
