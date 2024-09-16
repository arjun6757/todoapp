import express from "express";
import bodyParser from "body-parser";
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

const tasks = [
    { id: 1, name: 'snacks and chill', done: false},
    { id: 2, name: 'time to work', done: true}
];

app.get('/app/tasks', (req, res)=> {
    res.json(tasks);
});

app.post('/add-task', (req, res) => {
    const task = {
        id: tasks.length+1,
        name: req.body.name || 'empty',
        done: false
    };
    tasks.push(task);
    res.json(tasks);
});

app.get('/', (req, res) => {
    res.render("main.ejs");
});

//put is used where updating is required

app.patch('/app/tasks/:id', (req, res)=> {  //patch is used for minor changes (not the entire task i mean)
    const ID = Number(req.params.id);
    const task = tasks.find(t=> t.id === ID);   // it returns a single element unlike .filter which returns an array

    if(task) {
        task.name = req.body.name;
    }
    else {
        console.log('task not found!')
    }

    res.json(tasks);
});

app.patch('/done/tasks/:id', (req, res)=> {
    const ID = parseInt(req.params.id);
    // so i need to set done as true for it to work ? no i need one additional method to actually filter next time
    const index = tasks.findIndex(t=> t.id === ID);
    //now i need to set the new status
    if(index >= 0 && index < tasks.length){
        tasks[index].done = true;
    }

    //returning the updated tasks
    res.json(tasks);
});

app.delete('/delete/tasks/:id', (req, res) => {
    const ID = parseInt(req.params.id);
    // console.log(ID);
    const index = tasks.findIndex(i=> i.id === ID);
    console.log(`delete index: ${index}`);
    if(index != -1) {
        tasks.splice(index, 1); //deleting one element at INDEX: index;
    } else {
        console.log('invalid index!');
    }
    res.json(tasks);    //sending the updated array so i can display
});

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}.`);
});
