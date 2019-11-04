const NotesService = {
  getAllNotes(knex) {
    return knex('notes')
      .select('*');
  },
  addNote(knex, newNote) {
    return knex('notes')
      .insert(newNote)
      .returning('*')
      .then(rows => { return rows[0]});
  },
  getNoteById(knex, id) {
    return knex('notes')
      .select('*')
      .where('id', id);
     // .first();
  },
  deleteNote(knex, id) {
    return knex('notes')
      .where('id', id)
      .delete();
  },
  updateNote(knex, id, updatedNoteInfo) {
    return knex('notes')
      .where('id', id)
      .update(updatedNoteInfo)
      .returning('*')
      .then(rows => { return rows[0]});
  }
}


module.exports = NotesService;