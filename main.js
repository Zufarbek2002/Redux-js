const { default: axios } = require("axios")
const redux = require("redux")
const createStore = redux.createStore
const applyMiddleware = redux.applyMiddleware
const thunk = require("redux-thunk").thunk

const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST"
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS"
const FETCH_USERS_ERROR = "FETCH_USERS_ERROR"

function fetchRequest() {
    return {
        type: FETCH_USERS_REQUEST
    }
}
function fetchSuccess(users) {
    return {
        type: FETCH_USERS_SUCCESS,
        payload: users
    }
}
function fetchError(error) {
    return {
        type: FETCH_USERS_ERROR,
        payload: error
    }
}

const fetchUsers = () => {
    return function (dispatch) {
        dispatch(fetchRequest())
        axios.get("http://localhost:3000/todos").then(res => {
            const data = res.data
            dispatch(fetchSuccess(data))
        }).catch(err => {
            dispatch(fetchError(err.message))
        })
    }
}

const initialState = {
    loading: false,
    users: [],
    error: ''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case FETCH_USERS_SUCCESS:
            return {
                loading: false,
                users: action.payload,
                error: ''
            }
        case FETCH_USERS_ERROR:
            return {
                loading: false,
                users: [],
                error: action.payload
            }
        default: return state
    }
}

const store = createStore(reducer, applyMiddleware(thunk))
console.log("initial state", store.getState())
store.subscribe(() => console.log("update state", store.getState()))
store.dispatch(fetchUsers())