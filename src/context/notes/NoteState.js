import React, { useState } from "react";
import noteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];

  const [notes, setNotes] = useState(notesInitial);
  const authToken=localStorage.getItem('token');

  // Get All Notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
      });
  
      if (response.status === 401) {
        // Handle unauthorized access (redirect to login, for example)
        console.error("Unauthorized access");
        return;
      }
  
      const json = await response.json();
      setNotes(json);
    } catch (error) {
      console.error("An error occurred while fetching notes:", error);
    }
  };
  




      // Add a note
      const addNote=async(title, description, tag)=>{
        //API Call
        const response=await fetch(`${host}/api/notes/addnote`, {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'auth-token':authToken
          },
          body:JSON.stringify({title, description, tag})
        })
        const note=await response.json();
        setNotes(notes.concat(note))
        console.log(note);
       
      }

      // Delete a Note
      const deleteNote=async(id)=>{
        //API Call
        
        const response=await fetch(`${host}/api/notes/deletenote/${id}`, {
          method:'DELETE',
          headers:{
            'Content-Type':'application/json',
            'auth-token':authToken
          }
        })
        const json=await response.json();
        console.log(json);

        // logic of the client

        const newNote=notes.filter((note)=>{return note._id!==id})
        setNotes(newNote)
      }

      // Edit a note
      const editNote=async(id, title, description, tag)=>{
        //API Call
        const response=await fetch(`${host}/api/notes/updatenote/${id}`, {
          method:'PUT',
          headers:{
            'Content-Type':'application/json',
            'auth-token':authToken
          },
          body:JSON.stringify({title, description, tag})
        })
        const json=await response.json();
        console.log(json);

        let newNote=JSON.parse(JSON.stringify(notes));

        //logic to edit in client
        for(let index=0; index<newNote.length; index++){
          const element=newNote[index];
          if(element._id===id){
            newNote[index].title=title;
            newNote[index].description=description;
            newNote[index].tag=tag;
            break;
          }
        }
        setNotes(newNote);
      }

    return(
        <noteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;