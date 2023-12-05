export default class ListItem {
    constructor(list, data) {
        this.list = list
        this.elem = null
        this.data = data
    }

    renderItem() {
        this.elem = document.createElement('li')
        const checkContainer = document.createElement('div')
        const checkBody = document.createElement('div')
        const checked = document.createElement('div')
        const text = document.createElement('p')
        if(this.data.isFinished) {
            checkContainer.classList.add('active')
            text.classList.add('finished')
        }
        const removeBtn = document.createElement('button')
        this.elem.classList.add('list__item')
        checkContainer.classList.add('check__container')
        checkBody.classList.add('check__body')
        checked.classList.add('check__active')
        removeBtn.classList.add('remove-btn')
        text.textContent = this.data.value
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
        const editForm = document.createElement('div')
        const input = document.createElement('input')
        input.value = this.data.value
        editForm.append(input)
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
        this.elem.append(editForm) 
        input.focus()
    }

    removeItem() {
        this.list.store.data = this.list.store.data.filter(item => item.id !== this.data.id)
        this.list.store.setTasks(this.list.store.data)
        this.list.renderList()
    }
}