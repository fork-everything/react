var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-dom/test-utils');

describe('ReactDOM', () => {
	it('allows a DOM element to be used with a string', () => {
		var container = document.createElement('div');
		ReactDOM.render(<div className="container">
			<span>hello</span>
			asshole
		</div>, container);
	});

	it('setState out side', () => {
		var updateCount = 0;

		class Component extends React.Component {
			state = { x: 0 };

			componentDidUpdate() {
				updateCount++;
			}

			render() {
				return <div>{this.state.x}</div>;
			}
		}

		var instance = ReactTestUtils.renderIntoDocument(<Component />);
		instance.setState({ x: 1 });
		expect(instance.state.x).toBe(0);
		instance.setState({ x: 2 });
		expect(updateCount).toBe(0);
	});

	it.only('setState at life cycle ', () => {
		class Component extends React.Component {
			state = { x: 0 };

			componentWillMount() {
				console.log(this.state);
			}

			componentDidMount() {
				console.log(this.state);
			}

			componentWillUpdate() {
				this.setState({x: 1});
				console.log(this.state);
			}

			componentDidUpdate() {
				console.log(this.state);
			}
			render() {
				return <div>{this.state.x}</div>;
			}
		}

		const instance = ReactTestUtils.renderIntoDocument(<Component />);
		instance.setState({x: -1});
	});

	it('setState in event handler', () => {
		let target;
		class Component extends React.Component {
			state = { x: 0 };

			clickHandler = () => {
				this.setState({x:9});
				console.log(this.state);
			}

			render() {
				return <div onClick={this.clickHandler} ref={ref => target = ref}>{this.state.x}</div>;
			}
		}

		ReactTestUtils.renderIntoDocument(<Component />);
		ReactTestUtils.Simulate.click(target);
	});
});
