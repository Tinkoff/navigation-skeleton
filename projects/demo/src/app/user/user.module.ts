import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NavigationSkeletonRoute} from '@tinkoff/navigation-skeleton';
import {UserSkeletonComponent} from './skeleton/user-skeleton.component';
import {UserComponent} from './user.component';
import {UserResolve} from './user.resolve';

@NgModule({
    declarations: [UserComponent, UserSkeletonComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: UserComponent,
                resolve: {
                    user: UserResolve,
                },
                skeleton: {
                    component: UserSkeletonComponent,
                },
            },
        ] as NavigationSkeletonRoute[]),
    ],
})
export class UserModule {}
