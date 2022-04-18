const form = document.querySelector('form');
const input = document.querySelector('[name="todo"]')
const list = document.querySelector('ul');
const emptyStateElement = document.querySelector('.empty');

// All stored values in the localStorage.
const storedValues = JSON.parse(localStorage.getItem('todos'));

// Array that holds existing data or an empty array when no stored data is available.
let data = storedValues || [];

/**
 * Returns an index for a random element from an array.
 * 
 * @param {*} arr the targeted array.
 * @returns Number
 */
const getRandomElement = (arr) => Math.floor(Math.random() * arr.length);

/**
 * Creates a list item that appends to a list.
 * 
 * @param {*} target the parent list.
 * @param {*} value the text content that the todo holds.
 */
const createListItem = (target, value) => {
    const listItem = document.createElement('li');
    listItem.classList.add('todo-item');
    listItem.textContent = Object.values(value)[0];
    listItem.appendChild(createCompleteButton(listItem, value));
    listItem.appendChild(createDeleteButton(listItem, value));

    if (Object.values(value)[1]) {
        listItem.classList.add('completed-card');
    }

    target.appendChild(listItem);
}

/**
 * Creates a complete button that holds an event listener when clicked. 
 * Sets the complete key value to true or false when clicked.
 * 
 * @param {*} parent the parent of the complete button.
 * @param {*} value the text content that the todo holds.
 * @returns Complete Button
 */
const createCompleteButton = (parent, value) => {
    const completeButton = document.createElement('a');
    completeButton.classList.add('complete-button');
    completeButton.textContent = 'Complete';

    completeButton.addEventListener('click', () => {
        const currentItem = Object(data.filter((event) => event === value)[0]); // Filters the data array from the current value.
        const newItem = currentItem; // Create a new item to replace the current one in the data array.

        !newItem.completed ? newItem.completed = true : newItem.completed = false; // Checks the current value.

        data[data.indexOf(currentItem)] = newItem;
        localStorage.setItem('todos', JSON.stringify(data)); // Updates the local storage with the new dataset.

        parent.classList.toggle('completed-card');
    });

    return completeButton;
}

/**
 * Creates a delete button that holds an event listener when clicked. 
 * Deletes the whole list item when clicked.
 * 
 * @param {*} parent the parent of the delete button.
 * @param {*} value the text content that the todo holds.
 * @returns Delete Button
 */
const createDeleteButton = (parent, value) => {
    const deleteButton = document.createElement('a');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';

    deleteButton.addEventListener('click', () => {
        parent.parentNode.removeChild(parent); // Removes list item element from the list.
        data = data.filter((event) => event !== value); // Filters the data array from the current value.
        localStorage.setItem('todos', JSON.stringify(data)); // Updates the local storage with the new dataset.
        emptyState(data);
    });

    return deleteButton;
}

/**
 * Adds an item to the existing data array and localStorage.
 * 
 * @param {*} item the item that will be added. 
 */
const addItem = (item) => {
    if (item !== '') { // Checks if value is not empty.
        const todo = { todo: item, completed: false }
        data.push(todo);
        createListItem(list, todo);
        localStorage.setItem('todos', JSON.stringify(data));
        emptyState(data);
    } else {
        form.classList.toggle('error');
        input.classList.toggle('error');

        setTimeout(() => {
            form.classList.toggle('error');
            input.classList.toggle('error');
        }, 3500);
    }
}

/**
 * Toggles the empty state item by checking if there are no todos. 
 * 
 * @param {*} arr array that holds the todo data
 */
const emptyState = (arr) => {
    if (Array.isArray(arr) && !arr.length) {
        emptyStateElement.classList.remove('hidden');
    } else {
        emptyStateElement.classList.add('hidden');
    }
}

/**
 * Sets a new placeholder for the input field. Loads the text from a local JSON file.
 */
const setNewPlaceholder = () => {
    fetch("good_promises.json")
        .then(response => response.json())
        .then(jsonData => {
            input.placeholder = Object.values(jsonData[getRandomElement(jsonData)])[0].toLowerCase();
        });
};

// Creates a list item for each existing item on the localStorage on runtime and checks for empty state
document.addEventListener('DOMContentLoaded', () => {
    data.forEach(todo => {
        createListItem(list, todo);
    });

    emptyState(data);
});

// Sets a new placeholder on input click
input.addEventListener('click', () => {
    setNewPlaceholder();
});

// Handles the form when submitted
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents page from reloading
    addItem(input.value);
    form.reset(); // Resets text input field on submit
});