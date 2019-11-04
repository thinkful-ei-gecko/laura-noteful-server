const FoldersService = {
  getAllFolders(knex) {
    return knex('folders')
      .select('*');
  },
  addFolder(knex, newFolder) {
    return knex('folders')
      .insert(newFolder)
      .returning('*')
      //.then(rows => { return rows[0]});
  },
  getFolderById(knex, id) {
    return knex('folders')
      .select('*')
      .where('id', id);
     // .first();
  },
  deleteFolder(knex, id) {
    return knex('folders')
      .where('id', id)
      .delete();
  },
  updateFolder(knex, id, updatedFolderInfo) {
    return knex('folders')
      .where('id', id)
      .update(updatedFolderInfo)
      .returning('*')
      .then(rows => { return rows[0]});
  }
}


module.exports = FoldersService;