//diff classes for diff creatures

class Todo {
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

    renderItem(data) {
        const item = document.createElement('li')
        const checkContainer = document.createElement('div')
        const checkBody = document.createElement('div')
        const checked = document.createElement('div')
        const text = document.createElement('p')
        if(data.isFinished) {
            checkContainer.classList.add('active')
            text.classList.add('finished')
        }
        const removeBtn = document.createElement('button')
        item.classList.add('list__item')
        checkContainer.classList.add('check__container')
        checkBody.classList.add('check__body')
        checked.classList.add('check__active')
        removeBtn.classList.add('remove-btn')
        text.textContent = data.value
        checkBody.innerHTML = '<i class="fa-regular fa-square fa-sm" style="color: #6988bf;"></i>'
        checked.innerHTML = '<i class="fa-solid fa-check fa-sm" style="color: #6988bf;"></i>'
        removeBtn.innerHTML = '<i class="fa-solid fa-xmark fa-lg" style="color: #ad0000;"></i>'
        const check = () => {
            checkContainer.classList.toggle('active')
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
           checkContainer.removeEventListener('click', check)
        }
        item.addEventListener('dblclick', edit)
        removeBtn.addEventListener('click', remove)
        checkContainer.addEventListener('click', check)
        checkContainer.append(checkBody, checked)
        item.append(checkContainer, text, removeBtn)
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
        domElement.classList.add('editing')
        const editForm = document.createElement('div')
        const input = document.createElement('input')
        input.value = data.value
        editForm.append(input)
        const edit = (e) => {
            if(e.key !== 'Enter') return
            if(input.value && input.value !== data.value) {
                this.tasks = this.tasks.filter(item => item.id !== data.id)
                this.addItem({...data, value: input.value})
            } else {
                this.renderList()
            }
            editForm.removeEventListener('submit', edit)
        }
        editForm.addEventListener('keypress', edit)
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