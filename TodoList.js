import ListItem from "./ListItem.js"

export default class Todo {
    constructor(root) {
        this.root = root
        this.tasks = null
        this.unfinishedCount = 0
    }

    init() {
        this.root.innerHTML = ''
        this.renderScreen()
        this.renderControls()
    }

    renderScreen() {
        this.screen = document.createElement('ul')
        this.screen.classList.add('screen') 
        this.renderList()
        this.root.append(this.screen)
    }

    renderControls() {
        this.controls = document.createElement('div')
        this.controls.classList.add('controls')
        const input = document.createElement('input')
        input.placeholder = 'Input task...'
        this.controls.append(input)
        this.controls.addEventListener('keypress', (e) => {
            if(!input.value || e.key != 'Enter') return
            this.addItem({value: input.value})
            input.value = ''
        })
        this.root.append(this.controls)
    }

    renderList() {
        this.screen.innerHTML = ''
        const taskElements = (this.tasks ? this.tasks : this.getTasks()).map(data => new ListItem(this, data).renderItem())
        this.screen.append(...taskElements)
    }

    getTasks() {
        this.tasks = JSON.parse(localStorage.getItem('todos')) || []
        return this.tasks
    }

    setTasks(data) {
        const sortedData = data.sort((a, b) => a.id - b.id)
        localStorage.setItem('todos', JSON.stringify(sortedData))
    }

    addItem(options) {
        const {id = this.tasks.at(-1)?.id + 1 || 0, value, isFinished = false} = options
        this.tasks.push({id, value, isFinished})
        this.setTasks(this.tasks)
        this.renderList()
    }
}