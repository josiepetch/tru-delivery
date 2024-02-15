import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

const CustomNavbar = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    const [showButtons, setShowButtons] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    const handleInsert = () => {
        setShowButtons(!showButtons);        
        navigate('/delivery/insert');
    }

    const handleSearch = async (event : any) => {
        event.preventDefault();
        const searchText = event.target.elements.search.value;
        navigate(`/delivery?query=${searchText}`);
    }

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand><img src="../TRU_logo.png" alt="Toys R Us" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto text-center">
                    <Nav.Link href="/delivery">delivery</Nav.Link>
                </Nav>
                <Nav>
                    {location.pathname === '/delivery' && (
                        <div className='flex filter-wrapper'>
                            <Button variant="btn btn-blue mr1" onClick={handleInsert}>Book A Slot</Button>
                            <Form className="spaceforsearchbar" onSubmit={handleSearch}>
                                <FormControl type="text" name="search" placeholder="Search" className="mr-sm-2" />
                                <Button variant="btn btn-blue" type="submit">Search</Button>
                            </Form>
                        </div>
                    )}
                    <Button variant="btn btn-red" onClick={handleLogout}>Logout</Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default CustomNavbar;
