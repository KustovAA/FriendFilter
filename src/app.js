import 'normalize.css';
import './style.scss';

window.onload = () => {
    const leftContainer = document.body.querySelector('.main__left-container');
    const rightContainer = document.body.querySelector('.main__right-container');
    const Friend = require('./scripts/Friend');
    const DragManager = require('./scripts/DragManager');
    const friendList = require('./friends');

    friendList.forEach(el => {
        const friend = document.createElement('div');
        friend.classList.add('friend');
        friend.classList.add('draggable');
        friend.innerHTML = new Friend(el.name).getTemplate();
        leftContainer.appendChild(friend)
    });

    leftContainer.addEventListener('click', function (event) {
        const target = event.target;

        if (target.classList.contains('plus')) {
            const friend = document.createElement('div');
            friend.classList.add('friend');
            friend.classList.add('deleteable');
            friend.innerHTML = new Friend(
                target.closest('.draggable').querySelector('.friend-name').innerText,
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
            friend.classList.add('friend');
            friend.innerHTML = new Friend(
                target.closest('.deleteable').querySelector('.friend-name').innerText
            ).getTemplate();
            leftContainer.appendChild(friend);
            this.removeChild(target.parentNode.parentNode);
        }
    });

    const manager = new DragManager();
    document.onmousemove = manager.onMouseMove.bind(manager);
    rightContainer.onmouseup = manager.onMouseUp.bind(manager);
    leftContainer.onmousedown = manager.onMouseDown.bind(manager);
}