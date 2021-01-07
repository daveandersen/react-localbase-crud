import * as api from '../api/index.js';
import {FETCH_ALL, CREATE, UPDATE, DELETE, LIKE} from '../constants/actionTypes'

export const getMessages = () => async (dispatch) => {

    try{
        const { data } = await api.fetchMessages();

        dispatch({type: FETCH_ALL, payload: data});
    } catch (error) {
        console.log(error);
    }
    
}

export const createMessage = (message) => async (dispatch) => {
    try{
        const { data } = await api.createMessage(message);

        dispatch({type: CREATE, payload: data});
    } catch (error) {
        console.log(error);
    }
}

export const updateMessage = (id, message) => async (dispatch) => {
    try{
        const {data} = await api.updatePost(id,message);

        dispatch({type: UPDATE, payload: data});
    } catch (error) {
        console.log(error);
    }
}

export const deleteMessage = (id) => async (dispatch) => {
    try{
        await api.deleteMessage(id);

        dispatch({type: DELETE, payload: id});
    } catch (error) {
        console.log(error);
    }
}
