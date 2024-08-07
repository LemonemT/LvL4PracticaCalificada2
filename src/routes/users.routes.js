import { Router } from 'express'
import { crearToken, find, index, store, verificarToken, login, verifyToken } from '../controllers/user.controller.js'

const router = Router()

router.get('/', index)
router.post('/', store)
router.post('/crear-token', crearToken)
router.post('/login', login) 
router.get('/verificar-token', verificarToken) 
router.get('/verify', verifyToken)
router.get('/:id', find)

export default router
