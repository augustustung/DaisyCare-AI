import * as actionTypes from "../constants/member"

const handleSignin = (data) => ({
    type: actionTypes.USER_LOGIN,
    data: data
})

const handleSignout = () => ({
    type: actionTypes.USER_RESET
})

export {
    handleSignin,
    handleSignout
}