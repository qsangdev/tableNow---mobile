import mongoose from 'mongoose'

const billSchema = new mongoose.Schema ({
    billItems: [{

        name: {type: String, require: true},
    }
        
    ]
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill