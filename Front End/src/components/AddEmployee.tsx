import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { FormEvent, useState } from "react";
import { Employee } from "./EmployeePane";

type Props = {
  openModal : boolean
  setOpenModal : Function
  employees : Array<Employee>
  onAddEmployee: Function
}

const departments = ["Engineering", "Marketing", "HR", "Sales", "Finance", "Customer Service", "Design", "IT", "Product"];

export function AddEmployeeModal({openModal, setOpenModal,employees, onAddEmployee} : Props) {

  const [loading,setLoading] = useState(false)

  const handleFormSubmit = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    let employeeData : Partial<Employee> = {}

    const employeeMap = new Map(employees.map((emp  : Employee) => [emp.name, emp.employeeId]));

    formData.forEach((value, key) => {
        if (key == 'reportsTo'){
            employeeData[key as keyof Employee] = employeeMap.get(value as string) as any
        }
        else employeeData[key as keyof Employee] = value as any;
    })

    fetch(`${import.meta.env.VITE_API_URL}/employees/`,{
        method : 'POST',
        headers :{
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(employeeData)
    })

    onAddEmployee()
    setLoading(false)
    setOpenModal(false)
  }

  return (
    <>
      <Modal show={openModal} size="xl" onClose={() => setOpenModal(false)}>
        <Modal.Header>Add Employee</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleFormSubmit} className="flex flex-col">
            <div className="flex">
                <div className="flex w-1/2 flex-col mr-5">
                    <Label htmlFor="empName">Name</Label>
                    <TextInput color="blue" className="mt-2" id="empName" name="empName" required />
                </div>
                <div className="flex w-1/2 flex-col">
                    <Label htmlFor="deptName">Name</Label>
                    <Select color="blue" className="mt-2" id="deptName" name="deptName" required>
                        <option disabled hidden selected={true}>Select Your Department</option>
                        {departments.map((department,id) => (<option key={id}>{department}</option>))}
                    </Select>
                </div>
            </div>
            <div className="flex mt-4">
                <div className="flex w-1/2 flex-col mr-5">
                    <Label htmlFor="position">Position</Label>
                    <TextInput color="blue" className="mt-2" id="position" name="position" required />
                </div>
                <div className="flex w-1/2 flex-col">
                    <Label htmlFor="reportsTo">Reports to</Label>
                    <Select color="blue" className="mt-2" id="reportsTo" name="reportsTo" required>
                        <option disabled hidden selected={true}>Select Your Manager</option>
                        {employees.map((employee,id) => (<option key={id}>{employee.name}</option>))}
                    </Select>
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <div className="mr-2"><Button type="reset" isProcessing={loading} color="blue">Reset</Button></div>
                <div className="ml-2"><Button type="submit" isProcessing={loading} color="blue">Add</Button></div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}