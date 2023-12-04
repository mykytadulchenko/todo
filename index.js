class Todo {
    constructor(root) {
        this.root = root
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
            this.addItem(input.value)
        })
        this.root.append(this.controls)
    }

    renderItem(data) {
        const item = document.createElement('li')
        item.classList.add('list__item')
        item.textContent = data.value
        item.addEventListener('dblclick', () => {
            item.innerHTML = ''
            this.editItem(item, data)
        })
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

    addItem(value) {
        const data = this.getTasks()
        data.push({id: data.at(-1)?.id + 1 || 0, value: value, isFinished: false})
        this.setTasks(data)
        this.renderList()
    }

    editItem(domElement, data) {
        const editForm = document.createElement('form')
        const input = document.createElement('input')
        input.value = data.value
        editForm.append(input)
        const onSuccess = () => {
            const filteredData = this.getTasks().filter(item => item.id !== data.id)
            this.setTasks(filteredData)
            this.addItem(input.value)
        }
        editForm.addEventListener('submit', (e) => {
            e.preventDefault()
            if(input.value && input.value !== data.value) onSuccess()
            else this.renderList()
        })
        domElement.append(editForm) 
        input.focus()
    }

    removeItem(data) {
        const filteredData = this.getTasks().filter(item => item.id !== data.id)
        this.setTasks(filteredData)
    }
}

const todoList = new Todo(document.querySelector('.app'))
todoList.init()