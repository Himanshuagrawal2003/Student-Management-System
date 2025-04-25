import Class from '../models/class.model.js';
import { errorHandler } from '../utils/error.js';
import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';

//commented this
// export const createClass = async (req, res, next) => {
//   try {
//     const newClass = await Class.create(req.body);
//     res.status(201).json(newClass);
//   } catch (error) {
//     next(error);
//   }
// };

export const createClass = async (req, res, next) => {
  try {
    const { name, year, teacherName, maxCapacity } = req.body;

    console.log('Received Teacher Name:', teacherName);  // Log the teacher name from the request

    // Case-insensitive search for the teacher
    const teacher = await Teacher.findOne({ name: { $regex: new RegExp(teacherName, 'i') } });

    if (!teacher) {
      return next(errorHandler(404, 'Teacher not found!'));
    }

    // Create the new class with the teacher's ObjectId
    const newClass = await Class.create({
      name,
      year,
      teacher: teacher._id, // Set the teacher as the ObjectId
      maxCapacity
    });

    res.status(201).json(newClass);
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (req, res, next) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) return next(errorHandler(404, 'Class not found!'));

    await Student.updateMany({ class: req.params.id }, { class: null });
    await Class.findByIdAndDelete(req.params.id);

    res.status(200).json('Class has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (req, res, next) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClass) return next(errorHandler(404, 'Class not found!'));

    res.status(200).json(updatedClass);
  } catch (error) {
    next(error);
  }
};

export const getClass = async (req, res, next) => {
  try {
    const classData = await Class.findById(req.params.id).populate('students teacher');
    if (!classData) return next(errorHandler(404, 'Class not found!'));

    res.status(200).json(classData);
  } catch (error) {
    next(error);
  }
};

export const getClassByName = async (req, res, next) => {
  try {
    const classData = await Class.findOne({ name: req.params.name }).populate('students teacher');
    if (!classData) return next(errorHandler(404, 'Class not found'));

    res.status(200).json(classData);
  } catch (error) {
    next(error);
  }
};

export const getClasses = async (req, res, next) => {
  try {
    const classes = await Class.find().populate('students teacher');
    res.status(200).json(classes);
  } catch (error) {
    next(error);
  }
};

export const getIdByName = async (req, res, next) => {
  try {
    const classData = await Class.findOne({ name: req.params.name });
    if (!classData) return next(errorHandler(404, 'Class not found'));

    res.status(200).json({ classId: classData._id });
  } catch (error) {
    next(error);
  }
};

export const getClassesForm = async (req, res, next) => {
  try {
    res.status(200).json({
      name: '',
      year: '',
      maxCapacity: '',
      teacher: '',
      numMaleStudents: '',
      numFemaleStudents: '',
     
    });
  } catch (error) {
    next(error);
  }
};
