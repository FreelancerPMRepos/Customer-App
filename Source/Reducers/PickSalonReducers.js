import { ADD_SALON, REMOVE_SALON, } from '../Actions/Types'

const initialState = {
  data: null
}

const PickSalonReducers = (state = initialState, action) => {
    switch (action.type) {
        case ADD_SALON:
            return {
                ...state,
                data: action.payload
            }
            
        case REMOVE_SALON:
            return initialState
           
        default:
            return state;
    }
}

export default PickSalonReducers;