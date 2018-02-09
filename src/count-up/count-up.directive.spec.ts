import { CountUpDirective } from './count-up.directive';
import { Element } from '@angular/compiler';
import { ElementRef } from '@angular/core/src/linker/element_ref';

describe('CountUpDirective', () => {
	it('should create an instance', () => {
		const directive = new CountUpDirective(new ElementRef('<div></div>'));
		expect(directive).toBeTruthy();
	});
});
