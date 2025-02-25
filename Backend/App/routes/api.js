const express = require('express');
const router = express.Router();
const playerActions = require('../controllers/api/playerController');

// pobieranie graczy
router.get('/players', playerActions.getAllPlayers)
// pobieranie gracza(konkretnego)
// router.get('/players/:id', playerActions.getPlayer)
// //zapisywanie gracza
// router.post('/players', playerActions.savePlayer)
// //edytowanie gracza
// router.put('/players/:id', playerActions.updatePlayer)
// //usuwanie gracza
// router.delete('/players/:id', playerActions.deletePlayer)


module.exports = router;