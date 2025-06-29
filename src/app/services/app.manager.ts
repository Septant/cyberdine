import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../meta/user.meta';

@Injectable({
  providedIn: 'root',
})
export class AppManager {
  isAuthorized = signal(false);
  user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
}
