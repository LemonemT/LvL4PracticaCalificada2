export const middlewarePrueba = (req, res, next) => {
  console.log('Se ejecutó el middlewarePrueba')
  next()
}
