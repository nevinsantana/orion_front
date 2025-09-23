import { useState } from "react";
import styles from "./AdminUsers.module.css";
import UserTable from "./UserTable";
import 'bootstrap/dist/css/bootstrap.min.css';

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


    const handleEdit = (userId) =>{
    //Editar Usuario
    console.log(`Editar usuario con ID ${userId}`);
    };


    const handleDelete = (userId) =>{
        //Eliminar usuarios
        setUsers(users.filter(user => user.id != userId));
        console.log(`Eliminar usuario con ID: ${userId}`);
        
    };

    return(
        <div className={styles.adminContainer}>
            <header className={styles.adminHeader}>
                <h1>Administrador de Usuarios</h1> 
                <div className={styles.headerActions}>
                    <div className={styles.searchBar}>
                        <input type="search" placeholder="Buscar"/>
                        <button className={styles.searchButton}>Buscar</button>
                    </div>
                    <button className={styles.addButton}>Añadir Usuario</button>
                </div>
            </header>
            <main className= {styles.adminContent}>
               <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete}/>
            </main>
        </div>
    )
    
}



export default AdminUsers;