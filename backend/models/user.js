const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        username : { 
            type: String,
            required: true,
        },
        email:{
            type: String, 
            unique: true,
            required: true, 
        },
        password:{
            type : String ,
            required: true,
        },
        profilePic:{
            type : String,
            default : 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'
        },
    },
    {
        timestamps: true,
    }
)

//compare the password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
//encrypt the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})



const user =mongoose.models.User || mongoose.model('User', userSchema);
module.exports = user;