import { useEffect, useState } from "react";

export type Employee = {
    _id: string;
    name: string;
    age: number;
    department: string;
    position: string;
    email: string;
    phone: string;
    employeeId: number;
    reportsTo: Employee | number;
  };

type EmployeePaneProps = {
    employee : Employee
    checkAll : boolean
    setCheckedEmployees : Function
}

const EmployeePane = ({employee , checkAll, setCheckedEmployees} : EmployeePaneProps) => {

    const [check,setCheck] = useState(false)

    const updateCheckedEmployees = (checked : Boolean) => {
      if (checked) setCheckedEmployees((checkedEmployees : Array<string>) => [...checkedEmployees,employee._id])
      else setCheckedEmployees((checkedEmployees : Array<string>) => (checkedEmployees.filter(id => id !== employee._id)))
    }

    useEffect(() => {
      setCheck(checkAll)
      updateCheckedEmployees(checkAll)
    },[checkAll])

    return (
        <div id={employee._id} className="employeePane grid grid-cols-4 tablet:grid-cols-7 text-xs laptop:text-sm mt-2 h-8">
              <div className="tablet:col-span-2">
                <input type="checkbox" checked={check} onChange={(e) => {
                  setCheck(e.target.checked)
                  updateCheckedEmployees(e.target.checked)
                }} />
                <span className="ml-2">{employee.name}</span>
              </div>
              <span className="tablet:col-span-2">{employee.department}</span>
              <span className="tablet:col-span-2">{employee.position}</span>
              <span><button className="hover:underline">{employee.reportsTo?(employee.reportsTo as Employee).name:"None"}</button></span>
        </div>
    );
}

export default EmployeePane;