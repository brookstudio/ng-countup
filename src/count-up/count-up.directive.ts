import { Directive, Input, OnInit, HostListener, Inject, ElementRef } from '@angular/core';
import * as Countup from './countUp';
import { CountUp } from './countUp';

@Directive({
	selector: '[countUp]'
})
export class CountUpDirective implements OnInit {

	@Input('countUp')
	options: any;

	@Input()
	startVal: number;

	private _endVal: number;
	@Input()
	get endVal(): number {
		return this._endVal;
	}

	set endVal(value: number) {
		this._endVal = value;

		if (isNaN(value)) {
			return;
		}

		if (!this._countUp) {
			return;
		}

		this._countUp.update(value);
	}

	/**
     * Optional duration of the animation. Default is two seconds.
     */
	@Input()
	duration: number;

	/**
     * Optional number of decimal places. Default is two.
     */
	@Input()
	decimals: number;

	/**
     * Optional flag for specifying whether the element should re-animate when clicked.
     * Default is true.
     */
	@Input()
	reanimateOnClick: boolean;

	private _countUp: CountUp;

	ngOnInit() {
		this._countUp = this.createCountUp(
			this.startVal, this.endVal, this.decimals, this.duration);
		this.animate();
	}

	/**
	 * Re-animate if preference is set.
	 */
	@HostListener('click')
	onClick() {
		if (this.reanimateOnClick) {
			this.animate();
		}
	}

	constructor( @Inject(ElementRef) private el: ElementRef) { }

	private createCountUp(sta, end, dec, dur) {
		sta = sta || 0;
		if (isNaN(sta)) { sta = Number(sta.match(/[\d\-\.]+/g).join('')); } // strip non-numerical characters
		end = end || 0;
		if (isNaN(end)) { end = Number(end.match(/[\d\-\.]+/g).join('')); } // strip non-numerical characters
		dur = Number(dur) || 2;
		dec = Number(dec) || 0;

		// construct countUp
		let cu = new CountUp(this.el.nativeElement, sta, end, dec, dur, this.options);
		if (end > 999) {
			// make easing smoother for large numbers
			cu = new CountUp(this.el.nativeElement, sta, end - 100, dec, dur / 2, this.options);
		}

		return cu;
	}

	private animate() {
		this._countUp.reset();
		if (this.endVal > 999) {
			this._countUp.start(() => this._countUp.update(this.endVal));
		} else {
			this._countUp.start(null);
		}
	}

}
