import React, {useContext, useState} from 'react'
import noteContext from '../context/notes/NoteContext';

const AddNote = (props) => {
    
  const context=useContext(noteContext);
  const {addNote}=context;
  const[note, setNote]= useState({title:"", description:"", tag:""})

  const handleClick=(e)=>{
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({title:"", description:"", tag:""})
    props.showAlert("Note added successfully", "success")
  }
  const onChange=(e)=>{
    setNote({...note, [e.target.name]: e.target.value})

  }
  return (
    <div className="container my-4">
      <h1>Add a Note</h1>
      <form>
  <div className="form-group">
    <label htmlFor="title">title</label>
    <input type="text" className="form-control" id="title" name="title" value={note.title} aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
  </div>
  <div className="form-group">
    <label htmlFor="description">Description</label>
    <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required/>
  </div>
  <div className="form-group">
    <label htmlFor="tag">Tag</label>
    <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} minLength={5} required/>
  </div>
  <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-success" onClick={handleClick}>Add Note</button>
</form>
      </div>
  )
}

export default AddNote
