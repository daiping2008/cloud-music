export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const shuffle = arr => {
  const _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    const j = getRandomInt(0, i)
    const t = _arr[j]
    _arr[j] = _arr[i]
    _arr[i] = t
  }
  return _arr
}
