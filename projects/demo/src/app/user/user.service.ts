import {Injectable} from '@angular/core';
import {Observable, timer} from 'rxjs';
import {mapTo} from 'rxjs/operators';

export interface User {
    name: string;
}

@Injectable({providedIn: 'root'})
export class UsersService {
    getCurrentUser(): Observable<User> {
        return timer(2500).pipe(mapTo({name: 'Excelsior'}));
    }
}
