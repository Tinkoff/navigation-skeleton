import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {NavigationSkeletonComponent} from './navigation-skeleton.component';
import {NavigationSkeletonModule} from './navigation-skeleton.module';

describe('NavigationSkeletonRootModule', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, NavigationSkeletonModule],
        });
    });

    it('Should export the component that is used to display navigation skeletons', () => {
        // assert
        expect(TestBed.createComponent(NavigationSkeletonComponent)).toBeDefined();
    });
});
