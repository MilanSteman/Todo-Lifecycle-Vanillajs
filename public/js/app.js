const form = document.querySelector('form');
const input = document.querySelector('[name="todo"]')
const list = document.querySelector('ul');

// All stored values in the localStorage
const storedValues = JSON.parse(localStorage.getItem('todos'));

// Array that holds existing data
let data = storedValues || [];

/**
 * Creates a list item that appends to a list.
 * 
 * @param {*} target the parent list.
 * @param {*} value the text content that the todo holds.
 */
const createListItem = (target, value) => {
    const listItem = document.createElement('li');
    listItem.classList.add('todo-item');
    listItem.textContent = value;
    listItem.appendChild(createDeleteButton(listItem, value));
    target.appendChild(listItem);
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
        data.push(item);
        createListItem(list, item);
        localStorage.setItem('todos', JSON.stringify(data));
    }
}

// Creates a list item for each existing item on the localStorage on runtime
document.addEventListener('DOMContentLoaded', () => {
    data.forEach(todo => {
        createListItem(list, todo);
    });
});

// Handles the form when submitted
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents page from reloading
    addItem(input.value);
    form.reset(); // Resets text input field on submit
});
