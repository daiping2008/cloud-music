export const hasClass = (el, className) => {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export const addClass = (el, className) => {
  if (hasClass(el, className)) return

  const classList = el.className.split(' ')
  classList.push(className)
  el.className = classList.join(' ')
}

export const getData = (el, name, val) => {
  const attr = `data-${name}`
  if (val) {
    return el.setAttribute(attr, val)
  } else {
    return el.getAttribute(attr)
  }
}
