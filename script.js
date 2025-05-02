const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');
//Create the checkmark SVG
const svgNS = "http://www.w3.org/2000/svg";
const done = document.createElementNS(svgNS, "svg");
done.setAttribute("xmlns", svgNS);
done.setAttribute("height", "24px");
done.setAttribute("viewBox", "0 -960 960 960");
done.setAttribute("width", "24px");
done.setAttribute("fill", "transparent");
const donePath = document.createElementNS(svgNS, "path");
donePath.setAttribute("d", "M379.33-244 154-469.33 201.67-517l177.66 177.67 378.34-378.34L805.33-670l-426 426Z");
done.appendChild(donePath);
//Create the delete SVG
const deleteBtn = document.createElementNS(svgNS, "svg");
deleteBtn.setAttribute("xmlns", svgNS);
deleteBtn.setAttribute("height", "24px");
deleteBtn.setAttribute("viewBox", "0 -960 960 960");
deleteBtn.setAttribute("width", "24px");
deleteBtn.setAttribute("fill", "#fff");
const deletePath = document.createElementNS(svgNS, "path");
deletePath.setAttribute("d", "M267.33-120q-27.5 0-47.08-19.58-19.58-19.59-19.58-47.09V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-328 469.33h66.66v-386h-66.66v386Zm164 0h66.66v-386h-66.66v386ZM267.33-740v553.33V-740Z");
deleteBtn.appendChild(deletePath);

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener('submit', function(e){
    e.preventDefault();
    addTodo();
})

function addTodo(){
    const todoText = todoInput.value.trim();
    if(todoText.length > 0){
        const todoObject = {
            text: todoText,
            completed: false
        };
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
    }    
}

function updateTodoList(){
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex)=>{
        let todoItem = createTodoItem(todo, todoIndex);
        todoListUL.appendChild(todoItem);
    })
}

function createTodoItem(todo, todoIndex){ 
    const todoId = "todo-"+todoIndex;
    // Creating the list element
    const todoLI = document.createElement("li");
    todoLI.className = "todo-list__item";
    // Read the object text
    const todoText = todo.text;
    // Creating the checkbox element inside the list element
    const todoLiInput = document.createElement("input");
    todoLiInput.type = "checkbox"
    todoLiInput.id = todoId;
    todoLiInput.className = "todo-list__item--checkbox";
    // Creating the label holding the checkmark of the list element
    const todoLiLabel = document.createElement("label");
    todoLiLabel.htmlFor = todoId;
    todoLiLabel.id = "todo-list__item__done";
    todoLiLabel.appendChild(done);
    // Creating the label holding the Text
    const todoLiText = document.createElement("label");
    todoLiText.htmlFor = todoId;
    todoLiText.id = "todo-list__item__text";
    todoLiText.innerText = todoText;
    //Creating the Delete button
    const todoLiDelete = document.createElement("button");
    todoLiDelete.className = "todo-list__item__delete";
    todoLiDelete.appendChild(deleteBtn.cloneNode(true));
    // Creating a fragment to append all created elements
    const todoLiFrag = document.createDocumentFragment();
    todoLiFrag.append(todoLiInput, todoLiLabel, todoLiText, todoLiDelete);
    // Then adding the fragment to the list element
    todoLI.append(todoLiFrag);

    // Listening for the Delete button click
    const delButton = todoLI.querySelector(".todo-list__item__delete");
    delButton.addEventListener("click",()=>{
        deleteTodoItem(todoIndex);
    });

    const checkboxStatus = todoLI.querySelector("input");
    checkboxStatus.addEventListener("change",()=>{
        allTodos[todoIndex].completed = checkboxStatus.checked;
        saveTodos();
    });
    checkboxStatus.checked = todo.completed;
    
    return todoLI;
}

function saveTodos(){
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos",todosJson);

}

function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}

function deleteTodoItem(todoIndex){
    allTodos = allTodos.filter((_, i)=> i !== todoIndex);
    saveTodos();
    updateTodoList();
}