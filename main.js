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
// main data
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

// delete user
const id = 1;
const fetchUsersDelete = () => {
    return function (dispatch) {
        dispatch(fetchRequest())
        axios.delete(`http://localhost:3000/todos/${id}`).then(res => {
            const data = res.data
            dispatch(fetchSuccess(data))
        }).catch(err => {
            dispatch(fetchError(err.message))
        })
    }
}

// add new user
const newUser = {
    "userId": 1,
    "id": '1',
    "title": "delectus aut autem",
    "completed": false
}
const fetchUsersAdd = () => {
    return function (dispatch) {
        dispatch(fetchRequest())
        axios.post(`http://localhost:3000/todos`, newUser).then(res => {
            const data = res.data
            dispatch(fetchSuccess(data))
        }).catch(err => {
            dispatch(fetchError(err.message))
        })
    }
}

// edit user
const editUser = {
    "userId": 1,
    "title": "edit user",
    "completed": true
}
const editUserId = 1
const fetchUsersEdit = () => {
    return function (dispatch) {
        dispatch(fetchRequest())
        axios.put(`http://localhost:3000/todos/${editUserId}`, editUser).then(res => {
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

// Create
store.dispatch(fetchUsersAdd())

// Read
store.dispatch(fetchUsers())

// Update
store.dispatch(fetchUsersEdit())

// Delete
store.dispatch(fetchUsersDelete())