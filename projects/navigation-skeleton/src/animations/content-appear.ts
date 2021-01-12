import {
    animate,
    AnimationTriggerMetadata,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const contentAppear: AnimationTriggerMetadata = trigger('contentAppear', [
    transition(':enter', [style({opacity: 0}), animate(200, style({opacity: 1}))]),
]);
