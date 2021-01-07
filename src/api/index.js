import axios from 'axios';

const url = 'localhost:3000';

export const fetchMessages = () => axios.get(url);
export const createMessage = (newMessage) => axios.post(url, newMessage);
export const updateMessage = (id, updatedMessage) => axios.patch(`${url}/${id}`, updatedMessage);
export const deleteMessage = (id) => axios.delete(`${url}/${id}`);
