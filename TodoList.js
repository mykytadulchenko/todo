import Store from "./Store.js"
import ListItem from "./ListItem.js"

export default class Todo {
    constructor(root) {
        this.root = root
        this.store = new Store()
        this.unfinishedCount = 0
    }

    init() {
        this.root.innerHTML = ''
        this.renderControls()
        this.renderScreen()
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
        const taskElements = this.store.data.map(data => new ListItem(this, data).renderItem())
        this.screen.append(...taskElements)
    }

    addItem(options) {
        const {id = this.store.data.at(-1)?.id + 1 || 0, value, isFinished = false} = options
        this.store.data.push({id, value, isFinished})
        this.store.setTasks(this.store.data)
        this.renderList()
    }
}