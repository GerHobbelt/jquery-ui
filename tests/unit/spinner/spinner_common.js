TestHelpers.commonWidgetTests( "spinner", {
	defaults: {
		culture: null,
		disabled: false,
		alignment: 'right',
		icons: {
			down: "ui-icon-triangle-1-s",
			up: "ui-icon-triangle-1-n",
			left: "ui-icon-triangle-1-w",
			right: "ui-icon-triangle-1-e"
		},
		incremental: true,
		max: null,
		min: null,
		numberFormat: null,
		page: 10,
		step: 1,

		// callbacks
		change: null,
		create: null,
		spin: null,
		start: null,
		stop: null
	}
});
