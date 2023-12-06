import Utils from "./Utils.js"
import Store from "./Store.js"
import ListItem from "./ListItem.js"

export default class Todo {
    constructor(root) {
        this.root = root
        this.store = new Store()
        this.filter = null
        this.selectedAll = false
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
        this.screen = Utils.createElement('ul', 'screen')
        this.renderList()
        this.root.append(this.screen)
    }

    renderControls() {
        this.controls = Utils.createElement('div', 'controls')
        const selectAllBtn = Utils.createElement('button')
        selectAllBtn.innerHTML = '<i class="fa-solid fa-check-double"></i>'
        selectAllBtn.addEventListener('click', () => {
            this.selectedAll = !this.selectedAll
            this.store.data = this.store.data.map(el => ({...el, isFinished: this.selectedAll}))
            this.store.setTasks(this.store.data)
            this.renderList()
        })
        const input = Utils.createElement('input')
        input.placeholder = 'Input task...'
        this.controls.append(selectAllBtn, input)
        this.controls.addEventListener('keypress', (e) => {
            if(!input.value || e.key != 'Enter') return
            this.addItem({value: input.value})
            input.value = ''
        })
        this.root.append(this.controls)
    }

    renderFilters() {
        this.filters = Utils.createElement('div', 'footer')
        const activeTasksCounter = Utils.createElement('div', 'task-counter', `${this.activeTasksCounter} tasks left`)
        const filterContainer = Utils.createElement('div', 'filters')
        const filterFinishedBtn = Utils.createElement('button', null, 'Finished')
        const filterActiveBtn = Utils.createElement('button', null, 'Active')
        const filterAllBtn = Utils.createElement('button', null, 'All')
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
        filterData.forEach(el => {
            if(!el.isFinished) taskCounter++
        })
        if(this.filter !== null) {
            filterData = filterData.filter(el => el.isFinished === this.filter)
        }
        const taskElements = filterData.map(data => {
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