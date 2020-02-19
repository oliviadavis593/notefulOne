import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoteListNav from "./NoteListNav/NoteListNav";
import NotePageNav from "./NotePageNav/NotePageNav";
import NoteListMain from "./NoteListMain/NoteListMain";
import NotePageMain from "./NotePageMain/NotePageMain";
import NoteContext from './NoteContext';
import config from './config';
import "./App.css";

class App extends Component {
  state = {
    notes: [],
    folders: []
  };

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/notes`),
      fetch(`${config.API_ENDPOINT}/folders`)
    ])
    .then(([notesRes, foldersRes]) => {
      if(!notesRes.ok)
        return notesRes.json().then(e => Promise.reject(e));
      if(!foldersRes.ok)
        return foldersRes.json().then(e => Promise.reject(e))

        return Promise.all([notesRes.json(), foldersRes.json()]);
    })
    .then(([notes, folders]) => {
      this.setState({notes, folders});
    })
    .catch(error => {
      console.error(error)
    })
  }

  handleDeleteNote = noteId => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    });
  };

  renderNavRoutes() {
    //const { notes, folders } = this.state;
    return (
      <>
        {["/", "/folder/:folderId"].map(path => (
          <Route
            exact
            key={ path}
            path={path}
            component={NoteListNav}
          />
        ))}
        <Route
          path="/note/:noteId"
          component={NotePageNav}
        />
        <Route path="/add-folder" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
      </>
    );
  }

  renderMainRoutes() {
    //const { notes, folders } = this.state;
    return (
      <>
        {["/", "/folder/:folderId"].map(path => (
          <Route
            exact
            key={path}
            path={path}
            component={NoteListMain}
          />
        ))}
        <Route
          path="/note/:noteId"
          component={NotePageMain}
        />
      </>
    );
  }

  render() {
    const value = {
      notes: this.state.notes, 
      folders: this.state.folders, 
      deleteNote: this.handleDeleteNote
    }
    return (
      <NoteContext.Provider value={value}>
      <div className="App">
        <nav className="App__nav">{this.renderNavRoutes()}</nav>
        <header className="App__header">
          <h1>
            <Link to="/">Noteful</Link> <FontAwesomeIcon icon="check-double" />
          </h1>
        </header>
        <main className="App__main">{this.renderMainRoutes()}</main>
      </div>
      </NoteContext.Provider>
    );
  }
}

export default App;

//Assignment Objective:
//We'll start off with building the static part of the application
//We'll also start with the small components that get nested onto the main and nav pages
//...ex: buttons, single notes etc.
//Next we'll add the links (NavLinks) & import BrowserRouter into index.js

/* ======= Building the static app (#1) ======= */
//Created the name of application along with the styling aspects
//Initialized state
//App.js ===> CircleButton.js
