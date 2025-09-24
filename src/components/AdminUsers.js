import { useState } from "react";
import { Container, Row, Col, Card, InputGroup, Button, Form, Modal } from 'react-bootstrap';
import UserTable from "./UserTable";
import UserForm from "../UserForm/UserForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminUsers.css';

const initialUsers = [
    {id: 1, usuario: 'Usuario 1', email: 'admin@gmail.com'},
    {id: 2, usuario: 'Usuario 2', email: 'user2@gmail.com'},
    {id: 3, usuario: 'Usuario 3', email: 'user3@gmail.com'},
    {id: 4, usuario: 'Usuario 4', email: 'prueba1@gmail.com'},
    {id: 5, usuario: 'Usuario 5', email: 'prueba2@gmail.com'},
    {id: 6, usuario: 'Usuario 6', email: 'admin6@gmail.com'},
];

const AdminUsers = () => {
    const [users, setUsers] = useState(initialUsers);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const handleEdit = (userId) => {
        const userToEdit = users.find(user => user.id === userId);
        setCurrentUser(userToEdit);
        setShowModal(true);
    };

    const handleDelete = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
        console.log(`Eliminar usuario con ID: ${userId}`);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentUser(null);
    };

    return(
        <div className="admin-container">
            <Container fluid>
                <header className="admin-header">
                    <h1 className="admin-title">Administrador de Usuarios</h1>
                    <Row className="header-actions">
                        <Col xs={12} md={7} lg={8} className="d-flex mb-3 mb-md-0">
                            <InputGroup className="search-bar flex-grow-1">
                                <Form.Control
                                    type="search"
                                    placeholder="Buscar usuario..."
                                    aria-label="Buscar"
                                    className="search-input w-1"
                                />
                                <Button variant="secondary" className="search-button">Buscar</Button>
                            </InputGroup>
                        </Col>
                        <Col xs={12} md={5} lg={4}>
                            <Button className="add-button w-10 " onClick={() => setShowModal(true)}>Añadir Usuario</Button>
                        </Col>
                    </Row>
                </header>
                <main className="admin-content">
                    <Card className="user-table-card">
                        <Card.Body>
                            <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete}/>
                        </Card.Body>
                    </Card>
                </main>
            </Container>

            {/* Modal para el formulario de usuario */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-purple text-white">
                    <Modal.Title>{currentUser ? 'Editar Usuario' : 'Añadir Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <UserForm user={currentUser} onClose={handleCloseModal}/>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminUsers;
