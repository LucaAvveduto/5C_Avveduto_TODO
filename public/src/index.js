import { generateTodo } from "./scripts/todo.js";

const tableDiv = document.querySelector("#todoList");
const insertButton = document.querySelector("#insButton");
const todoInput = document.querySelector("#insTodo");
const errorDiv = document.querySelector("#errorDiv");

const todoTable = generateTodo(tableDiv);

insertButton.onclick = () => {
  let val = todoInput.value;
  if (!val || !val.trim()) {
    errorDiv.innerHTML = '<p class="error-message">Insert a real title</p>';
    return;
  }
  errorDiv.innerHTML = ""; 
  const todo = {
    name: todoInput.value,
    completed: false,
  };

  todoTable
    .send({ todo: todo })
    .then(() => todoTable.load())
    .then((json) => {
      todoTable.setData(json.todos);
      todoInput.value = "";
      todoTable.render();
    });
};

todoTable.load().then((json) => {
  todoTable.setData(json.todos);
  todoTable.render();
});

setInterval(() => {
  todoTable.load().then((json) => {
    todoTable.setData(json.todos);
    todoInput.value = "";
    todoTable.render();
});
}, 30000);
