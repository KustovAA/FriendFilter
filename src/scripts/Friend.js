module.exports = class Friend {
    constructor(name, pic, chosen = false) {
        this.name = name;
        this.chosen = chosen;
        this.pic = pic;
    }

    getTemplate() {
        const pic = this.chosen ? 'minus' : 'plus';
        const className = this.chosen ? 'close' : 'add';
        return `
            <div class="friend-info">
                <img class="friend-photo" src=${this.pic}>
                <div class="friend-name">${this.name}</div>
            </div>
            <div class="${className}">
                <img class="${pic}" src=${require(`./../img/${pic}.png`)}>
            </div>
        `
    }
}