import Utils from "./Utils.js"

export default class ListItem {
    constructor(list, data) {
        this.list = list
        this.elem = null
        this.data = data
    }

    renderItem() {
        this.elem = Utils.createElement('li', 'list__item')
        const checkContainer = Utils.createElement('div', 'check__container')
        const checkBody = Utils.createElement('div', 'check__body')
        const checked = Utils.createElement('div', 'check__active')
        const text = Utils.createElement('p', null, this.data.value)
        const removeBtn = Utils.createElement('button', 'remove-btn')
        if(this.data.isFinished) {
            checkContainer.classList.add('active')
            text.classList.add('finished')
        }
        checkBody.innerHTML = '<i class="fa-regular fa-square fa-sm"></i>'
        checked.innerHTML = '<i class="fa-solid fa-check fa-sm"></i>'
        removeBtn.innerHTML = '<i class="fa-solid fa-xmark fa-lg"></i>'
        const check = () => {
            checkContainer.classList.toggle('active')
            this.list.store.data = this.list.store.data.filter(item => item.id !== this.data.id)
            this.list.addItem({...this.data, isFinished: !this.data.isFinished})
            releaseEventHandlers()
        }
        const edit = () => {
            this.elem.innerHTML = ''
            this.editItem()
            releaseEventHandlers()
        }
        const remove = () => {
            this.removeItem()
            releaseEventHandlers()
        }
        const releaseEventHandlers = () => {
            this.elem.removeEventListener('dblclick', edit)
            removeBtn.removeEventListener('click', remove)
           checkContainer.removeEventListener('click', check)
        }
        this.elem.addEventListener('dblclick', edit)
        removeBtn.addEventListener('click', remove)
        checkContainer.addEventListener('click', check)
        checkContainer.append(checkBody, checked)
        this.elem.append(checkContainer, text, removeBtn)
        return this.elem
    }

    editItem() {
        this.elem.classList.add('editing')
        const editForm = Utils.createElement('div')
        const input = Utils.createElement('input')
        input.value = this.data.value
        input.onblur = () => this.list.renderList()
        const edit = (e) => {
            if(e.key !== 'Enter') return
            if(input.value && input.value !== this.data.value) {
                this.list.store.data = this.list.store.data.filter(item => item.id !== this.data.id)
                this.list.addItem({...this.data, value: input.value})
            } else {
                this.list.renderList()
            }
            editForm.removeEventListener('submit', edit)
        }
        editForm.addEventListener('keypress', edit)
        editForm.append(input)
        this.elem.append(editForm) 
        input.focus()
    }

    removeItem() {
        this.list.store.data = this.list.store.data.filter(item => item.id !== this.data.id)
        this.list.store.setTasks(this.list.store.data)
        this.list.renderList()
    }
}