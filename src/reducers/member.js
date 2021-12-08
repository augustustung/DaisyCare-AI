
import { USER_LOGIN, USER_DETAILS_UPDATE, USER_RESET } from '../constants/member'
let initialState = {
  isUserLoggedIn: !!window.localStorage.getItem('isUserLoggedIn'),
}
const data = window.localStorage.getItem('data')
if(data && data.length){
 const newData = JSON.parse(data)
 initialState={
   ...initialState,
   ...newData
 }
}
export default function userReducer(state = initialState, action) {

  switch (action.type) {
    case USER_LOGIN: {
      if (action.data) {
        window.localStorage.setItem('isUserLoggedIn', true)
        window.localStorage.setItem('data', JSON.stringify(action.data))
        return {
          ...state,
          ...action.data,
          isUserLoggedIn: true
        }
      }
      return {}
    }
    case USER_DETAILS_UPDATE: {
      if (action.data) {
        const data = {
          ...action.data,        
        }

        if (action.data.token) {
          window.localStorage.setItem('token', action.data.token)
          data.token = action.data.token
        }
       
        window.localStorage.setItem('data', JSON.stringify(action.data))
        return {
          ...state,
          ...data,
          isUserLoggedIn: true
        }
      }
      return {}
    }
    case USER_RESET: {
      window.localStorage.removeItem('data');
      window.localStorage.removeItem('isUserLoggedIn');
      window.location.href = "/login"
      return {}
    }
    default:
      return state
  }
}

