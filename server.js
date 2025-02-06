const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('conf.json'));

const connection = mysql.createConnection(conf);
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/", express.static(path.join(__dirname, "public")));

let todos = [];

const executeQuery = (sql) => {
  return new Promise((resolve, reject) => {      
        connection.query(sql, function (err, result) {
           if (err) {
              console.error(err);
              reject();     
           }   
           console.log('done');
           resolve(result);         
     });
  })
}


const createTable = async() => {
  return await executeQuery(`
  CREATE TABLE IF NOT EXISTS todo
     ( id INT PRIMARY KEY AUTO_INCREMENT, 
        name VARCHAR(255) NOT NULL, 
        completed BOOLEAN ) 
     `);      
}

createTable();

const insert = async(todo) => {
  const template = `INSERT INTO todo (name, completed) VALUES ('$NAME', '$COMPLETED')`;
  let sql = template.replace("$NAME", todo.name);
  sql = sql.replace("$COMPLETED", todo.completed ? 1 : 0);
  return await executeQuery(sql); 
}

const select = async() => {
  const sql = `SELECT id, name, completed FROM todo`;
  return await executeQuery(sql); 
}

const complete = async(todo) => { 
  const query = "UPDATE todo SET completed=$COMPLETED WHERE id=$ID"
  let sql = query.replace("$COMPLETED",todo.completed ? 1 : 0);
  sql = sql.replace("$ID", todo.id);
  return await executeQuery(sql);
}

const deleteElement = async(todo) => {
  const query = "DELETE FROM todo WHERE id=$ID";
  console.log(todo);
  let sql = query.replace("$ID",todo.id);
  return await executeQuery(sql);
}


app.post("/todo/add", async(req, res) => {
  const todo = req.body.todo;
  await insert(todo);
  res.json({ result: "Ok" });
});

app.get("/todo", async(req, res) => {
  const todos = await select();
  res.json({ todos: todos });
});

app.put("/todo/complete", async(req, res) => {
  const todo = req.body;

  try {
    let todos = await select();
    todos = await todos.map(async(element) => {
      if (element.id === todo.id) {
        element.completed = true;
        await complete();
      }
      return element;
    });
  } catch (e) {
    console.log(e);
  }
  res.json({ result: "Ok" });
});

app.delete("/todo/:id", async(req, res) => {
  let todos = await select();
  todos = todos.filter((element) => element.id == req.params.id);
  await deleteElement(todos[0]);
  res.json({ result: "Ok" });
});

const server = http.createServer(app);
server.listen(80, () => {
  console.log("- server running");
});
