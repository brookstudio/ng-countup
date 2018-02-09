/*

	countUp.js
	by @inorganik

*/

// target = id of html element or var of previously selected html element where counting occurs
// startVal = the value you want to begin at
// endVal = the value you want to arrive at
// decimals = number of decimal places, default 0
// duration = duration of animation in seconds, default 2
// options = optional object of options (see below)

// Typescript version by @BrookStudio
import { ElementRef } from '@angular/core';

export class CountUp {
	lastTime = 0;
	version = '1.0.0';
	initialized = false;
	d: any;
	dec = 0;
	countDown = false;
	frameVal = 0;
	paused = false;
	rAF: number;
	startTime: any;
	timestamp: any;
	remaining: any;
	callback: Function;
	duration: number;

	constructor(
		private target: ElementRef,
		private startVal: number,
		private endVal: number,
		private decimals: number,
		private durationSecs: number,
		private options: any) {
		const vendors = ['webkit', 'moz', 'ms', 'o'];
		for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame =
				window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}
		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = function (callback) {
				const currTime = new Date().getTime();
				const timeToCall = Math.max(0, 16 - (currTime - this.lastTime));
				const id = window.setTimeout(function () { callback(currTime + timeToCall); },
					timeToCall);
				this.lastTime = currTime + timeToCall;
				return id;
			};
		}
		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = function (id) {
				clearTimeout(id);
			};
		}

		this.options = options || {
			useEasing: true, // toggle easing
			useGrouping: true, // 1,000,000 vs 1000000
			separator: ',', // character to use as a separator
			decimal: '.', // character to use as a decimal
			prefix: '', // optional text before the result
			suffix: '' // optional text after the result
		};

		this.options.easingFn = this.easeOutExpo; // optional custom easing function, default is Robert Penner's easeOutExpo
		this.options.formattingFn = this.formatNumber; // optional custom formatting function, default is formatNumber above

		if (this.options.separator === '') { this.options.useGrouping = false; }

		if (this.initialize()) { this.printValue(this.startVal); }

	}

	formatNumber(num) {
		num = num.toFixed(this.decimals);
		num += '';
		let x, x1, x2, rgx;
		x = num.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? this.options.decimal + x[1] : '';
		rgx = /(\d+)(\d{3})/;
		if (this.options.useGrouping) {
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + this.options.separator + '$2');
			}
		}
		return this.options.prefix + x1 + x2 + this.options.suffix;
	}

	// Robert Penner's easeOutExpo
	easeOutExpo(t, b, c, d): number {
		return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
	}
	ensureNumber(n): boolean {
		return (typeof n === 'number' && !isNaN(n));
	}

	initialize() {
		if (this.initialized) { return true; }
		this.d = (typeof this.target === 'string') ? document.getElementById(this.target) : this.target;
		if (!this.d) {
			console.error('[CountUp] target is null or undefined', this.d);
			return false;
		}
		this.startVal = Number(this.startVal);
		this.endVal = Number(this.endVal);
		// error checks
		if (this.ensureNumber(this.startVal) && this.ensureNumber(this.endVal)) {
			this.decimals = Math.max(0, this.decimals || 0);
			this.dec = Math.pow(10, this.decimals);
			this.duration = Number(this.durationSecs) * 1000 || 2000;
			this.countDown = (this.startVal > this.endVal);
			this.frameVal = this.startVal;
			this.initialized = true;
			return true;
		} else {
			console.error('[CountUp] startVal or endVal is not a number', this.startVal, this.endVal);
			return false;
		}
	}

	printValue(value) {
		const result = this.formatNumber(value);

		if (this.d.tagName === 'INPUT') {
			this.d.value = result;
		} else if (this.d.tagName === 'text' || this.d.tagName === 'tspan') {
			this.d.textContent = result;
		} else {
			this.d.innerHTML = result;
		}
	}

	count(timestamp) {

		if (!this.startTime) { this.startTime = timestamp; }

		this.timestamp = timestamp;
		const progress = timestamp - this.startTime;
		this.remaining = this.duration - progress;

		// to ease or not to ease
		if (this.options.useEasing) {
			if (this.countDown) {
				this.frameVal = this.startVal - this.easeOutExpo(progress, 0, this.startVal - this.endVal, this.duration);
			} else {
				this.frameVal = this.easeOutExpo(progress, this.startVal, this.endVal - this.startVal, this.duration);
			}
		} else {
			if (this.countDown) {
				this.frameVal = this.startVal - ((this.startVal - this.endVal) * (progress / this.duration));
			} else {
				this.frameVal = this.startVal + (this.endVal - this.startVal) * (progress / this.duration);
			}
		}

		// don't go past endVal since progress can exceed duration in the last frame
		if (this.countDown) {
			this.frameVal = (this.frameVal < this.endVal) ? this.endVal : this.frameVal;
		} else {
			this.frameVal = (this.frameVal > this.endVal) ? this.endVal : this.frameVal;
		}

		// decimal
		this.frameVal = Math.round(this.frameVal * this.dec) / this.dec;

		// format and print value
		this.printValue(this.frameVal);

		// whether to continue
		if (progress < this.duration) {
			this.rAF = requestAnimationFrame((ts) => this.count(ts));
		} else {
			if (this.callback) { this.callback(); }
		}
	}
	// start your animation
	start(callback) {
		if (!this.initialize()) { return; }
		this.callback = callback;
		this.rAF = requestAnimationFrame(() => this.count);
	}
	// toggles pause/resume animation
	pauseResume() {
		if (!this.paused) {
			this.paused = true;
			cancelAnimationFrame(this.rAF);
		} else {
			this.paused = false;
			delete this.startTime;
			this.duration = this.remaining;
			this.startVal = this.frameVal;
			requestAnimationFrame(() => this.count);
		}
	}
	// reset to startVal so animation can be run again
	reset() {
		this.paused = false;
		delete this.startTime;
		this.initialized = false;
		if (this.initialize()) {
			cancelAnimationFrame(this.rAF);
			this.printValue(this.startVal);
		}
	}
	// pass a new endVal and start animation
	update(newEndVal) {
		if (!this.initialize()) { return; }
		newEndVal = Number(newEndVal);
		if (!this.ensureNumber(newEndVal)) {
			console.error('[CountUp] update() - new endVal is not a number', newEndVal);
			return;
		}
		if (newEndVal === this.frameVal) { return; }
		cancelAnimationFrame(this.rAF);
		this.paused = false;
		delete this.startTime;
		this.startVal = this.frameVal;
		this.endVal = newEndVal;
		this.countDown = (this.startVal > this.endVal);
		this.rAF = requestAnimationFrame((ts) => this.count(ts));
	}

}
