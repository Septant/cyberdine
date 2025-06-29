import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TitledData } from '../../meta/app.meta';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-alert',
  imports: [MatButton, MatDialogActions, MatDialogClose, MatCardModule],
  templateUrl: './alert.html',
  standalone: true,
})
export class Alert {
  constructor(@Inject(MAT_DIALOG_DATA) public data: TitledData) {}
}
