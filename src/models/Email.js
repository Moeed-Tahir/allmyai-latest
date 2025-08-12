import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if model already exists to prevent re-compilation error
const Email = mongoose.models.Email || mongoose.model('Email', EmailSchema);

export default Email;
