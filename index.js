class Todo {
    constructor(root) {
        this.root = root
        this.tasks = []
    }

    init() {
        this.root.innerHTML = ''
        this.renderScreen()
        this.renderControls()
    }

    renderScreen() {
        this.screen= document.createElement('ul')
        this.screen.classList.add('screen') 
        this.renderList()
        this.root.append(this.screen)
    }

    renderControls() {
        this.controls = document.createElement('form')
        this.controls.classList.add('controls')
        this.controls.append(document.createElement('input'))
        this.controls.addEventListener('submit', (e) => {
        })
        this.root.append(this.controls)
    }

    renderItem(data) {
        const item = document.createElement('li')
        item.classList.add('list__item')
        item.textContent = data.title
        return item
    }

    renderList() {
        this.screen.innerHTML = ''
        const taskElements = this.getTasks().map(data => this.renderItem(data))
        this.screen.append(...taskElements)
    }

    getTasks() {
        const data = JSON.parse(localStorage.getItem('todos')) || []
        return data
    }

    setTasks(data) {
        localStorage.setItem('todos', JSON.stringify(data))
    }
}

const todoList = new Todo(document.querySelector('.app'))
todoList.init()