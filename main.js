const API = " http://localhost:8000/contacts";

//? Вытаскиваем инпуты и кнопку
let name = document.querySelector("#name");
let lastName = document.querySelector("#lastName");
let number = document.querySelector("#number");
let picture = document.querySelector("#picture");
let btnAdd = document.querySelector("#btn-add");

//? Вытаскиваю инпуты для edit
let nameEdit = document.querySelector("#edit-name");
let lastNameEdit = document.querySelector("#edit-lastName");
let numberEdit = document.querySelector("#edit-number");
let pictureEdit = document.querySelector("#edit-picture");
let editSaveBtn = document.querySelector("#btn-save-edit");
let exampleModal = document.querySelector("#exampleModal");

//? PUSH CARDS
let list = document.querySelector("#contact-list");
btnAdd.addEventListener("click", async function () {
  // Я создала объект с значениями из инпутов
  let obj = {
    name: name.value,
    lastName: lastName.value,
    number: number.value,
    picture: picture.value,
  };

  // ПРОВЕРКА  НА ЗАПОЛНЕННОСТЬ
  if (
    !obj.name.trim() ||
    !obj.lastName.trim() ||
    !obj.number.trim() ||
    !obj.picture.trim()
  ) {
    alert("Заполните все поля!");
  }
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  name.value = "";
  lastName.value = "";
  number.value = "";
  picture.value = "";
  render();
});

//? ЧТОБЫ Я МОГЛА ВИДЕТЬ КОНТАКТЫ

async function render() {
  let contacts = await fetch(API)
    .then((response) => response.json())
    .catch((error) => console.log(error));

  list.innerHTML = "";

  contacts.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;
    newElem.innerHTML = `
      <div class="card m-5" style="width: 18rem;">
      <img src="${element.picture}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${element.name} ${element.lastName}</h5>
        <p class="card-text">${element.number}</p>
        <a href="#" id =${element.id} onclick ='deleteContact(${element.id})' class="btn btn-danger btn-delete">DELETE</a>
        <a href="#" id =${element.id} data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-primary btn-edit">EDIT</a>
      </div>
    </div>
      `;
    list.append(newElem);
  });
}

render();

//? УДАЛЕНИЕ КОНТАКТА
function deleteContact(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => render());
}

//? РЕДАКТИРОВАНИЕ КОНТАКТА
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        nameEdit.value = data.name;
        lastNameEdit.value = data.lastName;
        numberEdit.value = data.number;
        pictureEdit.value = data.picture;

        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

//? Сохранение изменений которые я врнесла
editSaveBtn.addEventListener("click", function () {
  let id = this.id;
  let name = nameEdit.value;
  let lastName = lastNameEdit.value;
  let number = numberEdit.value;
  let picture = pictureEdit.value;
  if (!name || !lastName || !number || !picture) {
    return;
  }

  let editedContact = {
    name: name,
    lastName: lastName,
    nummer: number,
    picture: picture,
  };
  saveEdit(editedContact, id);
});

function saveEdit(editedContact, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedContact),
  }).then(() => {
    render();
  });
  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}
