const MONTH_NAME_OBJECT = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const formData = [];
let idCount = +localStorage.getItem("count");
let inputDeleteButtonReference = null;
let tempDiv = null;
let tempDivId = -1;

function checkForEmptyList() {
  const empty = document.querySelector(".show-on-empty");
  if (localStorage.length <= 1) {
    empty.style.display = "";
  } else {
    empty.style.display = "none";
  }
}

setCurrentDate();
function setCurrentDate() {
  let currentDate = new Date();
  if (currentDate.getMonth() >= 0 && currentDate.getMonth() < 9) {
    document.forms.appendDataForm.date.value =
      currentDate.getFullYear() +
      "-0" +
      (currentDate.getMonth() + 1) +
      "-" +
      currentDate.getDate();
  } else {
    document.forms.appendDataForm.date.value =
      currentDate.getFullYear() +
      "-" +
      (currentDate.getMonth() + 1) +
      "-" +
      currentDate.getDate();
  }
}

// first display all data from storage
displayStoredLocalStorageData();
function displayStoredLocalStorageData() {
  let ids = Object.keys(localStorage);
  for (let id of ids) {
    if (id == "count") continue;
    const obj = JSON.parse(localStorage.getItem(id));
    formData.push(obj);
    displayFormData(formData);
  }
  checkForEmptyList();
}

// to hide delete-button after showing
document.addEventListener("click", hideDeleteOption);

function hideDeleteOption() {
  if (inputDeleteButtonReference != null) {
    inputDeleteButtonReference.style.display = "none";
    inputDeleteButtonReference.previousElementSibling.style.backgroundColor =
      "";
    inputDeleteButtonReference.nextSibling.style.display = "none";
    inputDeleteButtonReference.nextSibling.previousElementSibling.style.backgroundColor =
      "";
  }
  checkForEmptyList();
}

function appendData() {
  const obj = {
    id: ++idCount,
    title: document.appendDataForm.title.value,
    description: document.appendDataForm.description.value,
    date: document.appendDataForm.date.value,
  };

  if (!isTitleValid(obj.title)) {
    alert("Title cannot be empty!");
    return;
  }

  if (!isDateValid(obj.date)) {
    alert("Date cannot be empty!");
    return;
  }

  if (tempDiv != null && tempDivId != -1) {
    tempDiv.remove();
    localStorage.removeItem(tempDivId);
  }
  tempDiv = null;
  tempDivId = -1;

  formData.push(obj);
  localStorage.setItem(idCount.toString(), JSON.stringify(obj));
  localStorage.setItem("count", +localStorage.getItem("count") + 1);
  displayFormData(formData);
}

function displayFormData(formData) {
  const currentData = formData[formData.length - 1];
  const div = document.createElement("div");

  const titleNode = getTitleNode(currentData);
  const idNode = getIdNode(currentData);
  const descriptionNode = getDescriptionNode(currentData);
  const dateNode = getDateNode(currentData);

  dateNode.className = `stored-output-child-date`;

  div.appendChild(titleNode);
  div.appendChild(descriptionNode);
  div.appendChild(dateNode);

  div.className = `stored-output-child`;
  div.id = `stored-output-child-${currentData.id}`;

  addOptionImage(div, currentData.id);
  addDeleteButton(div, currentData.id);
  addDeleteFunctionToDeleteButton(div);
  addDeleteButtonToggleFunction(div);

  addEditButton(div, currentData.id);
  editButtonFunctionality(div, currentData.id);

  let stored = false;
  for (let child of document.body.children) {
    if (child.className === "stored-output") {
      child.appendChild(div);
      stored = true;
      break;
    }
  }
  div.appendChild(idNode);

  document.appendDataForm.reset();
  setCurrentDate();
}

function editButtonFunctionality(div, id) {
  let btn = div.querySelector(".edit-node");
  btn.onclick = () => {
    div.style.display = "none";
    document.forms.appendDataForm.title.value =
      div.firstElementChild.innerHTML.substring(7);
    document.forms.appendDataForm.description.value =
      div.firstElementChild.nextElementSibling.innerHTML.substring(13);
    let date = div.querySelector(".stored-output-child-date").innerHTML;
    document.forms.appendDataForm.date.value = correctDateFormatForJS(date);
    tempDiv = div;
    tempDivId = getIdFromLocalStorage(tempDiv);
  };
}

function getIdFromLocalStorage(div) {
  return div.querySelector(".to-store-id").innerHTML;
}

function correctDateFormatForJS(date) {
  let arr = date.split(" ");
  let month;

  switch (arr[1]) {
    case "Jan":
      month = "01";
      break;
    case "Feb":
      month = "02";
      break;
    case "Mar":
      month = "03";
      break;
    case "Apr":
      month = "04";
      break;
    case "May":
      month = "05";
      break;
    case "Jun":
      month = "06";
      break;
    case "Jul":
      month = "07";
      break;
    case "Aug":
      month = "08";
      break;
    case "Sep":
      month = "09";
      break;
    case "Oct":
      month = "10";
      break;
    case "Nov":
      month = "11";
      break;
    case "Dec":
      month = "12";
      break;
  }
  return arr[2] + "-" + month + "-" + arr[0];
}

function onClickDeleteButton() {
  let targetId = this.name;
  let isDeleted = false;
  for (let i = 0; i < formData.length; i++) {
    if (formData[i].id == targetId) {
      formData.splice(i, 1);
      isDeleted = true;
    }
  }
  if (isDeleted) {
    deleteCardFromDOM(this.name);
    localStorage.removeItem(targetId);
  } else {
    alert("Error while deleted");
  }
}

function deleteCardFromDOM(id) {
  let div = document.getElementById(`stored-output-child-${id}`);
  div.remove();
}

function addDeleteFunctionToDeleteButton(div) {
  const btn = div.querySelector(".delete-node");
  btn.onclick = onClickDeleteButton;
}

function onMouseOverFunction(event) {
  hideDeleteOption();
  this.nextSibling.style.display = "block";
  this.style.backgroundColor = "#ccc";
  this.nextSibling.nextSibling.style.display = "block";
  event.stopPropagation();
  inputDeleteButtonReference = this.nextSibling;
}

function onMouseOutFunction() {
  this.nextSibling.style.display = "none";
}

function addDeleteButtonToggleFunction(div) {
  const imgTag = div.querySelector("img");
  imgTag.onclick = onMouseOverFunction;
}

function addDeleteButton(div, id) {
  const deleteButton = getDeleteButtonNode(id);
  div.appendChild(deleteButton);
}

function addEditButton(div, id) {
  const editButton = getEditButtonNode(id);
  div.appendChild(editButton);
}

function getEditButtonNode(id) {
  const btn = document.createElement("input");
  btn.type = "button";
  btn.value = "Edit Node";
  btn.className = `edit-node`;
  btn.name = id;
  return btn;
}

function getDeleteButtonNode(id) {
  const btn = document.createElement("input");
  btn.type = "button";
  btn.value = "Delete Node";
  btn.className = `delete-node`;
  btn.name = id;
  return btn;
}

function addOptionImage(div, id) {
  const imgNode = getThreeVerticalImagesNode();
  div.appendChild(imgNode);
}

function getThreeVerticalImagesNode() {
  const imgTag = document.createElement("img");
  imgTag.src = "./images/vertical-three-dots.png";
  imgTag.className = "option-logo-three-vertical-line";
  return imgTag;
}

function getTitleNode(currentData) {
  const titleNode = document.createElement("p");
  const titleTextNode = document.createTextNode(`Title: ${currentData.title}`);
  titleNode.appendChild(titleTextNode);
  return titleNode;
}

function getIdNode(currentData) {
  const titleNode = document.createElement("p");
  titleNode.className = "to-store-id";
  const titleTextNode = document.createTextNode(`${currentData.id}`);
  titleNode.appendChild(titleTextNode);
  // titleNode.style.display = "none";
  return titleNode;
}

function getDescriptionNode(currentData) {
  const descriptionNode = document.createElement("p");
  const descriptionTextNode = document.createTextNode(
    `Description: ${currentData.description}`
  );
  descriptionNode.appendChild(descriptionTextNode);
  return descriptionNode;
}

function getDateNode(currentData) {
  const dateNode = document.createElement("p");
  const dateTextNode = document.createTextNode(
    `${getDate(currentData.date)} ${getMonthName(currentData.date)} ${getYear(
      currentData.date
    )}`
  );
  dateNode.appendChild(dateTextNode);
  return dateNode;
}

function getDate(date) {
  return date.split("-")[2];
}
function getMonthName(date) {
  return MONTH_NAME_OBJECT[date.split("-")[1]];
}
function getYear(date) {
  return date.split("-")[0];
}

function isTitleValid(title) {
  if (title === "") {
    return false;
  } else {
    return true;
  }
}

function isDateValid(date) {
  if (date === "") {
    return false;
  } else {
    return true;
  }
}
