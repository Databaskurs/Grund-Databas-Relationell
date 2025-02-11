const express = require('express');
const {addOrder, getUsers, getUserById, deleteUserById, updateUser, addUser, getOrders, getUsersWithOrders} = require('./database.js')

const app = express();


// -- Array som vi använde som exemepl innan vi hade kopplat på databasen --

// let employees = [
//     {"name": "Bill",
//         "age": 43,
//         "salary": 100,
//         "id": 1
//     },
//     {"name": "Bosse",
//         "age": 53,
//         "salary": 200,
//         "id": 2
//     },
//     {"name": "Bertil",
//         "age": 23,
//         "salary": 300,
//         "id": 3
//     }
// ]


app.listen(8080, () => {
    console.log(`Server is running`)
})



// middleware för loggning
const logger = (req,res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}

// middleware för simulerad autentisering
const authMiddleWare = (req,res,next) => {
    const token = req.headers.authorization;
    console.log(req.headers.authorization)
    if(!token || token != "myToken"){
        return res.status(401).send("unautharized");
    }
    next();
}


// middlewares som samtliga routes ska använda
app.use(express.json())
app.use(logger);



app.get('/',(req,res) =>{
    res.send("hello world");
});

//hämta all employees, vi kan lägga middlewares explict i en route
app.get('/employees', authMiddleWare, (req,res) =>{
    res.json(getUsers());
});

//hämt en enstaka employee
app.get('/employees/:id' , authMiddleWare, (req,res) => {
    
    let response = getUserById(req.params.id);
    
    res.json(response);
    
});

//hämta users och orders (JOIN)
app.get('/orders', (req,res) => {
    res.json(getUsersWithOrders());
})


// exempel med path och query parametrar (innan vi använde request.body)

//hämta employee baserat på id med path
// app.get('/employees/:id', (req,res) =>{
//     let e = employees.find(employee => employee.id == req.params.id);
//     if(e){
//         res.json(e);
//     }else{
//         res.send("employee not found");
//     }
// });

//hämta employee baserat på id med query parameter
// app.get('/employee', (req,res) =>{
//     let id = req.query.id;
//     let name = req.query.name;

//     let e = employees.find(employee => employee.id == id);
    

//     if(e){
//         res.send(`${name} har id ${e.id}`);
//         //res.json(e);
//     }else{
//         res.send("employee not found");
//     }
// });

// app.post('/employees', (req,res) => {

//     // let newEmployee = {
//     //     "name": req.query.name,
//     //     "age": req.query.age,
//     //     "salary": req.query.salary,
//     //     "id": employees.length
//     // }
//     // employees.push(newEmployee)

//     // let name = req.query.name;
//     // let email = req.query.email;

//     res.status(201).json(addUser(name,email));

// });


//lägg till en employee
app.post('/employees',authMiddleWare, (req,res) =>{
    const {name, email} = req.body
    res.status(201).json(addUser(name,email));

})

//lägg till en order
app.post('/orders', (req,res) =>{
    const {user_id} = req.body
    res.status(201).json(addOrder(user_id));

})

//updateera en employee
app.put('/employees', authMiddleWare, (req,res) =>{


    // exempel som använde vår array ist för databas

    // let e = employees.find(employee => employee.id == req.query.id)

    // if(e){
    //     if(req.query.name){
    //         e.name = req.query.name;
    //     }
    //     if(req.query.age){
    //         e.age = req.query.age;
    //     }
    //     if(req.query.salary){
    //         e.salary = req.query.salary;
    //     }
    // } else{
    //     res.status(404).send("employee not found");
    // }


    let name = req.query.name;
    let email = req.query.email;
    let id = req.query.id;

    res.json(updateUser(id,name,email));
} );


//radera en employee
app.delete('/employees',authMiddleWare, (req,res) => {

    // gamalt exempel med array ist för databas

    // let employeeToDelete = employees.find(employee => employee.id == req.query.id)
    // let index = employees.indexOf(employeeToDelete);

    // employees.splice(index,1);
    
   res.send(deleteUserById(req.query.id));
})