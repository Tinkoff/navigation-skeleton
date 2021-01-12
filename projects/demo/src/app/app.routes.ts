import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OneComponent} from './one/one.component';
import {TwoComponent} from './two/two.component';

export const appRoutes: Routes = [
    {path: '1', component: OneComponent},
    {path: '2', component: TwoComponent},
    {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    },
    {path: '**', redirectTo: '2'},
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            initialNavigation: 'enabled',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
