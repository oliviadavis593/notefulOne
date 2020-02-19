import React from 'react';
  
export default React.createContext({
    note: [],
    folders: [],
    addFolder: () => {},
    deleteNote: () => {}
})