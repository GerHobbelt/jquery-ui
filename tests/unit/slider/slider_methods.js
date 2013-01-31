/*
 * slider_methods.js
 */
(function($) {

module("slider: methods");

test("init", function() {
	expect(5);

	$("<div></div>").appendTo('body').slider().remove();
	ok(true, '.slider() called on element');

	$([]).slider().remove();
	ok(true, '.slider() called on empty collection');

	$('<div></div>').slider().remove();
	ok(true, '.slider() called on disconnected DOMElement');

	var el = $('<div></div>').slider();
	el.slider("option", "foo");
	el.remove();
	ok(true, 'arbitrary option getter after init');

	$('<div></div>').slider().slider("option", "foo", "bar").remove();
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	expect( 1 );
	domEqual( "#slider1", function() {
		$( "#slider1" ).slider().slider( "destroy" );
	});
});

test("enable", function() {
	expect( 5 );
	var el,
		expected = $('<div></div>').slider(),
		actual = expected.slider('enable');
	equal(actual, expected, 'enable is chainable');

	el = $('<div></div>').slider({ disabled: true });
	ok(el.hasClass('ui-state-disabled'), 'slider has ui-state-disabled class before enable method call');
	ok(el.hasClass('ui-slider-disabled'), 'slider has ui-slider-disabled class before enable method call');
	el.slider('enable');
	ok(!el.hasClass('ui-state-disabled'), 'slider does not have ui-state-disabled class after enable method call');
	ok(!el.hasClass('ui-slider-disabled'), 'slider does not have ui-slider-disabled class after enable method call');
});

test("disable", function() {
	expect( 5 );
	var el,
		expected = $('<div></div>').slider(),
		actual = expected.slider('disable');
	equal(actual, expected, 'disable is chainable');

	el = $('<div></div>').slider({ disabled: false });
	ok(!el.hasClass('ui-state-disabled'), 'slider does not have ui-state-disabled class before disabled method call');
	ok(!el.hasClass('ui-slider-disabled'), 'slider does not have ui-slider-disabled class before disable method call');
	el.slider('disable');
	ok(el.hasClass('ui-state-disabled'), 'slider has ui-state-disabled class after disable method call');
	ok(el.hasClass('ui-slider-disabled'), 'slider has ui-slider-disabled class after disable method call');
});

test("value", function() {
	expect( 17 );
	$([false, 'min', 'max']).each(function() {
		var el = $('<div></div>').slider({
			range: this,
			value: 5
		});
		equal(el.slider('value'), 5, 'range: ' + this + ' slider method get');
		equal(el.slider('value', 10), el, 'value method is chainable');
		equal(el.slider('value'), 10, 'range: ' + this + ' slider method set');
		el.remove();
	});
	var el = $('<div></div>').slider({
		min: -1, value: 0, max: 1
	});
	// min with value option vs value method
	el.slider('option', 'value', -2);
	equal(el.slider('option', 'value'), -2, 'value option does not respect min');
	equal(el.slider('value'), -1, 'value method get respects min');
	equal(el.slider('value', -2), el, 'value method is chainable');
	equal(el.slider('option', 'value'), -1, 'value method set respects min');
	// max with value option vs value method
	el.slider('option', 'value', 2);
	equal(el.slider('option', 'value'), 2, 'value option does not respect max');
	equal(el.slider('value'), 1, 'value method get respects max');
	equal(el.slider('value', 2), el, 'value method is chainable');
	equal(el.slider('option', 'value'), 1, 'value method set respects max');
});

//test("values", function() {
//	ok(false, "missing test - untested code is broken code.");
//});

})(jQuery);
