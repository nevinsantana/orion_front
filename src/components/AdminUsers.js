import { useEffect, useState } from "react";
import { Container, Row, Col, Card, InputGroup, Button, Form, Modal, Table, Pagination } from 'react-bootstrap'; // Importamos Pagination
import UserForm from "../UserForm/UserForm";
import { FaPen } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
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
    return {};
};


const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // ********************************************************************
    // LÓGICA DE PAGINACIÓN AÑADIDA
    // ********************************************************************
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12 

    const handleEdit = (userId) => {
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
                headers: getAuthHeaders(),
            });
            
            if (res.data.code === 1 && Array.isArray(res.data.users)) {
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
    // FUNCIÓN DE ELIMINACIÓN (DELETE)
    // ********************************************************************
    const deleteUser = async (userId) => {
        try {
            const res = await axios.delete(`${API_ENDPOINT_USERS}/${userId}`, {
                headers: getAuthHeaders(),
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
            confirmButtonColor: '#e61610',
            cancelButtonColor: '#8a2cf1',
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

    // ********************************************************************
    // CÁLCULOS DE PAGINACIÓN
    // ********************************************************************
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const displayedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // ********************************************************************
    // MANEJO DE CAMBIOS DE PÁGINA
    // ********************************************************************
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(()=> {getUsers()}, []) // Carga inicial de usuarios
    useEffect(() => {
        setCurrentPage(1); // Resetear a la primera página al buscar
    }, [searchTerm]); 

    // Función que reemplaza el componente UserTable
    const RenderUserTable = () => (
        <div className="table-responsive clients-table-wrapper">
          <Table className="table table-dark table-striped user-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {displayedUsers.length > 0 ? (
                    displayedUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{`${user.nombre} ${user.apellido}`}</td> 
                            <td>{user.email}</td>
                            <td>
                                <Button className="edit-button" onClick={()=> handleEdit(user.id)}>
                                    <FaPen />
                                </Button>
                                <Button className="delete-button" onClick={()=> handleDelete(user.id)}>
                                    <AiFillDelete />
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr className="text-center">
                        <td colSpan="4">No se encontraron usuarios</td>
                    </tr>
                )}
            </tbody>
          </Table>
        </div>
    );
    // FIN de la función que reemplaza el componente UserTable

    return(
        <div className="admin-container">
            <Container fluid className="clients-container">
                <h1 className="mb-4">Administrador de Usuarios</h1>
                <Row className="mb-3 align-items-center header-actions">
                    
                    {/* Columna de Búsqueda */}
                    <Col lg={6} md={6} className="d-flex justify-content-start mb-2">
                        <InputGroup className="search-bar flex-grow-1">
                            <Form.Control
                                type="search"
                                placeholder="Buscar usuario..."
                                aria-label="Buscar"
                                className="form-control search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                        <Button variant="secondary" className="btn ms-2 search-button">Buscar</Button>
                    </Col>
                    
                    {/* Columna de Añadir Usuario */}
                    <Col lg={6} md={6} className="d-flex justify-content-md-end justify-content-start">
                        <Button className="btn d-flex align-items-center add-button" onClick={() => {setCurrentUser(null); setShowModal(true);}}>
                            Añadir Usuario
                        </Button>
                    </Col>
                    
                </Row>
                <main className="admin-content">
                    <Row>
                        <Col md={12}>
                            <Card className="user-table-card">
                                <Card.Body className="p-0">
                                    <RenderUserTable /> 
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </main>
                
                {/* ******************************************************************** */}
                {/* PAGINACIÓN AÑADIDA */}
                {/* ******************************************************************** */}
                {/* Paginación */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center mt-3">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </button>
            </li>
            {[...Array(totalPages)].map((_, idx) => (
              <li
                key={idx}
                className={`page-item ${
                  currentPage === idx + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}
                
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
                        onUserSaved={getUsers}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminUsers;