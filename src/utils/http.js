import axios from 'axios'

export const request = ({ url, data = {}, method = 'GET' }) => {
  return new Promise((resolve, reject) => {
    return axios({
      url,
      data,
      method
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
