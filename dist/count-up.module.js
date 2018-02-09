"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var count_up_directive_1 = require("./count-up.directive");
var CountUpModule = /** @class */ (function () {
    function CountUpModule() {
    }
    CountUpModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule
            ],
            declarations: [
                count_up_directive_1.CountUpDirective
            ],
            exports: [
                count_up_directive_1.CountUpDirective
            ]
        })
    ], CountUpModule);
    return CountUpModule;
}());
exports.CountUpModule = CountUpModule;
//# sourceMappingURL=count-up.module.js.map