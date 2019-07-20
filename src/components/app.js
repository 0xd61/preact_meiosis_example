import { h, Component } from "preact";
import { Router } from "preact-router";
import { states$, actions } from "../store.js";

import Header from "./header";

// Code-splitting is automated for routes
import Home from "../routes/home";
import Profile from "../routes/profile";
import ElementContainer from "./elementContainer.js";

export default class App extends Component {
  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  constructor(props) {
    super(props);
    this.canvas = document.createElement("canvas");
  }
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  componentWillMount() {
    var setState = this.setState.bind(this);
    states$.map(state => {
      setState(state);
    });
  }

  componentDidMount() {
    this.canvas.width = 300;
    this.canvas.height = 300;
  }

  handleChange = event => {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    console.log(event.target.files[0]);
    const img = new Image();
    reader.onload = e => {
      img.src = e.target.result;
      const ctx = this.canvas.getContext("2d");
      ctx.fillStyle = "#e3e3e3"; /// set white fill style
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      img.onload = () => {
        this.drawImageProp(ctx,img, 0, 0, this.canvas.width, this.canvas.height);
        ctx.canvas.toBlob(
          blob => {
            const file = new File([blob], "myFilename", {
              type: "image/jpeg",
              lastModified: Date.now()
            });
            console.log(file);
            this.setState({ image: file, preview: URL.createObjectURL(file) });
          },
          "image/jpeg",
          1
        );
      };
    };
  };

  drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
      x = y = 0;
      w = ctx.canvas.width;
      h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
      ih = img.height,
      r = Math.min(w / iw, h / ih),
      nw = iw * r, // new prop. width
      nh = ih * r, // new prop. height
      cx,
      cy,
      cw,
      ch,
      ar = 1;

    // decide which gap to fill
    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  }

  render() {
    var state = this.state;
    return (
      <div id="app">
        <Header />
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Profile
            state={state.profile}
            actions={actions.profile}
            path="/profile/"
            user="me"
          />
          <Profile
            state={state.profile}
            actions={actions.profile}
            path="/profile/:user"
          />
        </Router>

        <input type="file" accept="image/*" onChange={this.handleChange} />
        <img src={this.state.preview} />
        <pre>{JSON.stringify(state, null, 4)}</pre>
      </div>
    );
  }
}
