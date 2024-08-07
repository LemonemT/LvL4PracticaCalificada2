import { SECRET_KEY } from '../config/config.js'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt' 

export const index = async (req, res) => {
  try {
    const usuarios = await User.all()
    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const find = async (req, res) => {
  try {
    const { id } = req.params
    const usuario = await User.getById(id)

    if (usuario.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json(usuario)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const store = async (req, res) => {
  try {
    const { fName, mName, lName, username, email, password } = req.body
    if (!fName || !username || !email || !password) return res.status(400).json({ message: 'Faltan datos' })

    const nuevoUsuario = await User.create({
      fName,
      username,
      email,
      password,
      mName,
      lName
    })

    if (nuevoUsuario[0].affectedRows === 1) return res.json({ message: 'Usuario guardado' })

    res.status(500).json({ message: 'Error al guardar el usuario' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ message: 'Faltan datos' })

    
    const usuario = await User.where('username', username)
    if (usuario.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' })

    
    const isMatch = await bcrypt.compare(password, usuario[0].password)
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' })

    
    const token = jwt.sign({ usuarioId: usuario[0].user_id }, SECRET_KEY, { expiresIn: '30m' })
    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const verifyToken = (req, res) => {
  try {
    const { authorization } = req.headers
    if (!authorization) return res.status(401).json({ message: 'Token no proporcionado' })

    
    jwt.verify(authorization, SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expirado' })
        }
        return res.status(401).json({ message: 'Token inválido' })
      }
      res.status(200).json({ message: 'Token válido' })
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
