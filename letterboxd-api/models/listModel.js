import mongoose from "mongoose"

const listModelSchema = mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    creator: {
        type: String
    },
    ranked: {
        type: Boolean
    },
    is_public: {
        type: Boolean
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: {
            type: String
        },
        added_on: {
            type: Date,
            default: Date.now
        }
    }],
    list_items: [{
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'list_items.type'
        },
        type: {
            type: String,
            required: true,
            enum: ['Movie']
        },
        id: {
            type: String,
            required: true
        },
        added_on: {
            type: Date,
            default: Date.now
        }
    }],
    created_at: {
        type: Date,
        default: Date.now 
    }
})

const List = mongoose.model('List', listModelSchema)

export default List