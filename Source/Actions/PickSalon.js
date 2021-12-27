import { ADD_SALON, REMOVE_SALON } from '../Actions/Types'

export const addSalon = (user) => ({
    type: ADD_SALON,
    payload: user
})

export const deleteSalon = (user) => ({
    type: REMOVE_SALON,
    payload: user
})