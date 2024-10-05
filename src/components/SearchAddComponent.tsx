import React from 'react';
import {FormControl, Button, Container} from 'react-bootstrap';
import {FaPlus} from 'react-icons/fa';

interface SearchAddComponentProps {
    fullNameSearch: string;
    setFullNameSearch: (value: string) => void;
    handleAddClick: () => void;
}

const SearchAddComponent: React.FC<SearchAddComponentProps> = ({fullNameSearch, setFullNameSearch, handleAddClick}) => {
    return (
        <Container className="d-flex justify-content-between">
            <h1>Employee list</h1>
            <div className="d-flex align-items-center gap-2">
                <FormControl
                    type="text"
                    placeholder="Search by full name"
                    value={fullNameSearch}
                    onChange={(e) => setFullNameSearch(e.target.value)}
                />
                <Button variant="primary" onClick={handleAddClick} className="d-flex align-items-center">
                    <FaPlus className="me-1"/><span className="text-nowrap">Add Employee</span>
                </Button>
            </div>
        </Container>
    );
};

export default SearchAddComponent;
