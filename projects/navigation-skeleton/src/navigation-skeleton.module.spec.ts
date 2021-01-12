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

    it('Должен экспортировать компонент для показа скелетонов', () => {
        // assert
        expect(TestBed.createComponent(NavigationSkeletonComponent)).toBeDefined();
    });
});
