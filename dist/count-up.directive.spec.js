"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var count_up_directive_1 = require("./count-up.directive");
var element_ref_1 = require("@angular/core/src/linker/element_ref");
describe('CountUpDirective', function () {
    it('should create an instance', function () {
        var directive = new count_up_directive_1.CountUpDirective(new element_ref_1.ElementRef('<div></div>'));
        expect(directive).toBeTruthy();
    });
});
//# sourceMappingURL=count-up.directive.spec.js.map