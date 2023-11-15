const express = require('express');

const auth = require('../../middleware/auth')
const { createNote, updateNote, deleteNote, getNotes, uploadImage } = require('../../controllers/noteController');

const noteRoutes = express.Router();

//routes will call when you have the authenticate user token.

noteRoutes.get('/',auth,getNotes) // auth write because before calling this route we need to authenticate the user.
noteRoutes.post('/',auth,createNote)
noteRoutes.delete('/:id',auth,deleteNote)
noteRoutes.post('/upload',auth, uploadImage)

noteRoutes.put('/:id', auth,updateNote)// for update


module.exports = noteRoutes
