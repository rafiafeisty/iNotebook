
const express=require('express');
const router=express.Router();
var fetchuser = require('../middleware/fetchuser');
const Note=require('../models/Notes');
const { body, validationResult } = require('express-validator');

//ROUTE: 1 get all the notes GET "/api/notes/getuser" login required
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    try {
        const notes=await Note.find({user:req.user.id});
        res.json(notes);
        
    } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    }
})


//ROUTE: 2 Add a new note POST "/api/notes/addnote" login required
router.post('/addnote', fetchuser, [
    // Validation rules
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be of at least 10 characters').isLength({ min: 10 })
], async (req, res) => {
    try {
        // Extract the validation errors from a request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there are validation errors, return a 400 status with the errors
            return res.status(400).json({ errors: errors.array() });
        }

        // Destructuring values from request body
        const { title, description, tag } = req.body;

        // Creating a new note instance
        const note = new Note({
            title, 
            description, 
            tag, 
            user: req.user.id
        });

        // Save the note to the database
        const saveNote = await note.save();

        // Return the saved note as a JSON response
        res.json(saveNote);
    } catch (error) {
        // Handle internal server errors
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//ROUTE: 3 update an existing note PUT "/api/notes/updatenote" login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title; }
        if (description) { newNote.description = description; }
        if (tag) { newNote.tag = tag; }

        // Find the note to be updated
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found");
        }

        // Check if the user is authorized to update this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        // Update the note and return the updated document
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        
        res.json({note});
    } catch (error) {
        console.error(error.message); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//ROUTE: 4 delete an existing note DELETE "/api/notes/deletenote" login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // Find the note to be deleted
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found");
        }

        //Allow deletion if only user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        // Delete the note and return the updated document
        note = await Note.findByIdAndDelete(req.params.id);
        
        res.json({"Success": "Note has been deleted", note:note});
    } catch (error) {
        console.error(error.message); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports=router;