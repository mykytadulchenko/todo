import Store from "./Store.js"
import ListItem from "./ListItem.js"

export default class Todo {
    constructor(root) {
        this.root = root
        this.store = new Store()
        this.filter = null
    }

    init() {
        this.root.innerHTML = ''
        this.renderControls()
        this.renderScreen()
        this.renderFilters()
        if(!this.store.data.length) {
          this.filters.classList.add('hidden')  
        }
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

    renderFilters() {
        this.filters = document.createElement('div')
        this.filters.classList.add('footer')
        const activeTasksCounter = document.createElement('div')
        activeTasksCounter.classList.add('task-counter')
        activeTasksCounter.textContent = `${this.activeTasksCounter} tasks left`
        const filterContainer = document.createElement('div')
        filterContainer.classList.add('filters')
        const filterFinishedBtn = document.createElement('button')
        const filterActiveBtn = document.createElement('button')
        const filterAllBtn = document.createElement('button')
        filterFinishedBtn.textContent = 'Finished'
        filterActiveBtn.textContent = 'Active'
        filterAllBtn.textContent = 'All'
        filterFinishedBtn.dataset.status = 'finished'
        filterActiveBtn.dataset.status = 'active'
        filterContainer.addEventListener('click', (e) => {
            if(e.target.tagName !== "BUTTON") return
            switch(e.target.dataset.status) {
                case 'finished': this.filter = true
                break
                case 'active': this.filter = false
                break
                default: this.filter = null
            }
            this.renderList()
        })
        filterContainer.append(filterAllBtn, filterActiveBtn, filterFinishedBtn)
        this.filters.append(activeTasksCounter, filterContainer)
        this.root.append(this.filters)
    }

    renderList() {
        this.screen.innerHTML = ''
        if(!this.store.data.length) {
            this.filters?.classList.add('hidden')
        } else {
            this.filters?.classList.remove('hidden')
        }
        let taskCounter = 0
        let filterData = this.store.data
        if(this.filter !== null) {
            filterData = filterData.filter(el => el.isFinished === this.filter)
        }
        const taskElements = filterData.map(data => {
            if(!data.isFinished) {
                taskCounter++
            }
            return new ListItem(this, data).renderItem()
        })
        this.screen.append(...taskElements)
        if(this.activeTaskCounter !== taskCounter) {
            this.changeCounter(taskCounter)
        } 
    }

    changeCounter(value) {
        this.activeTasksCounter = value
        if(!this.filters) return
        this.filters.children[0].textContent = `${this.activeTasksCounter} tasks left`
    }

    addItem(options) {
        const {id = this.store.data.at(-1)?.id + 1 || 0, value, isFinished = false} = options
        this.store.data.push({id, value, isFinished})
        this.store.setTasks(this.store.data)
        this.renderList()
    }
}