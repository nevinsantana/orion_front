import styles from './UserTable.module.css'
import { FaPen } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";



const UserTable = ({ users, onEdit, onDelete}) => {
  return (
    <table className={styles.userTable}>
        <thead>
            <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {users.map(user => (
                <tr key={user.id}>
                    <td>Usuario {user.id}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className={styles.editButton} onClick={()=> onEdit(user.id)}>
                        <FaPen />
                        </button>
                        <button className={styles.deleteButton} onClick={()=> onDelete(user.id)}>
                        <AiFillDelete />
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
  )
}

export default UserTable;