document.addEventListener('DOMContentLoaded', ()=> {
    const addButton = document.getElementById('add-btn');
    const taskList = document.getElementById('taskList');
    let tasks = [];
    const taskInput = document.getElementById('taskInput');
    const all = document.getElementById('all');
    const pending = document.getElementById('pending');
    const completed = document.getElementById('completed');
    let filter = '';
    
    // all the comments were actually used for understanding

    addButton.addEventListener('click', (e) => {
            e.preventDefault();
            const taskName = taskInput.value;
            taskInput.value = '';
            fetch('/add-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: taskName })
            }).then(response => response.json()).then(data=> {
                tasks = data;   //updating tasks with the new data
                filterTasks(tasks, filter);
            });
    });

    //getting all the tasks from the server
    async function fetchTasks() {
        const response = await fetch('/app/tasks');
        tasks = await response.json();
        // console.log(`getting all the tasks from the server: ${JSON.stringify(tasks)}`);
        displayAllTheTasks(tasks);
    }

    function displayAllTheTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task=> {
            const list_item = document.createElement('li');
            list_item.textContent = task.name;
            const btnSection = document.createElement('div');
            btnSection.id = 'btn-section';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'action-btn';
            editBtn.onclick = () => editTaskItem(task.id);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'action-btn';
            deleteBtn.onclick = () => deleteTaskItem(task.id);

            const doneBtn = document.createElement('button');
            doneBtn.textContent = 'Done';
            doneBtn.className = 'action-btn';
            doneBtn.onclick = () => setAsCompleted(task.id);

            taskList.appendChild(list_item);
            btnSection.append(editBtn, deleteBtn, doneBtn);
            taskList.appendChild(btnSection);
        });
    }

    function filterTasks(tasks, filter) {
        const filteredTasks = tasks.filter(task=> {
            switch(filter) {
                case 'completed':
                    return task.done === true;
                case 'pending':
                    return task.done === false;
                case 'all':
                    //it has no code so it will go down to the default case by returning all
                    default:
                        return true; //show all tasks by default 
            }
        });
        // console.log(`displayed tasks for ${filter}: ${JSON.stringify(filteredTasks)}`);
        displayAllTheTasks(filteredTasks); 
    }

    async function setAsCompleted(id) {
        const response = await fetch(`/done/tasks/${id}`, {
            method: 'PATCH'
        });

        tasks = await response.json();
        // console.log(`tasks after setting ${id}th number task as completed task: ${JSON.stringify(tasks)}`);
        filterTasks(tasks, filter);
    }

    async function deleteTaskItem(id) {
        // alert(id);
        const response = await fetch(`/delete/tasks/${id}`, {
            method: 'DELETE',
        });

        tasks = await response.json();
        // console.log(`displaying after deleting id ${id}: ${JSON.stringify(tasks)}`);
        // displayAllTheTasks(tasks);
        filterTasks(tasks, filter);
    }

    async function editTaskItem(id) {
        const editedText = prompt("Edit the todo text");
        if(!editedText) {
            console.log('edited text is empty!');
            return;
        }
        const response = await fetch(`/app/tasks/${id}`, { 
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: editedText })
         });
         
        tasks = await response.json();
        // console.log(`displaying after editing id ${id}: ${JSON.stringify(tasks)}`);
        // displayAllTheTasks(tasks);
        filterTasks(tasks, filter);
    }

    all.onclick = () => {
        filter = 'all';
        filterTasks(tasks, filter);
    }

    pending.onclick = () => {
        filter = 'pending';
        filterTasks(tasks, filter);
    }

    completed.onclick = () => {
        filter = 'completed';
        filterTasks(tasks, filter);
    }

    fetchTasks();

});