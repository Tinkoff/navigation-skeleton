import {animateChild, query, transition, trigger} from '@angular/animations';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Injector,
    NgModuleRef,
    Optional,
    Type,
} from '@angular/core';
import {ANIMATION_MODULE_TYPE} from '@angular/platform-browser/animations';
import {
    GuardsCheckStart,
    NavigationCancel,
    NavigationEnd,
    Route,
    Router,
    RouterStateSnapshot,
    RoutesRecognized,
} from '@angular/router';
import {concat, Observable, of} from 'rxjs';
import {filter, map, mapTo, switchMap, takeUntil} from 'rxjs/operators';

export interface NavigationSkeletonRouteData {
    component?: Type<any>;
}

export interface NavigationSkeletonRoute extends Route {
    skeleton?: NavigationSkeletonRouteData;
    children?: NavigationSkeletonRoute[];
}

@Component({
    selector: 'tcs-navigation-skeleton',
    templateUrl: './navigation-skeleton.component.html',
    styleUrls: ['./navigation-skeleton.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('triggerChildAnimation', [
            transition('* => void', [query('@*', [animateChild()], {optional: true})]),
        ]),
    ],
})
export class NavigationSkeletonComponent {
    readonly skeleton: Observable<NavigationSkeleton | null>;

    constructor(
        router: Router,
        @Inject(ANIMATION_MODULE_TYPE)
        @Optional()
        public readonly animations?: 'NoopAnimations' | 'BrowserAnimations' | null,
    ) {
        const start = router.events.pipe(
            filter(event => event instanceof GuardsCheckStart),
        );
        const end = router.events.pipe(
            filter(
                event =>
                    event instanceof NavigationEnd || event instanceof NavigationCancel,
            ),
        );
        const skeleton = router.events.pipe(
            filter(event => event instanceof RoutesRecognized),
            map((event: RoutesRecognized) => this.getSkeleton(event.state)),
        );

        this.skeleton = skeleton.pipe(
            switchMap(skeleton =>
                skeleton
                    ? concat(start.pipe(mapTo(skeleton), takeUntil(end)), of(null))
                    : of(null),
            ),
        );
    }

    private getSkeleton(state: RouterStateSnapshot): NavigationSkeleton | null {
        let route = state.root;
        let injector = this.getRouteInjector(route.routeConfig);

        while (route.firstChild) {
            route = route.firstChild;
            injector = this.getRouteInjector(route.routeConfig) || injector;
        }

        const component = (route?.routeConfig as NavigationSkeletonRoute | null)?.skeleton
            ?.component;

        return component ? {component, injector} : null;
    }

    private getRouteInjector(route: Route | null): Injector | null {
        return (route as InternalRoute)?._loadedConfig?.module?.injector || null;
    }
}

interface NavigationSkeleton {
    component: Type<any>;
    injector: Injector;
}

// TODO: https://github.com/angular/angular/issues/24069
// https://github.com/angular/angular/blob/9.1.11/packages/router/src/config.ts#L484-L488
interface InternalRoute extends Route {
    _loadedConfig?: LoadedRouterConfig;
}
interface LoadedRouterConfig {
    module: NgModuleRef<any>;
}
