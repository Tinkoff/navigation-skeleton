import {CommonModule} from '@angular/common';
import {
    Component,
    Inject,
    Injectable,
    InjectionToken,
    NgModule,
    NgZone,
} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {
    ANIMATION_MODULE_TYPE,
    BrowserAnimationsModule,
} from '@angular/platform-browser/animations';
import {CanActivate, Resolve, Router, RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {NEVER, Observable, Subject, timer} from 'rxjs';
import {mapTo} from 'rxjs/operators';
import {anything, instance, mock, when} from 'ts-mockito';

import {
    NavigationSkeletonComponent,
    NavigationSkeletonRoute,
} from './navigation-skeleton.component';

@Component({
    selector: 'test-routing',
    template: `<tcs-navigation-skeleton>projected-content</tcs-navigation-skeleton>`,
})
class TestRoutingComponent {}

@Injectable()
export class TestRoutingResolve implements Resolve<any> {
    resolve(): Observable<any> {
        return timer(0);
    }
}

@Injectable()
export class TestRoutingCanActivate implements CanActivate {
    canActivate(): Observable<boolean> {
        return timer(0).pipe(mapTo(true));
    }
}

@Component({
    selector: 'test',
    template: '',
})
class TestComponent {}

const TEST_SKELETON_DEPENDENCY = new InjectionToken<string>('[TEST] Skeleton dependency');

@Component({
    selector: 'test-skeleton-1',
    template: 'test-skeleton-1 with {{ dependency }}',
})
class TestSkeleton1Component {
    constructor(@Inject(TEST_SKELETON_DEPENDENCY) public readonly dependency: string) {}
}

@Component({
    selector: 'test-skeleton-2',
    template: 'test-skeleton-2 with {{ dependency }}',
})
class TestSkeleton2Component {
    constructor(@Inject(TEST_SKELETON_DEPENDENCY) public readonly dependency: string) {}
}

@Component({
    selector: 'fin-test-lazy',
    template: '',
})
class TestLazyComponent {}

@Component({
    selector: 'test-skeleton-lazy',
    template: 'test-skeleton-lazy with {{ dependency }}',
})
class TestSkeletonLazyComponent {
    constructor(@Inject(TEST_SKELETON_DEPENDENCY) public readonly dependency: string) {}
}

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '2',
                component: TestLazyComponent,
                skeleton: {
                    component: TestSkeletonLazyComponent,
                },
                resolve: {
                    test: TestRoutingResolve,
                },
            },
        ] as NavigationSkeletonRoute[]),
    ],
    declarations: [TestLazyComponent, TestSkeletonLazyComponent],
    providers: [
        {
            provide: TEST_SKELETON_DEPENDENCY,
            useValue: 'dependency from lazy module',
        },
    ],
})
export class TestSkeletonLazyModule {}

describe('NavigationSkeletonComponent | This component allows you to show skeletons of pages during navigation process', () => {
    let resolveMock: Resolve<any>;
    let canActivateMock: CanActivate;

    let routes: NavigationSkeletonRoute[] = [];

    let router: Router;
    let ngZone: NgZone;
    let fixture: ComponentFixture<TestRoutingComponent>;

    beforeEach(() => {
        resolveMock = mock(TestRoutingResolve);
        canActivateMock = mock(TestRoutingCanActivate);

        routes = [
            {
                path: '1',
                component: TestComponent,
                skeleton: {
                    component: TestSkeleton1Component,
                },
                canActivate: [TestRoutingCanActivate],
            },
            {
                path: '2',
                component: TestComponent,
                skeleton: {
                    component: TestSkeleton2Component,
                },
                resolve: {
                    test: TestRoutingResolve,
                },
            },
            {
                path: '3',
                canActivate: [TestRoutingCanActivate],
                loadChildren: () => TestSkeletonLazyModule,
            },
            {
                path: '4',
                component: TestComponent,
                canActivate: [TestRoutingCanActivate],
            },
            {
                path: '5',
                canActivate: [TestRoutingCanActivate],
                loadChildren: () => TestSkeletonLazyModule,
            },
        ];
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                RouterTestingModule.withRoutes(routes),
                BrowserAnimationsModule,
            ],
            declarations: [
                TestRoutingComponent,
                TestComponent,
                TestSkeleton1Component,
                TestSkeleton2Component,
                NavigationSkeletonComponent,
            ],
            providers: [
                {provide: TestRoutingResolve, useFactory: () => instance(resolveMock)},
                {
                    provide: TestRoutingCanActivate,
                    useFactory: () => instance(canActivateMock),
                },
                {
                    provide: TEST_SKELETON_DEPENDENCY,
                    useValue: 'dependency from parent module',
                },
            ],
        });
    });

    function setupComponent() {
        fixture = TestBed.createComponent(TestRoutingComponent);
        router = TestBed.inject(Router);
        ngZone = TestBed.inject(NgZone);

        fixture.detectChanges();
    }

    describe('When target route has a skeleton component', () => {
        it('Skeleton component must be taken from target route', fakeAsync(() => {
            // arrange
            when(canActivateMock.canActivate(anything(), anything())).thenReturn(NEVER);

            // act
            setupComponent();
            ngZone.run(() => router.navigateByUrl('/3/2'));
            tick();
            fixture.detectChanges();

            // assert
            expect(fixture.debugElement.nativeElement.textContent).toBe(
                'test-skeleton-lazy with dependency from lazy module',
            );
        }));

        it('Skeleton component can be reused', fakeAsync(() => {
            // arrange
            const canActivate = new Subject<boolean>();

            when(canActivateMock.canActivate(anything(), anything())).thenReturn(
                canActivate,
            );

            // act
            setupComponent();
            ngZone.run(() => router.navigateByUrl('/3/2'));
            tick();
            canActivate.next(true);
            fixture.detectChanges();

            ngZone.run(() => router.navigateByUrl('/5/2'));
            tick();
            fixture.detectChanges();

            // assert
            expect(fixture.debugElement.nativeElement.textContent).toBe(
                'test-skeleton-lazy with dependency from lazy module',
            );
        }));

        it('In the process of route activating, skeleton component of target route is shown', fakeAsync(() => {
            // arrange
            when(canActivateMock.canActivate(anything(), anything())).thenReturn(NEVER);

            // act
            setupComponent();
            ngZone.run(() => router.navigateByUrl('/1'));
            tick();
            fixture.detectChanges();

            // assert
            expect(fixture.debugElement.nativeElement.textContent).toBe(
                'test-skeleton-1 with dependency from parent module',
            );
        }));

        it('After route is activated, projected content is shown', fakeAsync(() => {
            // arrange
            when(canActivateMock.canActivate(anything(), anything())).thenReturn(true);

            // act
            setupComponent();
            ngZone.run(() => router.navigateByUrl('/1'));
            tick();
            fixture.detectChanges();

            // assert
            expect(fixture.debugElement.nativeElement.textContent).toBe(
                'projected-content',
            );
        }));

        it('In the process of route data resolving, skeleton component of target route is shown', fakeAsync(() => {
            // arrange
            when(resolveMock.resolve(anything(), anything())).thenReturn(NEVER);

            // act
            setupComponent();
            ngZone.run(() => router.navigateByUrl('/2'));
            tick();
            fixture.detectChanges();

            // assert
            expect(fixture.debugElement.nativeElement.textContent).toBe(
                'test-skeleton-2 with dependency from parent module',
            );
        }));

        it('After resolving route data, projected content is shown', fakeAsync(() => {
            // arrange
            when(resolveMock.resolve(anything(), anything())).thenReturn('data');

            // act
            setupComponent();
            ngZone.run(() => router.navigateByUrl('/2'));
            tick();
            fixture.detectChanges();

            // assert
            expect(fixture.debugElement.nativeElement.textContent).toBe(
                'projected-content',
            );
        }));
    });

    it('When target route does not have a skeleton component - projected content is shown', fakeAsync(() => {
        // arrange
        when(canActivateMock.canActivate(anything(), anything())).thenReturn(NEVER);

        // act
        setupComponent();
        ngZone.run(() => router.navigateByUrl('/4'));
        tick();
        fixture.detectChanges();

        // assert
        expect(fixture.debugElement.nativeElement.textContent).toBe('projected-content');
    }));

    it('When animations are enabled - component works with them', fakeAsync(() => {
        // arrange
        when(resolveMock.resolve(anything(), anything())).thenReturn(NEVER);
        TestBed.overrideProvider(ANIMATION_MODULE_TYPE, {useValue: 'BrowserAnimations'});

        // act
        setupComponent();
        ngZone.run(() => router.navigateByUrl('/2'));
        tick();
        fixture.detectChanges();

        // assert
        expect(
            fixture.debugElement.query(
                element => element.classes['ng-trigger-triggerChildAnimation'],
            ),
        ).toBeTruthy();
    }));

    it('When animations are off - component does not work with them', fakeAsync(() => {
        // arrange
        when(resolveMock.resolve(anything(), anything())).thenReturn(NEVER);
        TestBed.overrideProvider(ANIMATION_MODULE_TYPE, {useValue: null});

        // act
        setupComponent();
        ngZone.run(() => router.navigateByUrl('/2'));
        tick();
        fixture.detectChanges();

        // assert
        expect(
            fixture.debugElement.query(
                element => element.classes['ng-trigger-triggerChildAnimation'],
            ),
        ).toBeFalsy();
    }));
});
