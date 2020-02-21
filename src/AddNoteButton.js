import React, {Component} from 'react';
import { Link } from 'react-router-dom';

export default class addNoteButton extends Component {

  render(props) {

    return (
      <Link to={`/addNote${this.props.folderUrl}`}>
        <button className='add-note-button'>Add note</button>
      </Link>
    );
  }
}