"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var countUp_1 = require("./countUp");
var CountUpDirective = /** @class */ (function () {
    function CountUpDirective(el) {
        this.el = el;
    }
    Object.defineProperty(CountUpDirective.prototype, "endVal", {
        get: function () {
            return this._endVal;
        },
        set: function (value) {
            this._endVal = value;
            if (isNaN(value)) {
                return;
            }
            if (!this._countUp) {
                return;
            }
            this._countUp.update(value);
        },
        enumerable: true,
        configurable: true
    });
    CountUpDirective.prototype.ngOnInit = function () {
        this._countUp = this.createCountUp(this.startVal, this.endVal, this.decimals, this.duration);
        this.animate();
    };
    /**
         * Re-animate if preference is set.
         */
    CountUpDirective.prototype.onClick = /**
         * Re-animate if preference is set.
         */
    function () {
        if (this.reanimateOnClick) {
            this.animate();
        }
    };
    CountUpDirective.prototype.createCountUp = function (sta, end, dec, dur) {
        sta = sta || 0;
        if (isNaN(sta)) {
            sta = Number(sta.match(/[\d\-\.]+/g).join(''));
        } // strip non-numerical characters
        end = end || 0;
        if (isNaN(end)) {
            end = Number(end.match(/[\d\-\.]+/g).join(''));
        } // strip non-numerical characters
        dur = Number(dur) || 2;
        dec = Number(dec) || 0;
        // construct countUp
        var cu = new countUp_1.CountUp(this.el.nativeElement, sta, end, dec, dur, this.options);
        if (end > 999) {
            // make easing smoother for large numbers
            cu = new countUp_1.CountUp(this.el.nativeElement, sta, end - 100, dec, dur / 2, this.options);
        }
        return cu;
    };
    CountUpDirective.prototype.animate = function () {
        var _this = this;
        this._countUp.reset();
        if (this.endVal > 999) {
            this._countUp.start(function () { return _this._countUp.update(_this.endVal); });
        }
        else {
            this._countUp.start(null);
        }
    };
    CountUpDirective.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[countUp]'
                },] },
    ];
    /** @nocollapse */
    CountUpDirective.ctorParameters = function () { return [
        { type: core_1.ElementRef, decorators: [{ type: core_1.Inject, args: [core_1.ElementRef,] },] },
    ]; };
    CountUpDirective.propDecorators = {
        "options": [{ type: core_1.Input, args: ['countUp',] },],
        "startVal": [{ type: core_1.Input },],
        "endVal": [{ type: core_1.Input },],
        "duration": [{ type: core_1.Input },],
        "decimals": [{ type: core_1.Input },],
        "reanimateOnClick": [{ type: core_1.Input },],
        "onClick": [{ type: core_1.HostListener, args: ['click',] },],
    };
    return CountUpDirective;
}());
exports.CountUpDirective = CountUpDirective;
//# sourceMappingURL=count-up.directive.js.map