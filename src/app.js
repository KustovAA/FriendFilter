import 'normalize.css';
import './style.scss';

window.onload = () => {
    const leftContainer = document.body.querySelector('.main__left-container');
    const rightContainer = document.body.querySelector('.main__right-container');
    const Friend = require('./scripts/Friend');
    const DragManager = require('./scripts/DragManager');
    const friendList = require('./friends');
    const leftFilter = document.body.querySelector('.head__filters-left');
    const rightFilter = document.body.querySelector('.head__filters-right');

    friendList.forEach(el => {
        const friend = document.createElement('div');
        friend.classList.add('friend');
        friend.classList.add('draggable');
        friend.innerHTML = new Friend(el.name).getTemplate();
        leftContainer.appendChild(friend);
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
            friend.classList.add('draggable');
            friend.innerHTML = new Friend(
                target.closest('.deleteable').querySelector('.friend-name').innerText
            ).getTemplate();
            leftContainer.appendChild(friend);
            this.removeChild(target.parentNode.parentNode);
        }
    });

    document.addEventListener('click', function (event) {
        const target = event.target.closest('.friend');

        if (!target) {
            return;
        }

        const friends = document.body.querySelectorAll('.friend');

        [...friends].forEach(el => el.classList.remove('active'));

        target.classList.add('active');
    });

    function filter(event, container, self) {
        const friends = [...container.querySelectorAll('.friend')];

        friends.forEach(el => {
            const name = el.querySelector('.friend-name').innerText;
            
            if (!isMatching(name, self.value)) {
                el.style.display = 'none';
            } else {
                el.style.display = 'flex';
            }
        });
    }

    leftFilter.addEventListener('keyup', function(e) {
        filter(e, leftContainer, this);
    });

    rightFilter.addEventListener('keyup', function(e) {
        filter(e, rightContainer, this);
    });

    const manager = new DragManager();
    document.onmousemove = manager.onMouseMove.bind(manager);
    document.onmouseup = manager.onMouseUp.bind(manager);
    leftContainer.onmousedown = manager.onMouseDown.bind(manager);

    function isMatching(full, chunk) {
        return full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1;
    }
}