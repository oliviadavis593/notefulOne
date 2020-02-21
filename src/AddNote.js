import React, { Component } from 'react';
import NoteContext from './NoteContext';
import config from './config'
import ValidationError from './ValidationError';

class AddNote extends Component {
    state = {
        currentFolder: {folder_name: 'Select a folder', id: ''},
        currentFolderNotes: [],
        selectedFolder: {folder_name: 'Select a folder', id: ''},
        folderOptions: [],
        note_name: '',
        nameValid: false,
        content: '',
        contentValid: false, 
        folder_id: '',
        folderIdValid: false,
        validationMessages: {
            name: '',
            content: '',
            folderId: '',
        },
        formValid: false
    }

    static contextType = NoteContext; 

    componentWillMount() {
        const currentFolder = this.context.folders.find(folder => `/addNote/folder/${folder.id}` !== currentFolder.id)
        if(currentFolder) {
            const otherFolders = this.context.folders.filter(folder => folder.id !== currentFolder.id)
            this.setState({
                currentFolder,
                folder_id: currentFolder.id, 
                folderOptions: otherFolders, 
                selectedFolder: currentFolder, 
                folderIdValid: true
            });
        } else {
            this.setState({folderOptions: this.context.folders})
        }
    }

    validateName(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;
    
         const folderNotes = this.context.notes.filter(note => note.folder_id === this.state.folder_id);
    
         const repeat = folderNotes.find(note => note.note_name === fieldValue)
    
        fieldValue = fieldValue.trim();
        if(fieldValue.length === 0) {
          fieldErrors.name = 'Name is required';
          hasError = true;
        } else if (fieldValue.length < 3) {
          fieldErrors.name = 'Name must be at least 3 characters long';
          hasError = true;
        } else if (repeat) {
          fieldErrors.name = `Note '${fieldValue}' already exists in Folder '${this.state.selectedFolder.folder_name}'`;
          hasError = true;
        } else {
          fieldErrors.name = '';
          hasError = false;
        }
        this.setState({
          validationMessages: fieldErrors,
          nameValid: !hasError
        }, this.formValid );
      }

    validateFolderId(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;
    
        if(fieldValue.length === 0) {
          fieldErrors.folderId = 'Must select a folder';
          hasError = true;
        } else {
          fieldErrors.folderId = '';
          hasError = false;
        }
        this.setState({
          validationMessages: fieldErrors,
          folderIdValid: !hasError
        }, this.formValid );
    
      }

      validateContent(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;
    
        if(fieldValue.length === 0) {
          fieldErrors.content = 'Content is required';
          hasError = true;
        } else {
          fieldErrors.content = '';
          hasError = false;
        }
        this.setState({
          validationMessages: fieldErrors,
          contentValid: !hasError
        }, this.formValid );
      }

      formValid() {
          this.setState({
              formValid: this.state.nameValid && this.state.folderIdValid && this.state.contentValid
          })
      }

      updateName(note_name) {
          this.setState({note_name}, () => {this.validateName(note_name)});
      }

      updateFolderId(folder_id) {
          const selectedFolder = this.context.folders.find(folder => folder.id === folder_id);
          this.setState({folder_id, selectedFolder}, () => {this.validateFolderId(folder_id)});
      }

      updateContent(content) {
          this.setState({content}, () => {this.validateContent(content)});
      }

      handleSubmit(event) {
        event.preventDefault();
        this.validateFolderId(this.state.folder_id);
        this.validateContent(this.state.content);
        this.validateName(this.state.note_name);
        if(this.state.formValid) {
          this.handleAddNote();
          this.props.history.push('/');
        }
      }
    
      handleAddNote() {
          const newNote =  {
              note_name: this.state.note_name,
              folder_id: this.state.folder_id,
              content: this.state.content,
          }
          fetch(`${config.API_ENDPOINT}/notes`, {
              method: 'POST',
              header: new Headers({
                  'Content-Type': 'application/json'
              }),
              body: JSON.stringify(newNote)
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
              this.context.addNote(data)
          })
          .catch(err => {
              this.context.addError(err);
              console.error(err)
          })
      }
    

    render() {
        return(
            <section className='addNote'>
                <h2>Create a note</h2>
                <form onSubmit={(event) => {this.handleAddFolder(event)}}>
                    <div className='field'>
                        <label htmlFor='note-name-input'>
                            Name
                        </label>
                        <input 
                        type='text' id='folder-name-input'
                        onChange={event => this.updateName(event.target.value)}
                        />
                    <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name} />
                    </div>
                    <div className='field'>
                        <label htmlFor='note-content-input'>
                            Content
                        </label>
                        <textarea 
                        id='note-content-input'
                        onChange={event => this.updateContent(event.target.value)}
                        />
                        <ValidationError hasError={!this.state.contentValid} message={this.state.validationMessages.content} />
                    </div>
                    <div className='field'>
                        <label htmlFor='note-folder-select'>
                            Folder
                        </label>
                        <select id='note-folder-select' onChange={event => this.updateFolderId(event.target.value)}>
                            <option value={this.state.currentFolder.id}>
                                {this.state.currentFolder.folder_name}
                            </option>
                            {this.state.folderOptions.map(folder => 
                                <option key={folder.id} value={folder.id}>
                                    {folder.folder_name}
                                </option>    
                            )}
                        </select>
                        <ValidationError hasError={!this.state.folderIdValid} message={this.state.validationMessages.folderId} />
                    </div>
                    <div className='buttons'>
                        <button type='submit' disabled={!this.state.formValid}>
                            Add note
                        </button>
                    </div>
                </form>
            </section>
        )
    }
}

export default AddNote; 