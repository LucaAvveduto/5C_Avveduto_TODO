import { generateTodo } from "./scripts/todo.js";

const tableDiv = document.querySelector("#todoList");
const insertButton = document.querySelector("#insButton");
const todoInput = document.querySelector("#insTodo");

const todoTable = generateTodo(tableDiv);

insertButton.onclick = () => {
  console.log("premuto")
  const todo = {
    name: todoInput.value,
    completed: false,
  };

  todoTable.send({ todo: todo })
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
