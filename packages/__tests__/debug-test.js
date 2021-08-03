let React;
let ReactFeatureFlags;
let ReactTestUtils;

// Additional tests can be found in ReactHooksWithNoopRenderer. Plan is to
// gradually migrate those to this file.
describe('ReactHooks', () => {
	beforeEach(() => {
		jest.resetModules();

		ReactFeatureFlags = require('shared/ReactFeatureFlags');
		ReactFeatureFlags.debugRenderPhaseSideEffectsForStrictMode = false;
		React = require('react');
		ReactTestUtils = require('react-dom/test-utils');
	});

	it('test useState', () => {
		const { useState } = React;

		let setCounter1;
		function Parent() {
			const [counter1, _setCounter1] = useState(0);
			setCounter1 = _setCounter1;

			return <div>{counter1}</div>;
		}

		ReactTestUtils.renderIntoDocument(<Parent />);
		setCounter1(19);
	});
});
