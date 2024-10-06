import './App.css'
import EmployeeList from "./screens/employees/components/EmployeeList.tsx";
import {Container} from "react-bootstrap";

function App() {
    return (
        <Container className="mt-5">
            <EmployeeList itemsPerPage={5}/>
        </Container>
    )
}

export default App
