import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { AuthManager } from './services/auth.manager';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private authManager = inject(AuthManager);
  ngOnInit(): void {
    const storedEmail = this.authManager.getCurrentUserEmail();
    if (storedEmail) {
      this.authManager.login({ email: storedEmail });
    }
  }
  protected title = 'Сyberdine';
}
