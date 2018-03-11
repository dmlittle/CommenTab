(function () {
'use strict';

function generateComment(details) {

    function generateId() {
        var prefix = 'comment_';
        var length = 6;

        return prefix + Math.random().toString(16).substr(2, length);
    }

    function generateCommentColor() {
        var random = Math.random();
        if (random > 0.66) {
            return 'commentab_yellow';
        } else if (random > 0.33) {
            return 'commentab_green';
        } else {
            return 'commentab_blue';
        }
    }

    function updateCommentStorage () {
        var key = `${TAB_ID}_${COMMENT_ID}`;
        var updateStorage = {};

        updateStorage[key] = {
            id: COMMENT_ID,
            value: textarea.value,
            display: body.style.display,
            color: COMMENT_COLOR,
            position: {
                top: comment.style.top,
                left: comment.style.left
            }
        };

        chrome.storage.local.set(updateStorage);
    }

    var COMMENT_ID = details && details.id || generateId();
    var COMMENT_COLOR = details && details.color || generateCommentColor();

    var comment = document.createElement('div')
    comment.classList.add('commentab');
    comment.classList.add(COMMENT_COLOR);
    comment.style.top = details && details.position && details.position.top || '50px';
    comment.style.left = details && details.position && details.position.left || '50px';

    var header = document.createElement('div');
    header.classList.add('header');

    var closeBtn = document.createElement('span');
    closeBtn.classList.add('closeBtn');

    var minimizeBtn = document.createElement('span');
    minimizeBtn.classList.add('minimizeBtn');

    var body = document.createElement('div');
    body.classList.add('body');
    body.style.display = details && details.display || 'block';

    var textarea = document.createElement('textarea');
    textarea.value = details && details.value || '';
    textarea.autocomplete = "off";
    textarea.autocorrect = "off";
    textarea.autocapitalize = "off";
    textarea.spellcheck = "false";

    chrome.storage.local.get(TAB_ID, function (data) {
        var comments = data[TAB_ID];
        if (COMMENT_ID in comments) {
            return;
        }

        var updateStorage = {};
        updateStorage[TAB_ID] = comments.concat(COMMENT_ID);

        chrome.storage.local.set(updateStorage);
    });

    minimizeBtn.onclick = function () {
        if (body.style.display === 'none'){
            body.style.display = 'block';
        } else {
            body.style.display = 'none';
        }

        updateCommentStorage();
    };

    closeBtn.onclick = function () {
        chrome.storage.local.remove(`${TAB_ID}_${COMMENT_ID}`);
        chrome.storage.local.get(TAB_ID, function (data) {
            var comments = data[TAB_ID];

            var updateStorage = {};
            updateStorage[TAB_ID] = comments.filter(function (comment_id) { return comment_id !== COMMENT_ID });

            chrome.storage.local.set(updateStorage);
        });

        return comment.remove();
    };

    textarea.onkeyup = function () { 
        updateCommentStorage();
    }

    comment.addEventListener('mousedown', function(event) {
        var element = this;
        var initX = element.offsetLeft;
        var initY = element.offsetTop;
        var mousePressX = event.clientX;
        var mousePressY = event.clientY;

        var repositionElement = function (event) {
            element.style.left = initX + event.clientX - mousePressX + 'px';
            element.style.top = initY + event.clientY - mousePressY + 'px';

            updateCommentStorage();
        };

        window.addEventListener('mousemove', repositionElement, false);

        window.addEventListener('mouseup', function() {
          window.removeEventListener('mousemove', repositionElement, false);
        }, false);

    }, false);

    header.appendChild(closeBtn);
    header.appendChild(minimizeBtn);
    body.appendChild(textarea);
    comment.appendChild(header);
    comment.appendChild(body);

    document.body.appendChild(comment);
}

if (ACTION === 'create') {
    generateComment();
} else if (ACTION === 'restore') {
    chrome.storage.local.get(TAB_ID, function (data) {
        var comments = data[TAB_ID].map(function (comment_id) { return `${TAB_ID}_${comment_id}`; });

        chrome.storage.local.get(comments, function (comments) {
            Object.values(comments).forEach(function (c) { generateComment(c); })
        })
    });

}
})();
