import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from './user.service';

@Component({
    template: `<h1>Hello, {{ (user | async).name }}</h1>`,
})
export class UserComponent {
    user: Observable<User> = this.activatedRoute.data.pipe(map(data => data.user));

    constructor(private activatedRoute: ActivatedRoute) {}
}
