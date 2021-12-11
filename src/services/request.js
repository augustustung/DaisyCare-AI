import axios from 'axios'
import { HOST } from './../constants/url'
import { message } from 'antd';

import {
  getQueryString,
} from '../helper/common'

function send({
  method = 'get', path, data = null, query = null, headers = {}, newUrl
}) {
  return new Promise((resolve) => {
    let url = HOST + `${path}${getQueryString(query)}`
    if (newUrl) {
      url = `${newUrl}${path}${getQueryString(query)}`
    }
    const dataString = window.localStorage.getItem('data')
    if(dataString){
      const newData =  JSON.parse(dataString)
      headers.authorization =`Bearer ${newData.token}`
    }
    axios({
      method, url, data, headers,
    })
      .then((result) => {
        const data = result.data
        return resolve(data)
      })
      .catch((error) => {
        const {response ={}} = error
        
        const result = response.data ? response.data :null
        
        if (!result) {
          
        }
        else {
          const { statusCode, message: data } = result
          
          if (statusCode === 401) {
            message.warn(data || "Somethig was wrong" )
            setTimeout(()=>{
              window.localStorage.clear()
              window.location.href = '/'
            },1000)
           
          }
          else if (
            (statusCode === 401 && data === 'Unauthorized') || (statusCode === 403 && data === 'InvalidToken')) {
              window.localStorage.clear()
              window.location.href = '/'
            
          }
          else if(statusCode){
            resolve(result.data)
          }
          else {
            return resolve(result.data)
          }
        }
      })
  })
}

export default send
