const Database = require('better-sqlite3');


const db = new Database('example.db', {verbose: console.log});

db.prepare(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS orders(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id))`).run();

db.prepare(`CREATE VIEW IF NOT EXISTS user_orders AS
    SELECT users.id, users.name, orders.id FROM users JOIN orders 
    ON users.id = orders.user_id`).run();  


function addUser(name, email){
    try{
        const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?,?)');
        return stmt.run(name, email);
        // console.log(`user added with id: ${info.lastInsertRowid}`);

    }catch (err){
        console.error('failed to add user', err);
    }


}

function addOrder(user_id){
    try{
        const stmt = db.prepare('INSERT INTO orders (user_id) VALUES (?)');
        return stmt.run(user_id);
        // console.log(`user added with id: ${info.lastInsertRowid}`);

    }catch (err){
        console.error('failed to add order', err);
    }


}

function getUsersWithOrders(){
        const stmt = db.prepare('SELECT * FROM user_orders');
        return stmt.all();
}

function getOrders(){
    const stmt = db.prepare('SELECT * FROM orders');
    return stmt.all();
    // console.log('Alla användare:');

    // users.forEach(u => {
    //     console.log(`ID: ${u.id}, name: ${u.name}, email: ${u.email}`);
    // });

}

function getUsers(){
    const stmt = db.prepare('SELECT * FROM users');
    return stmt.all();
    // console.log('Alla användare:');

    // users.forEach(u => {
    //     console.log(`ID: ${u.id}, name: ${u.name}, email: ${u.email}`);
    // });

}

function getUserById(id){
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
}

function updateUser(id,name,email){
    try{
       
        const stmt = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
        return stmt.run(name, email, id);
        // console.log(`user updated: ${info.changes} rows affected`);

    } catch(err){
        console.error('failed to update user: ', err);
    }

}

function deleteUserById(id){
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
    // console.log(`user removed: ${info.changes} rows affected`);

}

module.exports = { addOrder,getUsers, getUserById, deleteUserById, updateUser, addUser, getOrders, getUsersWithOrders}

// addUser('Bill','bill@mail.com');
// addUser('Bosse','Bosse@mail.com');
// getUsers();
// deleteUserById(3);
// deleteUserById(4);
// getUsers();
// updateUser(1,"Billy","Billysmail@mail.com");
  