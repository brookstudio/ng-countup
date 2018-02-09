"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var count_up_directive_1 = require("./count-up.directive");
var CountUpModule = /** @class */ (function () {
    function CountUpModule() {
    }
    CountUpModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [
                        count_up_directive_1.CountUpDirective
                    ],
                    exports: [
                        count_up_directive_1.CountUpDirective
                    ]
                },] },
    ];
    /** @nocollapse */
    CountUpModule.ctorParameters = function () { return []; };
    return CountUpModule;
}());
exports.CountUpModule = CountUpModule;
//# sourceMappingURL=count-up.module.js.map