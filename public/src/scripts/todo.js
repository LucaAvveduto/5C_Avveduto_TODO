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

    render: function () {
      let html = '<table class="table table-focus table-striped"><tbody>';
      data.forEach((e) => {
        html += 
        '<tr class="table-row">' +
            '<td id="' + e.id + '">' + e.name + '</td>' +
            '<td><button type="button" class="btn btn-danger" id="' + e.id + '">DELETE</button></td>' +
            '<td><button type="button" class="btn btn-success" id="' + e.id + '">COMPLETED</button></td>' +
        '</tr>';
      });
      html += "</tbody></table>";
      parentElement.innerHTML = html;
    },
    setData: (newValue) => {
        data = newValue;
    }
  };
};
