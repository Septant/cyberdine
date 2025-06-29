import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-main-page',
  imports: [MatCardModule, MatIcon],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {}
