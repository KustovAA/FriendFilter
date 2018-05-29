module.exports = class Friend {
    constructor(name, chosen = false) {
        this.name = name;
        this.chosen = chosen;
    }

    getTemplate() {
        const pic = this.chosen ? 'minus' : 'plus';
        const className = this.chosen ? 'close' : 'add';
        return `
            <div class="friend-info"><img class="friend-photo" src=${require(`./../img/Avatar.png`)}>
                <div class="friend-name">${this.name}</div>
            </div>
            <div class="${className}">
                <img class="${pic}" src=${require(`./../img/${pic}.png`)}>
            </div>
        `
    }
}