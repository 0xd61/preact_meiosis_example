import { h, Component } from 'preact';
import { states$ } from '../../store.js';
import filter from 'flyd/module/filter';
import style from './style';

export default class Profile extends Component {
	state = {
		time: Date.now(),
		count: 10,
    resetButton: false
	};
	// update the current time
	updateTime = () => {
		this.setState({ time: Date.now() });
	};

	increment = () => {
		this.setState({ count: this.state.count+1 });
	};
  showReset = (value) => {
    this.setState({ resetButton: value });
  }

	// gets called when this route is navigated to
	componentDidMount() {
		// start a timer for the clock:
		this.timer = setInterval(this.updateTime, 1000);
    filter(state => state.profile.count > 20, states$).map(() => this.showReset(true));
    filter(state => state.profile.count < 20, states$).map(() => this.showReset(false));
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		clearInterval(this.timer);
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ user }, { time, count, resetButton }) {
    var { state, actions } = this.props;
    const reset = resetButton ? <button onClick={() => setTimeout(() => actions.reset(), 3000)}>Reset</button>:<div></div>;
		return (
			<div class={style.profile}>
				<h1>Profile: {user}</h1>
				<p>This is the user profile for a user named { user }.</p>

				<div>Current time: {new Date(time).toLocaleString()}</div>

				<p>
					<button onClick={this.increment}>Click Me</button>
					{' '}
					Clicked {count} times.
				</p>
        <p>
        The current state is: {state.count}
        <button onClick={actions.increment}>Increment</button>
          {reset}
        </p>
			</div>
		);
	}
}
