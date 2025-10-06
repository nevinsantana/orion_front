import { Table, Button } from 'react-bootstrap';
import { FaPen } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserTable.css';

const UserTable = ({ users, onEdit, onDelete}) => {
  return (
    <div className="table-responsive">
      <Table className="user-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {users.map(user => (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{`${user.nombre} ${user.apellido}`}</td> {/* Mostramos el nombre mapeado */}
                    <td>{user.email}</td>
                    <td>
                        <Button className="edit-button" onClick={()=> onEdit(user.id)}>
                            <FaPen />
                        </Button>
                        <Button className="delete-button" onClick={()=> onDelete(user.id)}>
                            <AiFillDelete />
                        </Button>
                    </td>
                </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;
