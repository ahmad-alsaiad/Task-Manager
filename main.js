let initialCategory = "capture";
const taskTemplate = document.querySelector('#task-template');
const categoryButtons = document.querySelectorAll('.wrapper .sidebar ul li button');
let input = document.querySelector(".input");
let addTaskForm = document.querySelector("#add-task-form");
let tasksDiv = document.querySelector(".tasks");
// Set Focus To Add Task Input Box
input.focus();
// Empty Array To Store The Tasks
let arrayOfTasks = [];
// Check if Theres Tasks In Local Storage
if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
  addElementsToPageFrom(arrayOfTasks);
}
// Add Task
addTaskForm
  .addEventListener('submit', function (event) {
    // Stop Form From Reloading Page
    event.preventDefault();
    if (input.value !== "") {
      addTaskToArray(input.value); // Add Task To Array Of Tasks
      input.value = ""; // Empty Input Field
    }
  });
// Click On Task Element
tasksDiv
  .addEventListener("click", (e) => {
    // const task_edit_el = document.createElement("button");
    // task_edit_el.classList.add("edit");
    // task_edit_el.innerText = "Edit";
  });
function addTaskToArray(taskText) {
  // Push Task To Array Of Tasks
  arrayOfTasks.push({
    category: initialCategory,
    completed: false,
    id: Date.now(),
    title: taskText,
  });
  // Add Tasks To Page
  addElementsToPageFrom(arrayOfTasks, initialCategory);
  // Add Tasks To Local Storage
  addDataToLocalStorageFrom(arrayOfTasks);
}
function addElementsToPageFrom(arrayOfTasks, category = '') {
  // Empty Tasks Div
  tasksDiv.replaceChildren();
  // Looping On Array Of Tasks
  for (const taskIndex in arrayOfTasks) {
    if (category === '' || arrayOfTasks[taskIndex].category === category) {
      addTaskElement(arrayOfTasks, taskIndex);
    }
  }
}
function addTaskElement(arrayOfTasks, taskIndex) {
  // Clone Task Template
  const newTaskDiv = taskTemplate.content.firstElementChild.cloneNode(true);
  // Check If Task is Done
  if (arrayOfTasks[taskIndex].completed) {
    newTaskDiv.classList.add('done');
  }
  newTaskDiv.setAttribute("data-id", arrayOfTasks[taskIndex].id);
  newTaskDiv.childNodes[0].textContent = arrayOfTasks[taskIndex].title;
  // Setup Completion Toggle
  newTaskDiv
    .addEventListener('click', function (event) {
      // Make Sure Only Task Itself Is Clicked
      if (event.target === newTaskDiv) {
        // Toggle Completed For The Task
        toggleStatusTaskWith(arrayOfTasks[taskIndex].id);
        // Toggle Done Class
        newTaskDiv.classList.toggle("done");
      }
    });
  // Setup Category Selection
  const newTaskSelect = newTaskDiv.querySelector('.sel');
  for (const button of categoryButtons) {
    const categoryOption = new Option(
      button.textContent, // text (label)
      button.getAttribute('data-category'), // value
      false, // defaultSelected
      arrayOfTasks[taskIndex].category === button.getAttribute('data-category'), // selected
    );
    newTaskSelect.add(categoryOption);
  }
  newTaskSelect
    .addEventListener('input', function (event) {
      arrayOfTasks[taskIndex].category = newTaskSelect.selectedOptions[0].value;
      addDataToLocalStorageFrom(arrayOfTasks);
    });
  // Setup Delete Button
  newTaskDiv.querySelector('.del')
    .addEventListener('click', function (event) {
      // Remove Task From Local Storage
      deleteTaskWith(arrayOfTasks[taskIndex].id);
      // Remove Element From Page
      newTaskDiv.remove();
    });
  // Add Task Div To Tasks Container
  tasksDiv.appendChild(newTaskDiv);
}
function addDataToLocalStorageFrom(arrayOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}
function deleteTaskWith(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  addDataToLocalStorageFrom(arrayOfTasks);
}
function toggleStatusTaskWith(taskId) {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (arrayOfTasks[i].id === taskId) {
      arrayOfTasks[i].completed === false
        ? (arrayOfTasks[i].completed = true)
        : (arrayOfTasks[i].completed = false);
    }
  }
  addDataToLocalStorageFrom(arrayOfTasks);
}
let selectedButton = Array.from(categoryButtons).find(button => button.classList.contains('selected'));
function showCategory(event) {
  const listItem = event.currentTarget;
  const button = listItem.querySelector('button');
  const category = button.getAttribute('data-category');
  initialCategory = category;
  // Change Selected Button
  selectedButton.classList.remove('selected');
  button.classList.add('selected');
  selectedButton = button;
  addElementsToPageFrom(arrayOfTasks, category);
}