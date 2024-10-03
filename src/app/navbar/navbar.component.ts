import { Component } from '@angular/core';
import { LoginService } from '../services/login-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentTime: string = '';
  username: any; // Set the username here or fetch it dynamically
  constructor(public loginService: LoginService) {
    this.username = this.loginService.decodedToken != null ? this.loginService.decodedToken.name : undefined;
  }
  ngOnInit() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000); // Update clock every second
  }

  updateClock() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString(); // Format the time as needed
  }
}
