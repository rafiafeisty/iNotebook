import React, { useContext, useRef, useState, useEffect } from 'react';
import noteContext from '../context/notes/NoteContext';
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import {useNavigate} from 'react-router-dom';


const Notes = (props) => {
  const context = useContext(noteContext);
  let navigate=useNavigate();
  const { notes, getNotes, editNote } = context;
  
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
      getNotes();
    }
    // eslint-disable-next-line
  }, []);
  

  const [note, setNote] = useState({id:"", etitle: '', edescription: '', etag: '' });
  const ref = useRef(null);
  const refClose=useRef(null);

  const handleClick = (e) => {
    console.log("The new note is: ",note)
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click();
    props.showAlert("Updated successfully", "success")
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  // Update note function
  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({id:currentNote._id,etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag});
  };

  return (
    <>
      <AddNote showAlert={props.showAlert}/>

      {/* <!-- Button trigger modal --> */}
      <button
        type="button"
        className="btn btn-primary d-none"
        data-toggle="modal"
        data-target="#exampleModal"
        ref={ref}
      >
        Launch demo modal
      </button>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit a Note
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="container my-4">
                <form>
                  <div className="form-group">
                    <label htmlFor="etitle">Title</label>
                    <input
                      type="text" value={note.etitle}
                      className="form-control"
                      id="etitle"
                      name="etitle"
                      onChange={onChange} minLength={5} required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edescription">Description</label>
                    <input
                      type="text" value={note.edescription}
                      className="form-control"
                      id="edescription"
                      name="edescription"
                      onChange={onChange} minLength={5} required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="etag">Tag</label>
                    <input
                      type="text" value={note.etag}
                      className="form-control"
                      id="etag"
                      name="etag"
                      onChange={onChange}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal" ref={refClose}
              >
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleClick} disabled={note.etitle.length<5 || note.edescription.length<5}>
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-5">
        <h1>Your Notes</h1>
        <div className="container">
          {Array.isArray(notes) && notes.length === 0 && 'No notes to display please enter the notes'}
        </div>
        {Array.isArray(notes) && notes.map((note) => {
  return (
    <Noteitem note={note} key={note._id} updateNote={updateNote} showAlert={props.showAlert}/>
  );
})}
      </div>
    </>
  );
};

export default Notes;
