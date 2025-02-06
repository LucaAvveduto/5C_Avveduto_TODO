export const generateTodo = function (parentElement) {
  let data = [];

  return {
    send: (todo) => {
      return new Promise((resolve, reject) => {
        fetch("/todo/add", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(todo),
        })
          .then((response) => response.json())

          .then((json) => {
            resolve(json); // risposta del server all'aggiunta
          });
      });
    },

    load: () => {
      return new Promise((resolve, reject) => {
        fetch("/todo")
          .then((response) => response.json())

          .then((json) => {
            resolve(json);
          });
      });
    },

    completeTodo: (todo) => {
      return new Promise((resolve, reject) => {
        fetch("/todo/complete", {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(todo),
        })
          .then((response) => response.json())

          .then((json) => {
            resolve(json);
          });
      });
    },

    deleteTodo: (id) => {
      return new Promise((resolve, reject) => {
        fetch("/todo/" + id, {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())

          .then((json) => {
            resolve(json);
          });
      });
    },

    render: function () {
      let html = '<table class="table table-striped"><tbody>';
      data.forEach((e, index) => {
        let cssClass = e.completed ? "task-completed " : "";
        html +=
          "<tr class=" +
          cssClass +
          "table-row" +
          ">" +
          "<td>" +
          e.name +
          "</td>" +
          '<td><button type="button" class="btn btn-danger" id="' +
          index +
          '">DELETE</button></td>' +
          '<td><button type="button" class="btn btn-success" id="' +
          index +
          '">COMPLETED</button></td>' +
          "</tr>";
      });
      html += "</tbody></table>";
      parentElement.innerHTML = html;
      document.querySelectorAll("button.btn-danger").forEach((e, index) => {
        e.onclick = () => {
          this.deleteTodo(data[index].id).then(() => {
            this.load().then((r) => {
              this.setData(r.todos);
              this.render();
            });
          });
        };
      });
      document.querySelectorAll("button.btn-success").forEach((e, index) => {
        e.onclick = () => {
          this.completeTodo(data[index]).then(() => {
            this.load().then((r) => {
              this.setData(r.todos);
              console.log(r.todos);
              this.render();
            });
          });
        };
      });
    },
    setData: (newValue) => {
      data = newValue;
    },
  };
};
