import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class AddFolderButton extends Component {
    render() {
        return(
            <Link to={`/addFolder`}>
                <button className='add-folder-button'>Add Folder</button>
            </Link>
        )
    }
}