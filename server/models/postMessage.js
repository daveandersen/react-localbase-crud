import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    message: String,
});

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;
