import { OnInit, ElementRef } from '@angular/core';
export declare class CountUpDirective implements OnInit {
    private el;
    options: any;
    startVal: number;
    private _endVal;
    endVal: number;
    /**
     * Optional duration of the animation. Default is two seconds.
     */
    duration: number;
    /**
     * Optional number of decimal places. Default is two.
     */
    decimals: number;
    /**
     * Optional flag for specifying whether the element should re-animate when clicked.
     * Default is true.
     */
    reanimateOnClick: boolean;
    private _countUp;
    ngOnInit(): void;
    /**
     * Re-animate if preference is set.
     */
    onClick(): void;
    constructor(el: ElementRef);
    private createCountUp(sta, end, dec, dur);
    private animate();
}
