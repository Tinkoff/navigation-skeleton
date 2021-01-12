import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {User, UsersService} from './user.service';

@Injectable({providedIn: 'root'})
export class UserResolve implements Resolve<User> {
    constructor(private userService: UsersService) {}

    resolve(): Observable<User> {
        return this.userService.getCurrentUser();
    }
}
