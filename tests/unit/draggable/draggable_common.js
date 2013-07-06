TestHelpers.commonWidgetTests( "draggable", {
	defaults: {
		// options
		appendTo: null,
		containment: null,
		disabled: false,
		exclude: "input,textarea,button,select",
		handle: null,
		helper: false,

		// backCompat options
		axis: false,
		// connectToSortable: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false,
		cancel: null,

		// callbacks
		beforeStart: null,
		create: null,
		drag: null,
		start: null,
		stop: null
	}
});
