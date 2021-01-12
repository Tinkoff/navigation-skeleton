import {CommonModule} from '@angular/common';
import {NgModule, Type} from '@angular/core';

import {NavigationSkeletonComponent} from './navigation-skeleton.component';

const COMPONENTS: Type<any>[] = [NavigationSkeletonComponent];

@NgModule({
    imports: [CommonModule],
    declarations: COMPONENTS,
    exports: COMPONENTS,
})
export class NavigationSkeletonModule {}
