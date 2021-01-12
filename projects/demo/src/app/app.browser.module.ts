import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationSkeletonModule} from '@tinkoff/navigation-skeleton';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routes';
import {OneComponent} from './one/one.component';
import {TwoComponent} from './two/two.component';

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        BrowserModule.withServerTransition({
            appId: 'demo',
        }),
        AppRoutingModule,
        NavigationSkeletonModule,
    ],
    declarations: [AppComponent, OneComponent, TwoComponent],
    providers: [
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy,
        },
    ],
})
export class AppBrowserModule {}
