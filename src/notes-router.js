const express = require('express');
const path = require('path');
const xss = require('xss');
const NotesService = require('./notes-service.js');

const notesRouter = express.Router();
const jsonParser = express.json();


const noteFormat = note => ({
  id: note.id,
  folder_id: note.folder_id,
  note_title: xss(note.note_title),
  note_content: xss(note.note_content),
  modified: note.date_modified
});

notesRouter
  .route('/')
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get('db'))
      .then(notes => {
        res.json(notes.map(noteFormat))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { folder_id,  note_title, note_content } = req.body;
    const newNote = { folder_id,  note_title, note_content };
    const requiredFields = { folder_id,  note_title };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (value == null) {
        return res.status(400).json({ error: { message: `Request body must include '${key}' `}});
      }
    }
    NotesService.addNote(req.app.get('db'), newNote)
      .then(note => {
        res.status(201)
          .location(path.posix.join(req.originalUrl +`/${note.id}`))
          .json(noteFormat(note))
      })
      .catch(next)
  })


notesRouter.route('/:id')
  .all((req, res, next) => {
    const { id } = req.params;
    NotesService.getNoteById( req.app.get('db'), id )
      .then(note => {
        if(!note) { return res.status(404).json({error: {message: 'Note not found'} }) }
        res.note = note;
        next();
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(noteFormat(res.note[0]))
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    NotesService.deleteNote( req.app.get('db'), id )
    .then(() => { res.status(204).end() })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { folder_id, note_title, note_content } = req.body;
    const noteToUpdate = { folder_id, note_title, note_content };
    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;

    if(numberOfValues == 0) {
      return res.status(400).json({ error: {message: `Update request must include: folder_id and note_title`} })
    }
    NotesService.updateNote(req.app.get('db'), req.params.id, noteToUpdate)
      .then((note) => { res.status(200).json(noteFormat(note)) })
      .catch(next)
  })


module.exports = notesRouter;