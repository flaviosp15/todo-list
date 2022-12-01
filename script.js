const inputToDo = document.querySelector('.header__input-todo');
const addToDoButton = document.querySelector('.header__btn-todo');
const totalTasks = document.querySelector('.span__total-task');
const totalCompletedTasks = document.querySelector('.span__total-completed-task');
const totalIncompletedTasks = document.querySelector('.span__total-incompleted-task');
const list = document.querySelector('.todo-list');
const localStorageTasks = JSON.parse(localStorage.getItem('tasks'));
let tasks = localStorage.getItem('tasks') !== null ? localStorageTasks : [];

const cleanInput = () => {
  inputToDo.value = '';
  inputToDo.focus();
};

const updateLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const deleteToDo = event => {
  const task = event.parentNode.previousSibling.previousSibling.textContent;
  tasks.splice(tasks.indexOf(task), 1);
  updateLocalStorage();
  displayToDoList();
  displayCounterTasks();
};

const displayCounterTasks = () => {
  const checkTasks = [];
  const inputsCheckboxes = document.querySelectorAll('.item__input');
  inputsCheckboxes.forEach(input => {
    const task = input.nextSibling.nextSibling.textContent;
    checkTasks.push([task, input.checked]);
  });
  const lengthTotalTasks = tasks.length; //toDoListArr.size;
  const completed = checkTasks.filter(([_, bool]) => bool).length;
  totalTasks.innerHTML = lengthTotalTasks;
  totalCompletedTasks.innerHTML = completed;
  totalIncompletedTasks.innerHTML = lengthTotalTasks - completed;
};

const displayToDoList = () => {
  list.innerHTML = '';
  tasks.forEach(task => {
    const lowerCaseTask = task.toLowerCase();
    const toDoHTML = `
    <li class="todo-list__item">
    <input class="item__input" type="checkbox" name="done" id="${lowerCaseTask}" onchange="displayCounterTasks()">
    <label class="item__text" for="${lowerCaseTask}">${task}</label>
    <div class="item__box-icon">
      <button class="box-icon__btn edit-btn" type="button" onclick="">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path>
          <path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path>
        </svg>
      </button>
      <button class="box-icon__btn delete-btn" type="button" onclick="deleteToDo(this)">
        <svg class="item__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
          <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
        </svg>
      </button>
    </div>
  </li>
    `;
    list.innerHTML += toDoHTML;
  });
};

const addToDoInList = () => {
  const task = inputToDo.value;
  const haveSomeDigit = /\w/g.test(task);

  if (haveSomeDigit && !tasks.includes(task)) {
    tasks.push(task);
    cleanInput();
  }

  updateLocalStorage();
  displayToDoList();
  displayCounterTasks();
};

addToDoButton.addEventListener('click', addToDoInList);

inputToDo.addEventListener('keypress', event => event.key === 'Enter' && addToDoInList());

addToDoInList();
