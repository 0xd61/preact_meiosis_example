import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { states$, actions } from '../store.js'

import Header from './header';

// Code-splitting is automated for routes
import Home from '../routes/home';
import Profile from '../routes/profile';

export default class App extends Component {
	
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

  componentWillMount() {
    var setState = this.setState.bind(this);
    states$.map(state => {
      setState(state);
    });
  }

	render() {
    var state = this.state;
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
				  <Profile state={state.profile1} actions={actions.profile1} path="/profile/" user="me" />
				  <Profile state={state.profile2} actions={actions.profile2} path="/profile/:user" />
				</Router>
        <pre>{JSON.stringify(state, null, 4)}</pre>
			</div>
		);
	}
}
