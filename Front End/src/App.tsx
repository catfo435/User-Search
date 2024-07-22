import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import EmployeePane, { Employee } from "./components/EmployeePane"
import FuzzySearch from "fuzzy-search"

function App() {

  const[employees,setEmployees] = useState<Array<Employee>>([])
  const[checkedEmployees,setCheckedEmployees] = useState<Array<string>>([])
  const[searchString,setSearchString] = useState("")
  const[checkAll,setCheckAll] = useState(false)

  const handleDelete = async () => {
    fetch(`${import.meta.env.VITE_API_URL}/employees/`, {
      method : "DELETE",
      headers : {
        'Content-Type' : "application/json"
      },
      body : JSON.stringify({employees : checkedEmployees})
    })
      .then(res => {
        if (res.status !== 200) {
          toast.error("Something went wrong. Check logs for more info.")
        }
      })
      .catch(err => {
        toast.error("Something went wrong. Check logs for more info.")
        console.error(err)
      })
      .finally(fetchEmployeeData)
  }

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/employees`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
  
      const employeeMap = new Map(data.map((emp  : Employee) => [emp.employeeId, emp]));
    
      const transformedData = data.map((employee : Employee) => {
        if (employee.reportsTo && employeeMap.has(employee.reportsTo)) {
          return {
            ...employee,
            reportsTo: employeeMap.get(employee.reportsTo)
          };
        }
        return { ...employee };
      });

      console.log(transformedData)
  
      setEmployees(transformedData);
      setEmployeesAll(transformedData);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Check logs for more details");
    }
  }

  useEffect(() => {
    fetchEmployeeData()
  },[])

  const[employeesAll,setEmployeesAll] = useState<Array<Employee>>([])
  const searcher = new FuzzySearch(employeesAll,['name'])

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="relative navBar bg-blue-900 w-screen h-10">
        <div className="absolute mt-2 ml-2">
          <span className="text-white">Etalogue Services Private Limited</span>
        </div>
      </div>
      <div className="content flex flex-col items-center w-screen grow bg-gray-300">
        <div className="relative hidden phone:flex items-end w-screen h-12 mt-6 text-xs">
          <input value={searchString} onChange={(e) => {
            setSearchString(e.target.value)
            if (!e.target.value.length) setEmployees(employeesAll)
            setEmployees(searcher.search(e.target.value))
            setCheckAll(false)
            setCheckedEmployees([])
          }} className="ml-3 rounded-sm mt-2 w-44 h-7 pl-2" placeholder="🔎 Search..."></input>
          <div className="flex absolute bottom-0 right-4">
          {checkedEmployees.length?<div>
            <button className="bg-white w-7 h-7 rounded-xl mr-3 text-lg">✎</button>
            <button onClick={handleDelete} className="bg-white w-7 h-7 rounded-xl mr-3 text-lg">🗑</button>
          </div>:""}
          <button onClick={fetchEmployeeData} className="bg-white w-7 h-7 rounded-xl mr-3 text-lg">⟳</button>
            <button className="bg-white w-32 h-7 rounded-xl">Add Employee</button>
          </div>
        </div>
        <div className="bg-white flex flex-col w-[98%] h-full phone:h-[85%] rounded-md text-gray-600 p-2 mt-2">
          <div className="flex flex-col header w-full">
            <span className="text-lg">Employees</span>
            <div className="grid grid-cols-4 tablet:grid-cols-7 text-xs laptop:text-sm mt-2 font-bold">
              <div className="col-span-2">
                <input type="checkbox" checked={checkAll} onChange={(e) => {setCheckAll(e.target.checked)}} />
                <span className="ml-2">Name</span>
              </div>
              <span className="col-span-2">Department</span>
              <span className="col-span-2">Position</span>
              <span>Reports To</span>
            </div>
          </div>
          <div className="usersList flex flex-col w-full grow overflow-y-scroll">
            {employees.map((employee) => (
              <EmployeePane key={employee._id} employee={employee} checkAll={checkAll} setCheckedEmployees={setCheckedEmployees} />
            ))}
          </div>
        </div>
      </div>
      </div>
  )
}

export default App
