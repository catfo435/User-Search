import {Router, Request, Response } from "express";
import Employee, { IEmployee } from '../models/export';
import mongoose from "mongoose";

const router : Router = Router()

// Create a new employee
router.post('/employees', async (req : Request, res: Response) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read all employees
router.get('/employees', async (req : Request, res: Response) => {
  try {
    const employees = await Employee.find().lean();
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read a single employee by ID
router.get('/employees/:id', async (req : Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id).lean();
    if (!employee) {
      return res.status(404).send();
    }
    res.status(200).send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an employee by ID
router.patch('/employees/:id', async (req: Request, res: Response): Promise<void> => {
  const updates: string[] = Object.keys(req.body);
  const allowedUpdates: string[] = ['name', 'age', 'department', 'position', 'email', 'phone', 'employeeId', 'reportsTo'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(400).send({ error: 'Invalid updates!' });
    return;
  }

  try {
    const updateFields: { [key: string]: any } = {};
    updates.forEach((update) => {
      updateFields[update] = req.body[update];
    });

    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean()
    if (!employee) {
      res.status(404).send();
      return;
    }

    res.status(200).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an employee by ID
router.delete('/employees/', async (req : Request, res: Response) => {
  let successfulDeletions : Array<any> = [] , errorDeletions : Array<Object> = [] , notFound : Array<String> = []
  req.body.employees.map(async (id : String) => {
    try {
    const employee = await Employee.findByIdAndDelete(id).lean()
    if (!employee) {
      notFound.push(id)
    }
    else successfulDeletions.push(employee)
  } catch (error) {
    errorDeletions.push({error, id})
  }})

  let statusCode = (errorDeletions.length)?500:(notFound.length)?404:200
  res.status(statusCode).send({successfulDeletions, notFound, errorDeletions})

});

export default router
