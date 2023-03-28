const allBtn = document.querySelector('.all-btn');
const activeBtn = document.querySelector('.active-btn');
const completedBtn = document.querySelector('.completed-btn');

const switcher = document.querySelector(' input[Type="checkbox"]');
const clearCompleted = document.querySelector('.clear-completed');
const body = document.body;
const formTodo = document.querySelector('.form');
const inputTodo = document.querySelector('#todos');
const todoList = document.getElementById('todo-list');
const filterList = document.querySelector('.contorls-list');
let isChecked = false;

let initialTasks = [];

function setActiveFilter(button) {
    const filterBtns = document.querySelectorAll('.filter');

    filterBtns.forEach(btn => {
        if (btn.classList.contains('active-filter')) {
            btn.classList.remove('active-filter');
        }
    });
    button.classList.add('active-filter');
}
switcher.addEventListener('change', (e) => {
    if (e.target.checked) {
        body.classList.replace('light', 'dark')
    } else {
        body.classList.replace('dark', 'light')
    }
})

clearCompleted.addEventListener('click', () => {
    const completedTasks = document.querySelectorAll('.checked');

    if (!completedTasks.length) {
        return;
    }
    const idsOfDeleted = [];
    for (task of completedTasks) {
        const id = task.getAttribute('data-key');
        idsOfDeleted.push(id);
        task.remove();
    }
    const localStorageTasks = JSON.parse(localStorage.getItem('tasksRef'));
    idsOfDeleted.forEach(id => {
        let lsIdx = localStorageTasks.findIndex(t => t.id === Number(id));
        if (lsIdx > -1) {
            localStorageTasks[lsIdx].deleted = true;
        }
    });
    localStorage.setItem('tasksRef', JSON.stringify(localStorageTasks));
})

allBtn.addEventListener('click', () => {
    const tasks = document.querySelectorAll('.todo-list>li');
    setActiveFilter(allBtn);
    for (let task of tasks) {
        task.style.display = 'flex';
    }
});

completedBtn.addEventListener('click', () => {
    const tasks = document.querySelectorAll('.todo-list>li');
    setActiveFilter(completedBtn);

    for (let task of tasks) {
        if (task.classList.contains('checked')) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    }
});

activeBtn.addEventListener('click', () => {
    const tasks = document.querySelectorAll('.todo-list>li');
    setActiveFilter(activeBtn);

    for (let task of tasks) {
        if (task.classList.contains('checked')) {
            task.style.display = 'none';
        } else {
            task.style.display = 'flex';
        }
    }
    // const array = [1, 2, 34, 4];
    // for (let i = 0; i < array.length; i++) {
    //     array[i]++;
    // }
    // let j = 0;
    // while (j < array.length) {
    //     array[j]++;
    // }
    // const obj = {
    //     a: 1,
    //     b: 2,
    //     c: 3
    // };
    // for (let key in obj) {
    //     obj[key]++;
    // };


});


formTodo.addEventListener('submit', e => {
    e.preventDefault()
    const text = inputTodo.value.trim();
    if (text !== '') {
        addTask(text);
        inputTodo.value = '';
        inputTodo.focus();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const ref = localStorage.getItem('tasksRef');
    if (ref) {
        initialTasks = JSON.parse(ref);
        initialTasks.forEach(task => renderTodo(task));
        counter(initialTasks);
    }
});

todoList.addEventListener('click', e => {
    if (e.target.classList.contains('js-tick')) {
        const itemKey = e.target.parentElement.dataset.key;
        toggleDone(itemKey);

    }

    if (e.target.classList.contains('delete')) {
        const itemKey = e.target.parentElement.dataset.key;
        deleteTodo(itemKey);
        counter(initialTasks);
    }
})

const deleteTodo = (key) => {
    const index = initialTasks.findIndex(item => item.id === Number(key));
    const todoTask = {
        deleted: true,
        ...initialTasks[index]
    };
    initialTasks = initialTasks.filter(item => item.id !== Number(key));
    renderTodo(todoTask);
}
const addTask = (text) => {
    const todoTask = {
        text,
        checked: false,
        id: Date.now(),
    }
    initialTasks.push(todoTask);
    renderTodo(todoTask);
};
const renderTodo = (todoTask) => {
    localStorage.setItem('tasksRef', JSON.stringify(initialTasks));
    const item = document.querySelector(`[data-key='${todoTask.id}']`);
    if (todoTask.deleted) {
        item && item.remove();
        return;
    }

    const node = document.createElement('li');
    const checkedValue = todoTask.checked ? "checked" : '';
    node.setAttribute('class', `todo-item ${checkedValue}`);
    node.setAttribute('data-key', todoTask.id);
    node.innerHTML = `
        <div>
            <input class="js-tick" id="${todoTask.id}" type="checkbox" ${checkedValue}/>
            <span>${todoTask.text}</span>
        </div>
        <img class="delete" width="15px" height='15px' src='./images/cross.svg' alt="cross-img">

    `;
    const checkbox = node.firstElementChild.firstElementChild;
    checkbox.addEventListener('click', e => {
        let isChecked = e.target.checked;
        if (isChecked) {
            e.target.nextElementSibling.style.textDecoration = 'line-through';
            node.classList.add('checked');
            e.target.classList.add('checked');
        } else {
            node.classList.remove('checked');
            e.target.classList.remove('checked');
            e.target.nextElementSibling.style.textDecoration = 'none';
        }

        const tasksJSON = localStorage.getItem('tasksRef');
        const parsedTasks = JSON.parse(tasksJSON);
        parsedTasks.forEach(task => {
            if (task.id === todoTask.id) {
                task.checked = isChecked;
            }
        });
        counter(parsedTasks);
        localStorage.setItem('tasksRef', JSON.stringify(parsedTasks));
    });
    todoList.append(node);
    if (item) {
        node.replaceWith(item)
    } else {
        todoList.append(node)
    }
    counter(initialTasks);
}
const toggleDone = (key) => {
    const index = initialTasks.findIndex(task => task.id === Number(key));

    const todoTask = {
        deleted: true,
        ...initialTasks[index]
    };
}

const counter = (tasks) => {
    const itemsCounter = tasks.filter(task => !task.checked);
    const count = document.getElementById('todo-left');

    const counterString = itemsCounter.length === 1 ? 'item' : 'items';

    count.innerText = `${itemsCounter.length} ${counterString} left`;
}