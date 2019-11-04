const express = require('express');
const path = require('path');
const xss = require('xss');
const FoldersService = require('./folders-service.js');

const foldersRouter = express.Router();
const jsonParser = express.json();


const folderFormat = folder => ({
  id: folder.id,
  folder_name: xss(folder.folder_name)
});

foldersRouter
  .route('/')
  .get((req, res, next) => {
    FoldersService.getAllFolders(req.app.get('db'))
      .then(folders => {
        res.json(folders.map(folderFormat))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const {folder_name} = req.body;
    const newFolder = { folder_name };

    if (newFolder == null) {
      return res.status(400).json({ error: { message: `Request body must include folder_name `}});
    }
    FoldersService.addFolder(req.app.get('db'), newFolder)
    .then(folder => {
        res.status(201)
          .location(path.posix.join(req.originalUrl +`/${folder.id}`))
          .json(folderFormat(folder))
      })
      .catch(next)
  })


foldersRouter.route('/:id')
  .all((req, res, next) => {
    const { id } = req.params;
    FoldersService.getFolderById( req.app.get('db'), id )
      .then(folder => {
        if(!folder) { return res.status(404).json({error: {message: 'Folder not found'} }) }
        res.folder = folder;
        next();
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(folderFormat(res.folder[0]))
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    FoldersService.deleteFolder( req.app.get('db'), id )
    .then(() => { res.status(204).end() })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const folderToUpdate = { folder_name };

    if(!folderToUpdate) {
      return res.status(400).json({ error: {message: `Update request must include: folder_name`} })
    }
    FoldersService.updateFolder(req.app.get('db'), req.params.id, folderToUpdate)
      .then((folder) => { res.status(200).json(folderFormat(folder)) })
      .catch(next)
  })


module.exports = foldersRouter;