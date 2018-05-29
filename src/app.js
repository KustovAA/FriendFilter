import 'normalize.css';
import './style.scss';

window.onload = () => {
    const leftContainer = document.body.querySelector('.main__left-container');
    const rightContainer = document.body.querySelector('.main__right-container');
    const Friend = require('./scripts/Friend');
    const friendList = require('./friends');

    friendList.forEach(el => {
        const friend = document.createElement('div');
        friend.classList.add('friend draggable');
        friend.innerHTML = new Friend(el.name).getTemplate();
        leftContainer.appendChild(friend)
    });

    leftContainer.addEventListener('click', function (event) {
        const target = event.target;

        if (target.classList.contains('plus')) {
            const friend = document.createElement('div');
            friend.classList.add('friend draggable');
            friend.innerHTML = new Friend(
                target.parentNode.parentNode.querySelector('.friend-name').innerText,
                true
            ).getTemplate();
            rightContainer.appendChild(friend);
            this.removeChild(target.parentNode.parentNode);
        }
    });

    rightContainer.addEventListener('click', function (event) {
        const target = event.target;

        if (target.classList.contains('minus')) {
            const friend = document.createElement('div');
            friend.classList.add('friend draggable');
            friend.innerHTML = new Friend(
                target.parentNode.parentNode.querySelector('.friend-name').innerText
            ).getTemplate();
            leftContainer.appendChild(friend);
            this.removeChild(target.parentNode.parentNode);
        }
    });

    // var ball = document.getElementById('ball');
    // ball.onmousedown = 

    function getCoords(elem) {
        var box = elem.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }

    const dragObject = {};

    function mousedown(e) {
        if (e.which !== 1) {
            return;
        }

        const elem = e.target.closest('.draggable');

        if (!elem) {
            return;
        }

        dragObject.elem = elem;

        dragObject.downX = e.pageX;
        dragObject.downY = e.pageY;
    }

    function mousemove(e) {
        if (!dragObject.elem) {
            return;
        }

        if (!dragObject.avatar) {

            const moveX = e.pageX - dragObject.downX;
            const moveY = e.pageY - dragObject.downY;
            if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
                return;
            }

            dragObject.avatar = createAvatar(e);
            if (!dragObject.avatar) {
                dragObject = {};
                return;
            }

            const coords = getCoords(dragObject.avatar);
            dragObject.shiftX = dragObject.downX - coords.left;
            dragObject.shiftY = dragObject.downY - coords.top;

            startDrag(e);
        }

        dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
        dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

        return false;
    }

    function createAvatar(e) {
        const avatar = dragObject.elem;
        const old = {
            parent: avatar.parentNode,
            nextSibling: avatar.nextSibling,
            position: avatar.position || '',
            left: avatar.left || '',
            top: avatar.top || '',
            zIndex: avatar.zIndex || ''
        };

        avatar.rollback = function () {
            old.parent.insertBefore(avatar, old.nextSibling);
            avatar.style.position = old.position;
            avatar.style.left = old.left;
            avatar.style.top = old.top;
            avatar.style.zIndex = old.zIndex
        };

        return avatar;
    }

    function startDrag(e) {
        const avatar = dragObject.avatar;

        document.body.appendChild(avatar);
        avatar.style.zIndex = 9999;
        avatar.style.position = 'absolute';
    }

    function mouseup(e) {
        if (dragObject.avatar) {
            finishDrag(e);
        }

        dragObject = {};
    }

    // function finishDrag(e) {
    //     const dropElem = findDroppable(e);

    //     if (dropElem) {
    //       ...успешный перенос ...
    //     } else {
    //       ...отмена переноса ...
    //     }
    // }

    function findDroppable(e) {

        const elem = document.elementFromPoint(e.clientX, e.clientY);

        return elem.closest('.droppable');
    }
}