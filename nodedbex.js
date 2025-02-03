// Importera och sätt upp databaskopplingen
const database = require('better-sqlite3');
const db = new database('./webbutiken.db', { verbose: console.log });

// ALLA KUNDER -----------------------------------

// Version 1: Minimal - Hämtar och visar alla kunder
function getAllCustomers() {
   const rows = db.prepare('SELECT * FROM customers').all();
   rows.forEach(customer => console.log(`${customer.name}, ${customer.email}`));
}

// Version 1.1: Minimal - Hämtar och visar alla produkter
function getAllProducts() {
    const statement = db.prepare('SELECT * FROM products');
    const rows = statement.all();
    
    for (let i = 0; i < rows.length; i++) {
        const product = rows[i];
        console.log(`ID: ${product.product_id}, Namn: ${product.name}, Beskrivning: ${product.description}, Pris: ${product.price}`);
    }
}


// Version 2: Med felhantering och mer strukturerad utskrift
function getAllCustomersWithErrorHandling() {
   try {
       // Förbereder SQL-frågan
       const statement = db.prepare('SELECT * FROM customers');
       // Kör frågan och sparar resultatet
       const customers = statement.all();

       console.log('Alla kunder:');
       customers.forEach(customer => {
           console.log(`ID: ${customer.customer_id}`);
           console.log(`Namn: ${customer.name}`);
           console.log(`Email: ${customer.email}`);
           console.log('------------------------');
       });
   } catch (error) {
       console.error('Ett fel uppstod vid hämtning av kunder:', error.message);
   }
}

// Version 3: Med arrow function och mer avancerad formatering
const getAllCustomersFormatted = () => {
   try {
       // Använder template literal för SQL-frågan för bättre läsbarhet
       const query = `
           SELECT 
               customer_id,
               name,
               email,
               phone
           FROM customers
           ORDER BY name
       `;
       
       const customers = db.prepare(query).all();
       
       // Använder reduce för att skapa en formaterad string
       const formattedOutput = customers.reduce((output, customer) => {
           return output + `
           Kund #${customer.customer_id}
           ------------------
           Namn:  ${customer.name}
           Email: ${customer.email}
           Tel:   ${customer.phone || 'Ej angivet'}
           \n`;
       }, '\nKUNDLISTA:\n');
       
       console.log(formattedOutput);
   } catch (error) {
       console.error(`🛑 Fel: ${error.message}`);
   }
};

// HÄMTA KUND VIA ID -----------------------------------

// Version 1: Minimal
function getCustomerById(id) {
   const customer = db.prepare('SELECT * FROM customers WHERE customer_id = ?').get(id);
   console.log(`${customer.name}, ${customer.email}`);
}

// Version 2: Med felhantering och validering
function getCustomerByIdSafe(id) {
   try {
       // Validera input
       if (!Number.isInteger(id) || id <= 0) {
           throw new Error('Ogiltigt ID format');
       }

       const statement = db.prepare('SELECT * FROM customers WHERE customer_id = ?');
       const customer = statement.get(id);

       // Kolla om kunden hittades
       if (!customer) {
           console.log(`Ingen kund hittad med ID: ${id}`);
           return;
       }

       console.log('Kundinformation:');
       console.log(`ID: ${customer.customer_id}`);
       console.log(`Namn: ${customer.name}`);
       console.log(`Email: ${customer.email}`);
   } catch (error) {
       console.error('Fel vid hämtning av kund:', error.message);
   }
}

// Version 3: Med arrow function och destructuring
const getCustomerByIdAdvanced = (id) => {
   try {
       const query = `
           SELECT 
               c.customer_id,
               c.name,
               c.email,
               COUNT(o.order_id) as total_orders
           FROM customers c
           LEFT JOIN orders o ON c.customer_id = o.customer_id
           WHERE c.customer_id = ?
           GROUP BY c.customer_id
       `;
       
       const customer = db.prepare(query).get(id);
       
       if (!customer) return console.log('Kund ej funnen');
       
       // Destructuring för att plocka ut värden
       const { name, email, total_orders } = customer;
       
       console.log(`
           Kundinformation
           ---------------
           Namn: ${name}
           Email: ${email}
           Antal ordrar: ${total_orders}
       `);
   } catch (error) {
       console.error(`🛑 Fel: ${error.message}`);
   }
};

// LÄGG TILL KUND -----------------------------------

// Version 1: Minimal
function addCustomer(name, email) {
   db.prepare('INSERT INTO customers (name, email) VALUES (?, ?)').run(name, email);
}

// Version 2: Med felhantering och validering
function addCustomerSafe(name, email, phone, address) {
   try {
       // Validera input
       if (!name || !email) {
           throw new Error('Namn och email krävs');
       }
       
       // Validera email-format
       if (!email.includes('@')) {
           throw new Error('Ogiltig email-adress');
       }

       const statement = db.prepare(`
           INSERT INTO customers (name, email, phone, address) 
           VALUES (?, ?, ?, ?)
       `);

       const result = statement.run(name, email, phone || null, address || null);
       console.log(`Kund tillagd med ID: ${result.lastInsertRowid}`);
       
   } catch (error) {
       console.error('Fel vid tillägg av kund:', error.message);
   }
}

// Version 3: Med objektparameter och validering
const addCustomerAdvanced = ({ name, email, phone = null, address = null }) => {
   try {
       // Validera required fields med object destructuring
       if (!name?.trim() || !email?.trim()) {
           throw new Error('Namn och email krävs och får inte vara tomma');
       }

       // Skapa ett rent objekt med bara giltiga värden
       const customerData = {
           name: name.trim(),
           email: email.toLowerCase().trim(),
           phone: phone?.trim() || null,
           address: address?.trim() || null
       };

       const query = `
           INSERT INTO customers (name, email, phone, address)
           VALUES (@name, @email, @phone, @address)
       `;

       const result = db.prepare(query).run(customerData);
       
       console.log(`
           ✅ Kund tillagd
           ID: ${result.lastInsertRowid}
           Namn: ${customerData.name}
           Email: ${customerData.email}
       `);
       
   } catch (error) {
       console.error(`🛑 Fel: ${error.message}`);
   }
};

getAllCustomersFormatted()

// Stäng databaskopplingen när programmet avslutas
db.close();