import { h, Component } from 'preact';
import Uppy from "@uppy/core";
import DragDrop from "@uppy/drag-drop";

export default class TestDropzone extends Component {

  componentDidMount() {
    Uppy.use(DragDrop, {
      target: "drag-drop-area",
    })

  }

	render() {
		return (
       <div id="drag-drop-area"></div>
		);
	}
}
