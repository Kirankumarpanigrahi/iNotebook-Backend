const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Notes = require("../Models/Notes");
const fetchuser = require("../middleware/fetchuser");

//Route 1 :Fetch all notes using: Get "/api/notes/fetchallnotes". Login require
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    //find the user notes by authenticating user id
    const notes = await Notes.find({ user: req.user.id });
    res.send(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error accured" });
  }
});

//Route 2 :adding notes using: POST "/api/notes/addnote". Login require
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //creating a new note object
      const note = new Notes({ title, description, tag, user: req.user.id });
      const savednote = await note.save();
      res.send(savednote);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error accured" });
    }
  }
);

//Route 3 :Updateing notes using: PUT "/api/notes/updatenote/:id". Login require
router.put(
  "/updatenote/:id",
  fetchuser,
  [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //Creating a new note object
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }
      //Finding the note to be updated using note id
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res
          .status(400)
          .json({ error: "Invalid credentials please try with right ones" });
      }
      //Authenticating the user by user id and allow to update
      if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ error: "Not Allowed" });
      }
      //Updating all field in note
      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal server error accured" });
    }
  }
);

//Route 4 :Deleteing notes using: Delete "/api/notes/updatenote/:id". Login require
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //Finding the note to be deleted by note id
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res
        .status(400)
        .json({ error: "Invalid credentials please try with right ones" });
    }
    //Authenticating the user by user id and allow to delete
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not Allowed" });
    }
    //Deleting the note using note id
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ sucess: "Note have been Deleted Sucessfully", note });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error accured" });
  }
});
module.exports = router;
