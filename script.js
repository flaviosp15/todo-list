const inputToDoDOM = document.querySelector('.header__input-todo');
const addToDoDOM = document.querySelector('.header__btn-todo');
const toDoListDOM = document.querySelector('.todo-list');
const totalToDoDOM = document.querySelector('.span__total-task');
const totalCompleteToDoDOM = document.querySelector('.span__total-completed-task');
const totalIncompleteToDoDOM = document.querySelector('.span__total-incompleted-task');
const localStorageToDo = JSON.parse(localStorage.getItem('tasks'));
const localStorageArray = localStorage.getItem('tasks') !== null ? localStorageToDo : [];
let oldTask;

const init = () => {
  updateLocalStorage();
  displayCounterTasks();
  displayToDoList();
};

const updateLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(localStorageArray));
};

const addToDo = () => {
  const newTask = inputToDoDOM.value;
  const haveSomeDigit = /\w/g.test(newTask);
  const isRepeatedTask = !copyArray(localStorageArray).find(task => task === newTask);

  if (haveSomeDigit && isRepeatedTask) {
    localStorageArray.push({ task: newTask, done: false });
    cleanInput();
  }

  init();
};

const copyArray = arr => {
  return arr.map(({ task }) => task);
};

const deleteToDo = e => {
  const deleteBtn = e.target;
  const isDeleteBtn = deleteBtn.classList.contains('box-icon__delete-todo');
  if (isDeleteBtn) {
    const task = deleteBtn.parentElement.previousElementSibling.textContent;
    localStorageArray.splice(copyArray(localStorageArray).indexOf(task), 1);
    init();
  }
  return;
};

const cleanInput = () => {
  inputToDoDOM.value = '';
  inputToDoDOM.focus();
};

const checkToDo = e => {
  e.preventDefault();
  const item = e.target.parentElement;
  const checkbox = item.children[0];
  const label = item.children[1];
  const task = label.textContent;
  const isCheckboxEl = checkbox.classList.contains('item__check-todo');
  const isLabelEl = label.tagName.toLowerCase() === 'label';
  if (isCheckboxEl && isLabelEl) {
    const copyLocalStorageArray = copyArray(localStorageArray);
    checkbox.checked = !checkbox.checked;
    localStorageArray[copyLocalStorageArray.indexOf(task)]['done'] = checkbox.checked;
    updateLocalStorage();
    displayCounterTasks();
  }
  return;
};

const switchElementTag = el => {
  const taskDOM = el.parentElement.previousElementSibling;
  const isItLabelTag = taskDOM.tagName.toLowerCase() === 'label';
  const taskText = isItLabelTag ? taskDOM.innerText : taskDOM.value;
  const element = isItLabelTag
    ? `<input class="item__text" type=text value="${taskText}">`
    : `<label class="item__text" for="${taskText.toLowerCase().replace(/\s/g, '-')}">${taskText}</label>`;
  const parser = new DOMParser().parseFromString(element, 'text/html');
  const currentHTMLElement = parser.firstElementChild.children[1].firstElementChild;
  const focusEnd = el => {
    el.focus();
    const val = el.value;
    el.value = '';
    el.value = val;
  };
  taskDOM.parentElement.replaceChild(currentHTMLElement, taskDOM);
  if (isItLabelTag) focusEnd(currentHTMLElement);
};

const switchToDoValue = btn => {
  const taskInput = btn.parentElement.previousElementSibling.value;
  const copyLocalStorageArray = copyArray(localStorageArray);
  const index = copyLocalStorageArray.indexOf(oldTask);
  localStorageArray[index]['task'] = taskInput;
};

const editToDo = e => {
  e.preventDefault();
  const editBtn = e.target;
  const itemsArray = e.currentTarget.children;
  const isEditBtn = editBtn.classList.contains('box-icon__edit-todo');
  const hideTargetEditBtn = () => editBtn.classList.remove('active');
  const showTargetConfirmBtn = () => editBtn.nextElementSibling.classList.add('active');
  if (isEditBtn) {
    Array.from(itemsArray).forEach(icon => {
      const confirmBtn = icon.lastElementChild.children[1];
      const editBtn = icon.lastElementChild.firstElementChild;
      const isAnInput = icon.children[1].tagName.toLowerCase() === 'input';
      const hideConfirmBtns = () => confirmBtn.classList.remove('active');
      const showEditBtns = () => editBtn.classList.add('active');
      hideConfirmBtns();
      showEditBtns();
      if (isAnInput) {
        switchToDoValue(confirmBtn);
        switchElementTag(editBtn);
        updateLocalStorage();
      }
    });
    hideTargetEditBtn();
    showTargetConfirmBtn();
    oldTask = editBtn.parentElement.previousElementSibling.textContent;
    switchElementTag(editBtn);
  }
  return;
};

const confirmEditToDo = e => {
  const confirmBtn = e.target;
  const isConfirmBtn = confirmBtn.classList.contains('box-icon__confirm-edit');
  if (isConfirmBtn) {
    const hideConfirmBtn = () => confirmBtn.classList.remove('active');
    const showEditBtn = () => confirmBtn.previousElementSibling.classList.add('active');
    hideConfirmBtn();
    showEditBtn();
    switchToDoValue(confirmBtn);
    switchElementTag(confirmBtn);
    init();
  }
  return;
};

const displayCounterTasks = () => {
  const doneTasksArray = localStorageArray.map(({ done }) => done);
  const tasksArrayLength = doneTasksArray.length;
  const completedTasks = doneTasksArray.filter(bool => bool).length;
  totalToDoDOM.innerHTML = tasksArrayLength;
  totalCompleteToDoDOM.innerHTML = completedTasks;
  totalIncompleteToDoDOM.innerHTML = tasksArrayLength - completedTasks;
};

const displayToDoList = () => {
  toDoListDOM.innerHTML = '';
  localStorageArray.forEach(({ task, done }) => {
    const lowerCaseTask = task.toLowerCase().replace(/\s/g, '-');
    const toDoHTML = `
    <li class="todo-list__item">
    <input class="item__check-todo" ${done ? 'checked' : ''} type="checkbox" id="${lowerCaseTask}">
    <label class="item__text" for="${lowerCaseTask}">${task}</label>
    <div class="item__box-icon">
      <button class="box-icon__btn box-icon__edit-todo active" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path>
          <path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path>
        </svg>
      </button>
      <button class="box-icon__btn box-icon__confirm-edit" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
      </button>
      <button class="box-icon__btn box-icon__delete-todo" type="button">
        <svg class="item__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
          <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
        </svg>
      </button>
    </div>
  </li>
    `;
    toDoListDOM.innerHTML += toDoHTML;
  });

  toDoListDOM.addEventListener('click', checkToDo);
  toDoListDOM.addEventListener('click', deleteToDo);
  toDoListDOM.addEventListener('click', editToDo);
  toDoListDOM.addEventListener('click', confirmEditToDo);
};

init();

addToDoDOM.addEventListener('click', addToDo);

inputToDoDOM.addEventListener('keypress', event => event.key === 'Enter' && addToDo());
