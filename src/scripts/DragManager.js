module.exports = class DragManager {
    constructor() {
        this.dragObject = {};
        this.getCoords(document.body.querySelector('.main__left'));
    }

    onMouseDown(e) {
        if (e.which != 1) return;

        const elem = e.target.closest('.draggable');
        if (!elem) return;

        this.dragObject.elem = elem;

        // запомним, что элемент нажат на текущих координатах pageX/pageY
        this.dragObject.downX = e.pageX;
        this.dragObject.downY = e.pageY;

        return false;
    }

    onMouseMove(e) {
        if (!this.dragObject.elem) return; // элемент не зажат

        if (!this.dragObject.avatar) { // если перенос не начат...
            const moveX = e.pageX - this.dragObject.downX;
            const moveY = e.pageY - this.dragObject.downY;

            // если мышь передвинулась в нажатом состоянии недостаточно далеко
            if (Math.abs(moveX) < 10 && Math.abs(moveY) < 10) {
                return;
            }

            // начинаем перенос
            this.dragObject.avatar = this.createAvatar(e); // создать аватар
            if (!this.dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
                this.dragObject = {};
                return;
            }

            // аватар создан успешно
            // создать вспомогательные свойства shiftX/shiftY
            const coords = this.getCoords(this.dragObject.avatar);
            this.dragObject.shiftX = this.dragObject.downX - coords.left;
            this.dragObject.shiftY = this.dragObject.downY - coords.top;

            this.startDrag(e); // отобразить начало переноса
        }

        // отобразить перенос объекта при каждом движении мыши
        this.dragObject.avatar.style.left = `${e.pageX - this.dragObject.shiftX}px`;
        this.dragObject.avatar.style.top = `${e.pageY - this.dragObject.shiftY}px`;

        return false;
    }

    onMouseUp(e) {
        console.log('dropElem');
        if (this.dragObject.avatar) { // если перенос идет
            this.finishDrag(e);
        }

        // перенос либо не начинался, либо завершился
        // в любом случае очистим "состояние переноса" dragObject
        this.dragObject = {};
    }

    finishDrag(e) {
        const dropElem = this.findDroppable(e);
        console.log(dropElem);

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

        // инициировать начало переноса
        document.body.appendChild(avatar);
        avatar.style.zIndex = 9999;
        avatar.style.position = 'absolute';
    }

    findDroppable(event) {
        // спрячем переносимый элемент
        this.dragObject.avatar.hidden = true;

        // получить самый вложенный элемент под курсором мыши
        const elem = document.elementFromPoint(event.clientX, event.clientY);

        // показать переносимый элемент обратно
        this.dragObject.avatar.hidden = false;

        if (elem == null) {
            // такое возможно, если курсор мыши "вылетел" за границу окна
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
        // dragObject.elem.innerHTML = new Friend(dragObject.elem.querySelector('.friend-name').innerText, true).getTemplate();
        const old = dragObject.avatar.getOldStyle();
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