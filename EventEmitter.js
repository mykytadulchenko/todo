export default class EventEmitter {
    subscribers = {}

    subscribe(event, callback) {
        if(!this.subscribers[event]) this.subscribers[event] = []
        this.subscribers[event].push(callback)
    }

    emit(event, ...args) {
        if(!this.subscribers[event]) return
        this.subscribers[event].forEach(cb =>  cb(...args))
    } 

    unsubscribe(event, callback) {
        if(!this.subscribers[event]) return
        this.subscribers[event] = thi.subscribers[event].filter(cb => cb !== callback)
    }

    remove(event) {
        delete this.subscribers[event]
    }
}