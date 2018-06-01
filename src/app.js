import 'normalize.css';
import './style.scss';

window.onload = () => {
    const leftContainer = document.body.querySelector('.main__left-container');
    const rightContainer = document.body.querySelector('.main__right-container');
    const Friend = require('./scripts/Friend');
    const DragManager = require('./scripts/DragManager');
    const leftFilter = document.body.querySelector('.head__filters-left');
    const rightFilter = document.body.querySelector('.head__filters-right');
    const storage = localStorage;
    const save = document.body.querySelector('.content__foot-save');

    VK.init({
        apiId: 6496849
    });

    function auth() {
        return new Promise((resolve, reject) => {
            VK.Auth.login(data => {
                if (data.session) {
                    resolve();
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, 2);
        });
    }

    function callAPI(method, params) {
        params.v = '5.76';

        return new Promise((resolve, reject) => {
            VK.api(method, params, (data) => {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data.response);
                }
            });
        })
    }

    auth()
        .then(() => {
            return callAPI('friends.get', { fields: 'photo_100' });
        })
        .then(friends => {
            const friendList = [...friends.items];

            if (storage.data) {
                const leftList = JSON.parse(storage.data).leftList;
                const rightList = JSON.parse(storage.data).rightList;

                leftList.forEach(el => {
                    const friend = document.createElement('div');
                    friend.classList.add('friend');
                    friend.classList.add('draggable');
                    friend.innerHTML = new Friend(el.name, el.photo).getTemplate();
                    leftContainer.appendChild(friend);
                });

                rightList.forEach(el => {
                    const friend = document.createElement('div');
                    friend.classList.add('friend');
                    friend.classList.add('deleteable');
                    friend.innerHTML = new Friend(el.name, el.photo, true).getTemplate();
                    rightContainer.appendChild(friend);
                });
            } else {
                friendList.forEach(el => {
                    const friend = document.createElement('div');
                    friend.classList.add('friend');
                    friend.classList.add('draggable');
                    friend.innerHTML = new Friend(`${el.first_name} ${el.last_name}`, el.photo_100).getTemplate();
                    leftContainer.appendChild(friend);
                });
            }

            // friendList.forEach(el => {
            //     const friend = document.createElement('div');
            //     friend.classList.add('friend');
            //     friend.classList.add('draggable');
            //     friend.innerHTML = new Friend(`${el.first_name} ${el.last_name}`, el.photo_100).getTemplate();
            //     leftContainer.appendChild(friend);
            // });
            
        });    

    leftContainer.addEventListener('click', function (event) {
        const target = event.target;

        if (target.classList.contains('plus')) {
            const friend = document.createElement('div');
            friend.classList.add('friend');
            friend.classList.add('deleteable');
            friend.innerHTML = new Friend(
                target.closest('.draggable').querySelector('.friend-name').innerText,
                target.closest('.draggable').querySelector('.friend-photo').src, 
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
                target.closest('.deleteable').querySelector('.friend-name').innerText, 
                target.closest('.deleteable').querySelector('.friend-photo').src
            ).getTemplate();
            leftContainer.appendChild(friend);
            this.removeChild(target.parentNode.parentNode);
        }
    });

    save.addEventListener('click', e => {
        const leftList = [...leftContainer.querySelectorAll('.friend')]
                                .map(el => {
                                    return {
                                        name: el.querySelector('.friend-name').innerText, 
                                        photo: el.querySelector('.friend-photo').src
                                    }
                                });
        const rightList = [...rightContainer.querySelectorAll('.friend')]
                                .map(el => {
                                    return {
                                        name: el.querySelector('.friend-name').innerText, 
                                        photo: el.querySelector('.friend-photo').src
                                    }
                                });
        storage.data = JSON.stringify({
            leftList, 
            rightList
        });
    })

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

    leftFilter.addEventListener('keyup', function (e) {
        filter(e, leftContainer, this);
    });

    rightFilter.addEventListener('keyup', function (e) {
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