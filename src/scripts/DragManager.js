module.exports = class DragManager {
    constructor() {
        this.dragObject = {};
        this.getCoords(document.body.querySelector('.main__left'));
    }

    onMouseDown(e) {
        if (e.which != 1) { 
            return;
        }

        const elem = e.target.closest('.draggable');
        if (!elem) {
            return;
        }

        this.dragObject.elem = elem;

        this.dragObject.downX = e.pageX;
        this.dragObject.downY = e.pageY;

        return false;
    }

    onMouseMove(e) {
        if (!this.dragObject.elem) return;

        if (!this.dragObject.avatar) {
            const moveX = e.pageX - this.dragObject.downX;
            const moveY = e.pageY - this.dragObject.downY;

            if (Math.abs(moveX) < 10 && Math.abs(moveY) < 10) {
                return;
            }

            this.dragObject.avatar = this.createAvatar(e);
            if (!this.dragObject.avatar) {
                this.dragObject = {};
                return;
            }

            const coords = this.getCoords(this.dragObject.avatar);
            this.dragObject.shiftX = this.dragObject.downX - coords.left;
            this.dragObject.shiftY = this.dragObject.downY - coords.top;

            this.startDrag(e);
            console.log(this.dragObject.avatar);
        }

        this.dragObject.avatar.style.left = `${e.pageX - this.dragObject.shiftX}px`;
        this.dragObject.avatar.style.top = `${e.pageY - this.dragObject.shiftY}px`;

        return false;
    }

    onMouseUp(e) {
        if (this.dragObject.avatar) {
            this.finishDrag(e);
        }

        this.dragObject = {};
    }

    finishDrag(e) {
        const dropElem = this.findDroppable(e);

        if (!dropElem) {
            this.onDragCancel(this.dragObject);
        } else {
            this.onDragEnd(this.dragObject, dropElem);
        }
    }

    createAvatar(e) {
        const Friend = require('./Friend');
        const avatar = this.dragObject.elem;

        const old = {
            parent: avatar.parentNode,
            nextSibling: avatar.nextSibling,
            position: avatar.position || '',
            left: avatar.left || '',
            top: avatar.top || '',
            zIndex: avatar.zIndex || '',
            innerHTML: new Friend(avatar.querySelector('.friend-name').innerText).getTemplate()
        };

        avatar.innerHTML = new Friend(avatar.querySelector('.friend-name').innerText, true).getTemplate();

        avatar.getOldStyle = function () {
            return {
                parent: old.parent,
                nextSibling: old.nextSibling,
                position: old.position,
                left: old.left,
                top: old.top,
                zIndex: old.zIndex,
                innerHTML: old.innerHTML
            }
        };

        avatar.rollback = function () {
            old.parent.insertBefore(avatar, old.nextSibling);
            avatar.style.position = old.position;
            avatar.style.left = old.left;
            avatar.style.top = old.top;
            avatar.style.zIndex = old.zIndex
            avatar.innerHTML = old.innerHTML
        };

        return avatar;
    }

    startDrag(e) {
        const avatar = this.dragObject.avatar;

        document.body.appendChild(avatar);
        avatar.style.zIndex = 9999;
        avatar.style.position = 'absolute';
    }

    findDroppable(event) {
        this.dragObject.avatar.hidden = true;
        const elem = document.elementFromPoint(event.clientX, event.clientY);

        this.dragObject.avatar.hidden = false;

        if (elem == null) {
            return null;
        }

        return elem.closest('.droppable');
    }

    getCoords(elem) {
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };

    }

    onDragEnd(dragObject, dropElem) {
        const Friend = require('./Friend');
        const old = dragObject.avatar.getOldStyle();
        dragObject.elem.classList.remove('draggable');
        dragObject.elem.classList.add('deleteable');
        dragObject.elem.style = `
            position: ${old.position};
            left: ${old.left};
            top: ${old.top};
            zIndex: ${old.zIndex};
        `;
        dropElem.appendChild(dragObject.elem);
    };

    onDragCancel(dragObject) {
        dragObject.avatar.rollback();
    }
};