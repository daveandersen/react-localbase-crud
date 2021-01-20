import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    id: Number,
    username: String,
    password: String,
    carID: String,
});

const Users = mongoose.model('Users', userSchema);

export default Users;
