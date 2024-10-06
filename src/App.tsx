import './App.css';
import { Container } from 'react-bootstrap';
import Employees from './screens/employees/Employees.tsx';
import { Provider } from 'react-redux';
import store from './store';

function App() {
    return (
        <Provider store={store}>
            <Container className="mt-5">
                <Employees />
            </Container>
        </Provider>
    );
}

export default App;