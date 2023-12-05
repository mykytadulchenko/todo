export default class Store {
    constructor() {
       this.getTasks()
    }

    getTasks() {
        this.data = JSON.parse(localStorage.getItem('todos')) || []
    }

    setTasks(data) {
        const sortedData = data.sort((a, b) => a.id - b.id)
        localStorage.setItem('todos', JSON.stringify(sortedData))
    }
}