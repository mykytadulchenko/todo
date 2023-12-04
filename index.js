class Todo {
    constructor(root) {
        this.root = root
        this.tasks = null
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
        const input = document.createElement('input')
        input.placeholder = 'Input task...'
        this.controls.append(input)
        this.controls.addEventListener('submit', (e) => {
            e.preventDefault()
            if(!input.value) return
            this.addItem({value: input.value})
        })
        this.root.append(this.controls)
    }

    renderItem(data) {
        const item = document.createElement('li')
        const checkbox = document.createElement('input')
        const text = document.createElement('p')
        if(data.isFinished) text.style.textDecoration = 'line-through'
        const removeBtn = document.createElement('button')
        item.classList.add('list__item')
        checkbox.type = 'checkbox'
        checkbox.checked = data.isFinished
        text.textContent = data.value
        removeBtn.textContent = 'X'
        const check = () => {
            this.tasks = this.tasks.filter(item => item.id !== data.id)
            this.addItem({...data, isFinished: !data.isFinished})
            releaseEventHandlers()
        }
        const edit = () => {
            item.innerHTML = ''
            this.editItem(item, data)
            releaseEventHandlers()
        }
        const remove = () => {
            this.removeItem(data)
            releaseEventHandlers()
        }
        const releaseEventHandlers = () => {
            item.removeEventListener('dblclick', edit)
            removeBtn.removeEventListener('click', remove)
            checkbox.removeEventListener('change', check)
        }
        item.addEventListener('dblclick', edit)
        removeBtn.addEventListener('click', remove)
        checkbox.addEventListener('change', check)
        item.append(checkbox, text, removeBtn)
        return item
    }

    renderList() {
        this.screen.innerHTML = ''
        const taskElements = (this.tasks ? this.tasks : this.getTasks()).map(data => this.renderItem(data))
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

    editItem(domElement, data) {
        const editForm = document.createElement('form')
        const input = document.createElement('input')
        input.value = data.value
        editForm.append(input)
        const edit = (e) => {
            e.preventDefault()
            if(input.value && input.value !== data.value) {
                this.tasks = this.tasks.filter(item => item.id !== data.id)
                this.addItem({...data, value: input.value})
            } else {
                this.renderList()
            }
            editForm.removeEventListener('submit', edit)
        }
        editForm.addEventListener('submit', edit)
        domElement.append(editForm) 
        input.focus()
    }

    removeItem(data) {
        this.tasks = this.tasks.filter(item => item.id !== data.id)
        this.setTasks(this.tasks)
        this.renderList()
    }
}

const todoList = new Todo(document.querySelector('.app'))
todoList.init()