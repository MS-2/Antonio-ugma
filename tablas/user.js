const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
// Create a schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: { 
    type: String,
    required: true
  },
  nombre: { 
    type: String,
    required: true
  },
});

userSchema.pre('save', async function(next){
	
	try 
	{
		//pass over is not local method
	    console.log('entered');

		//generate a salt
		const salt = await bcrypt.genSalt(10);
		//generate a password hash
		const passwordHash = await bcrypt.hash(this.password, salt);
		//re-assing hash version over original
		this.password = passwordHash;
		next();
		console.log('salt', salt);
		console.log('pass', this.password);
		console.log('pass hash', passwordHash);
	}catch(error)

	{
		next(error);
	}
});

userSchema.methods.isValidPassword = async function(newPassword) {
  try 
  {
    return await bcrypt.compare(newPassword, this.password);
  } catch(error) 

  {
    throw new Error(error);
  }
}

// Create a model
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;