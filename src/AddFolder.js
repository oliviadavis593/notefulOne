import React, { Component } from 'react';
import NoteContext from './NoteContext';
import ValidationError from './ValidationError'
import config from './config'

class AddFolder extends Component {

    state = {
        folder_name: '',
        nameValid: false, 
        formValid: false, 
        validationMessages: {
            name: ''
        }
    }

    static contextType = NoteContext; 

    validateName(fieldValue) {
        const fieldErrors = {...this.state.validationMessages}
        let hasError = false; 
        const repeat = this.context.folders.find(folder => folder.folder_name === fieldValue)

        fieldValue = fieldValue.trim();
        if(fieldValue.length === 0) {
            fieldErrors.name = 'Name is required'
            hasError = true; 
        } else if (fieldValue.length < 3) {
            fieldErrors.name = 'Name must be at least 3 characters long'
            hasError = true; 
        } else if (repeat) {
            fieldErrors.name = `Folder '${repeat.folder_name} already exists`;
            hasError = true; 
        } else {
            fieldErrors.name = '';
            hasError = false; 
        }
        this.setState({
            validationMessages: fieldErrors,
            nameValid: !hasError
        }, this.formValid)
    }

    formValid() {
        this.setState({
            formValie: this.state.nameValid
        })
    }

    updateName(folder_name) {
        this.setState({folder_name}, () => {this.validateName(folder_name)});
    }

    handleAddFolder(event) {
        event.preventDefault();
        const newFolder = {
            folder_name: this.state.folder_name
        }
        fetch(`${config.API_ENDPOINT}/folders`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(newFolder)
        })
        .then(res => {
            if(!res.ok) {
                return res.json()
                .then(error => {
                    throw error
                })
            }
            return res.json()
        })
        .then(data => {
            this.context.AddFolder(data)
        })
        .catch(err => {
            this.context.addError(err);
            console.error(err)
        })
    }

    render() {
        return (
            <section className='addFolder'>
                <h2>Create a folder</h2>
                <form onSubmit={(event) => {this.handleAddFolder(event)}}>
                    <div className='field'>
                        <label htmlFor='folder-name-input'>
                            Name
                        </label>
                        <input 
                        type='text' id='folder-name-input'
                        onChange={event => this.updateName(event.target.value)}
                        />
                    <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name} />
                    </div>
                    <div className='buttons'>
                        <button type='submit' disabled={!this.state.formValid}>
                            Add folder
                        </button>
                    </div>
                </form>
            </section>
        )
    }
}

export default AddFolder; 