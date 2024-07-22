import mongoose from "mongoose";

export interface IEmployee extends Document {
  _id: string
  name: string
  age: number
  department: string
  position: string
  email: string
  phone?: string
  employeeId: number
  reportsTo: number
}

const employeeSchema = new mongoose.Schema({
  _id : {
    type : String
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false
  },
  employeeId: {
    type: Number,
    required: true
  },
  reportsTo: {
    type: Number,
    required: true
  }
});

export default mongoose.model('employees', employeeSchema);
