"use strict";
/*

    countUp.js
    by @inorganik

*/
Object.defineProperty(exports, "__esModule", { value: true });
var CountUp = /** @class */ (function () {
    function CountUp(target, startVal, endVal, decimals, durationSecs, options) {
        this.target = target;
        this.startVal = startVal;
        this.endVal = endVal;
        this.decimals = decimals;
        this.durationSecs = durationSecs;
        this.options = options;
        this.lastTime = 0;
        this.version = '1.0.0';
        this.initialized = false;
        this.dec = 0;
        this.countDown = false;
        this.frameVal = 0;
        this.paused = false;
        var vendors = ['webkit', 'moz', 'ms', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - this.lastTime));
                var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
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
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.',
            prefix: '',
            suffix: '' // optional text after the result
        };
        this.options.easingFn = this.easeOutExpo; // optional custom easing function, default is Robert Penner's easeOutExpo
        this.options.formattingFn = this.formatNumber; // optional custom formatting function, default is formatNumber above
        if (this.options.separator === '') {
            this.options.useGrouping = false;
        }
        if (this.initialize()) {
            this.printValue(this.startVal);
        }
    }
    CountUp.prototype.formatNumber = function (num) {
        num = num.toFixed(this.decimals);
        num += '';
        var x, x1, x2, rgx;
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
    };
    // Robert Penner's easeOutExpo
    CountUp.prototype.easeOutExpo = function (t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    };
    CountUp.prototype.ensureNumber = function (n) {
        return (typeof n === 'number' && !isNaN(n));
    };
    CountUp.prototype.initialize = function () {
        if (this.initialized) {
            return true;
        }
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
        }
        else {
            console.error('[CountUp] startVal or endVal is not a number', this.startVal, this.endVal);
            return false;
        }
    };
    CountUp.prototype.printValue = function (value) {
        var result = this.formatNumber(value);
        if (this.d.tagName === 'INPUT') {
            this.d.value = result;
        }
        else if (this.d.tagName === 'text' || this.d.tagName === 'tspan') {
            this.d.textContent = result;
        }
        else {
            this.d.innerHTML = result;
        }
    };
    CountUp.prototype.count = function (timestamp) {
        var _this = this;
        if (!this.startTime) {
            this.startTime = timestamp;
        }
        this.timestamp = timestamp;
        var progress = timestamp - this.startTime;
        this.remaining = this.duration - progress;
        // to ease or not to ease
        if (this.options.useEasing) {
            if (this.countDown) {
                this.frameVal = this.startVal - this.easeOutExpo(progress, 0, this.startVal - this.endVal, this.duration);
            }
            else {
                this.frameVal = this.easeOutExpo(progress, this.startVal, this.endVal - this.startVal, this.duration);
            }
        }
        else {
            if (this.countDown) {
                this.frameVal = this.startVal - ((this.startVal - this.endVal) * (progress / this.duration));
            }
            else {
                this.frameVal = this.startVal + (this.endVal - this.startVal) * (progress / this.duration);
            }
        }
        // don't go past endVal since progress can exceed duration in the last frame
        if (this.countDown) {
            this.frameVal = (this.frameVal < this.endVal) ? this.endVal : this.frameVal;
        }
        else {
            this.frameVal = (this.frameVal > this.endVal) ? this.endVal : this.frameVal;
        }
        // decimal
        this.frameVal = Math.round(this.frameVal * this.dec) / this.dec;
        // format and print value
        this.printValue(this.frameVal);
        // whether to continue
        if (progress < this.duration) {
            this.rAF = requestAnimationFrame(function (ts) { return _this.count(ts); });
        }
        else {
            if (this.callback) {
                this.callback();
            }
        }
    };
    // start your animation
    CountUp.prototype.start = function (callback) {
        var _this = this;
        if (!this.initialize()) {
            return;
        }
        this.callback = callback;
        this.rAF = requestAnimationFrame(function () { return _this.count; });
    };
    // toggles pause/resume animation
    CountUp.prototype.pauseResume = function () {
        var _this = this;
        if (!this.paused) {
            this.paused = true;
            cancelAnimationFrame(this.rAF);
        }
        else {
            this.paused = false;
            delete this.startTime;
            this.duration = this.remaining;
            this.startVal = this.frameVal;
            requestAnimationFrame(function () { return _this.count; });
        }
    };
    // reset to startVal so animation can be run again
    CountUp.prototype.reset = function () {
        this.paused = false;
        delete this.startTime;
        this.initialized = false;
        if (this.initialize()) {
            cancelAnimationFrame(this.rAF);
            this.printValue(this.startVal);
        }
    };
    // pass a new endVal and start animation
    CountUp.prototype.update = function (newEndVal) {
        var _this = this;
        if (!this.initialize()) {
            return;
        }
        newEndVal = Number(newEndVal);
        if (!this.ensureNumber(newEndVal)) {
            console.error('[CountUp] update() - new endVal is not a number', newEndVal);
            return;
        }
        if (newEndVal === this.frameVal) {
            return;
        }
        cancelAnimationFrame(this.rAF);
        this.paused = false;
        delete this.startTime;
        this.startVal = this.frameVal;
        this.endVal = newEndVal;
        this.countDown = (this.startVal > this.endVal);
        this.rAF = requestAnimationFrame(function (ts) { return _this.count(ts); });
    };
    return CountUp;
}());
exports.CountUp = CountUp;
//# sourceMappingURL=countUp.js.map