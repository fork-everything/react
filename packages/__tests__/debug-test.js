var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-dom/test-utils');

describe('ReactDOM', () => {
	it('should handle simple dom', () => {
		var container = document.createElement('div');
		ReactDOM.render(<div className="container">
			<span>hello</span>
			Fiber
		</div>, container);
	});

	it('should handle class component', () => {
		class List extends React.Component {
			componentWillMount() {
				console.log('will mount');
			}
			componentDidMount() {
				console.log('did mount');
			}
			componentWillUpdate() {
				console.log('will update');
			}
			componentDidUpdate() {
				console.log('did update');
			}
			render() {
				return (<ul>
					{this.props.items.map(item => <li>{item}</li>)}
				</ul>);
			}
		}

		var container = document.createElement('div');
		ReactDOM.render(<div className="container">
			<span>hello</span>
			<List items={['Fiber', 'React']} />
		</div>, container);
	});

	it('should update class component', () => {
		class List extends React.Component {
			componentWillMount() {
				console.log('will mount');
			}
			componentDidMount() {
				console.log('did mount');
			}
			componentWillUpdate() {
				console.log('will update');
			}
			componentDidUpdate() {
				console.log('did update');
			}
			render() {
				return (<ul>
					{this.props.items.map(item => <li>{item}</li>)}
				</ul>);
			}
		}

		class Component extends React.Component {
			render() {
				return (<div className="container">
					<span>hello</span>
					<List items={['Fiber', 'React']} />
				</div>);
			}
		}

		var instance = ReactTestUtils.renderIntoDocument(<Component />);
		instance.setState({ x: 1 });
	});

	it('setState out side, will not trigger batchUpdate', () => {
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
		expect(instance.state.x).toBe(1);
		instance.setState({ x: 8 });
		expect(updateCount).toBe(2);
	});

	it('setState at life cycle ', () => {
		class Component extends React.Component {
			state = { x: 0 };

			componentWillMount() {
				console.log('will mount', this.state);
				this.setState({ x: 1 });
				this.setState({ x: 2 });
				/*
				ReactFiberScheduler.js#requestWork
				isRendering is true, so end by here
				  if (isRendering) {
					// Prevent reentrancy. Remaining work will be scheduled at the end of
					// the currently rendering batch.
					return;
				}
				*/
			}

			componentDidMount() {
				console.log('did mount', this.state);
			}

			componentWillReceiveProps() {
				console.log('will receive', this.state);
			}

			componentWillUpdate() {
				console.log('will update', this.state);
			}

			componentDidUpdate() {
				console.log('did update', this.state);
			}
			render() {
				console.log('render');
				return <div>{this.state.x}</div>;
			}
		}

		const instance = ReactTestUtils.renderIntoDocument(<Component />);
		instance.setState({x: -1});
		expect(instance).toBeTruthy();
	});

	it.only('setState in event handler', () => {
		let target;
		class Component extends React.Component {
			state = { x: 0 };

			clickHandler = () => {
				this.setState({ x: 9 });
				/*
					ReactFiberScheduler.js#requestWork
				    if (isBatchingUpdates) { isBatchingUpdates is true, return
						// Flush work at the end of the batch.
						if (isUnbatchingUpdates) {
							// ...unless we're inside unbatchedUpdates, in which case we should
							// flush it now.
							performWorkOnRoot(root, _ReactFiberExpirationTime.Sync);
						}
						return;
					}
				*/
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
