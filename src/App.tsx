import './App.css'
import {Container} from "react-bootstrap";
import Employees from "./screens/employees/Employees.tsx";

function App() {
    return (
        <Container className="mt-5">
            <Employees/>
        </Container>
    )
}

export default App
