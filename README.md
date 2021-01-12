# Tinkoff Navigation Skeleton

[![Build](https://github.com/TinkoffCreditSystems/navigation-skeleton/workflows/CI%20of%20all%20packages/badge.svg)](https://github.com/TinkoffCreditSystems/navigation-skeleton/actions?query=workflow%3A%22CI+of+all+packages%22)
[![npm version](https://img.shields.io/npm/v/@tinkoff/navigation-skeleton.svg)](https://www.npmjs.com/package/@tinkoff/navigation-skeleton)
[![angular-open-source-starter](https://img.shields.io/badge/made%20with-angular--open--source--starter-d81676?logo=angular)](https://github.com/TinkoffCreditSystems/angular-open-source-starter)

> This component allows you to show skeletons of pages during navigation process.

## Install

```
$ npm install @tinkoff/navigation-skeleton
```

## How to use

1.  Add `NavigationSkeletonModule,` to the `imports` section of root module.

    ```
    @NgModule({
       ...
       imports: [
           ...
           RouterModule.forRoot(...),
           NavigationSkeletonModule,
       ],
    })
    export class AppModule {}
    ```

2.  Change
    `<router-outlet></router-outlet>`
    to
    ```
    <tcs-navigation-skeleton>
        <router-outlet></router-outlet>
    </tcs-navigation-skeleton>
    ```
3.  Add skeleton component to the route definition
    ```
    const route: NavigationSkeletonRoute = {
       path: '...',
       component: ...,
       skeleton: {
           component: MySkeletonComponent,
       },
    };
    ```
