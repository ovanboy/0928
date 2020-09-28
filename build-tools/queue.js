class Queue {
    constructor(option) {
        this.pool = [];
        Object.assign(this,option)
    }
    start() {
        this.next()
    }
    add(fn) {
        this.pool.push(() => {
            fn(this.next.bind(this));
        });
    }
    next() {
        this.pool.length ? this.pool.shift()() : this.endCallback &&this.endCallback();
    }
}

module.exports=Queue;