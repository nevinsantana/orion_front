import { useEffect, useState } from "react";
import { Container, Row, Col, Card, InputGroup, Button, Form, Modal } from 'react-bootstrap';
import UserTable from "./UserTable";
import UserForm from "../UserForm/UserForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminUsers.css';
import Swal from 'sweetalert2'; 
import axios from "axios";

// Definimos la URL base para las peticiones
const BASE_API_URL = "http://localhost:7777/api"; 
const API_ENDPOINT_USERS = `${BASE_API_URL}/users`;

// Función de utilidad para obtener los encabezados de autorización
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {}; // Devuelve un objeto vacío si no hay token
};


const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [userToRestore, setUserToRestore] = useState(null);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [emailForPasswordReset, setEmailForPasswordReset] = useState('');

    const handleEdit = (userId) => {
        // Busca el usuario por ID
        const userToEdit = users.find(user => user.id === userId);
        setCurrentUser(userToEdit);
        setShowModal(true);

        
    };
    
    // ********************************************************************
    // FUNCIÓN DE LECTURA (READ)
    // ********************************************************************
    const getUsers = async () => {
        try {
            const res = await axios.get(API_ENDPOINT_USERS, {
                headers: getAuthHeaders(), // Incluye el token si existe
            });
            
            if (res.data.code === 1 && Array.isArray(res.data.users)) {
                // Mapeamos los campos del backend (first_name, last_name)
                const formattedUsers = res.data.users.map(u => ({
                    ...u,
                    nombre: u.first_name,
                    apellido: u.last_name,
                }));
                setUsers(formattedUsers);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
             Swal.fire({
                title: 'Error de Carga',
                text: 'No se pudieron cargar los usuarios. Revisa la conexión con el backend.',
                icon: 'error',
                background: '#121212',
                color: '#e0e0e0'
            });
        }
    };

    // ********************************************************************
// FUNCIÓN PARA OBTENER UN USUARIO INDIVIDUAL (GET USER BY ID)
// ********************************************************************
const getUserById = async (userId) => {
    try {
        const res = await axios.get(`${API_ENDPOINT_USERS}/${userId}`, {
            headers: getAuthHeaders(),
        });
        
        if (res.data.code === 1) {
            const formattedUser = {
                ...res.data.user,
                nombre: res.data.user.first_name,
                apellido: res.data.user.last_name,
            };
            return formattedUser;
        } else {
            throw new Error(res.data.message || 'Error al obtener el usuario');
        }
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo cargar la información del usuario.',
            icon: 'error',
            background: '#121212',
            color: '#e0e0e0'
        });
        throw error;
    }
};

    // ********************************************************************
    // FUNCIÓN DE ELIMINACIÓN (DELETE)
    // ********************************************************************
    const deleteUser = async (userId) => {
        try {
            const res = await axios.delete(`${API_ENDPOINT_USERS}/${userId}`, {
                headers: getAuthHeaders(), // Incluye el token si existe
            });

            if (res.data.code === 1 || res.status === 200) {
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El usuario ha sido eliminado correctamente.',
                    icon: 'success',
                    background: '#121212',
                    color: '#e0e0e0'
                });
                getUsers(); // Refresca la lista después de eliminar
            } else {
                 Swal.fire({
                    title: 'Error',
                    text: res.data.message || 'No se pudo eliminar el usuario.',
                    icon: 'error',
                    background: '#121212',
                    color: '#e0e0e0'
                });
            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            Swal.fire({
                title: 'Error de Conexión',
                text: 'No se pudo conectar al servidor para eliminar.',
                icon: 'error',
                background: '#121212',
                color: '#e0e0e0'
            });
        }
    }

    const handleDelete = (userId) => {
        
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e61610', // Rojo para confirmar la eliminación
            cancelButtonColor: '#8a2cf1', // Morado para cancelar
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#121212',
            color: '#e0e0e0'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(userId);
            }
        });
        
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentUser(null);
    };

     const filteredUsers = users.filter(user =>
     (user.nombre && user.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(()=> {getUsers()}, []) // Carga inicial de usuarios

    return(
        <div className="admin-container">
            <Container fluid>
                <header className="admin-header">
                    <h2 className="titulo-dashboard mb-5">Administrador de Usuarios</h2>
                    <Row className="header-actions">
                        <Col xs={12} md={7} lg={8} className="d-flex mb-3 mb-md-0">
                            <InputGroup className="search-bar flex-grow-1">
                                <Form.Control
                                    type="search"
                                    placeholder="Buscar usuario..."
                                    aria-label="Buscar"
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                            <Button variant="secondary" className="search-button">Buscar</Button>
                        </Col>
                        <Col xs={12} md={5} lg={4}>
                            <Button className="add-button w-10 " onClick={() => {setCurrentUser(null); setShowModal(true);}}>Añadir Usuario</Button>
                        </Col>
                    </Row>
                </header>
                <main className="admin-content">
                    <Card className="user-table-card">
                        <Card.Body>
                            <UserTable users={filteredUsers} onEdit={handleEdit} onDelete={handleDelete}/>
                        </Card.Body>
                    </Card>
                </main>
            </Container>

            {/* Modal para el formulario de usuario */}
            <Modal show={showModal} onHide={handleCloseModal} dialogClassName="custom-modal-dialog">
                <Modal.Header closeButton className="bg-purple text-white">
                    <Modal.Title>{currentUser ? 'Editar Usuario' : 'Añadir Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <UserForm  
                        user={currentUser} 
                        onClose={handleCloseModal} 
                        onUserSaved={getUsers} // Pasamos la función para refrescar la lista
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminUsers;
