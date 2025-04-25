import mongoose from "mongoose";
import config from 'nodemon/lib/config/index.js';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  year: {
    type: Number,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  currentCapacity: {
    type: Number, 
    default: 0 
  },
  maxCapacity: {
    type: Number,
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  numMaleStudents: {
    type: Number,
    default: 0
  },
  numFemaleStudents: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Middleware to update numMaleStudents and numFemaleStudents fields
classSchema.pre('save', async function(next) {
  try {
    // Count the number of male and female students in this class
    const numMaleStudents = await this.model('Student').countDocuments({ class: this._id, gender: 'Male' });
    const numFemaleStudents = await this.model('Student').countDocuments({ class: this._id, gender: 'Female' });

    // Update the class schema with these counts
    this.numMaleStudents = numMaleStudents;
    this.numFemaleStudents = numFemaleStudents;

    next();
  } catch (error) {
    next(error);
  }
});

const Class = mongoose.model('Class', classSchema);
export default Class;
