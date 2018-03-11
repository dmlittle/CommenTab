(function () {
'use strict';

function getCommentColor() {
    var random = Math.random();
    if (random > 0.66) {
        return 'commentab_yellow';
    } else if (random > 0.33) {
        return 'commentab_green';
    } else {
        return 'commentab_blue';
    }
}

var comment = document.createElement('div')
comment.classList.add('commentab');
comment.classList.add(getCommentColor());
comment.style.top = '50px';
comment.style.left = '50px';

var header = document.createElement('div');
header.classList.add('header');

var closeBtn = document.createElement('span');
closeBtn.classList.add('closeBtn');

var minimizeBtn = document.createElement('span');
minimizeBtn.classList.add('minimizeBtn');

var body = document.createElement('div');
body.classList.add('body');

var textarea = document.createElement('textarea');
textarea.autocomplete = "off";
textarea.autocorrect = "off";
textarea.autocapitalize = "off";
textarea.spellcheck = "false";

minimizeBtn.onclick = function () {
    if (body.style.display === 'none'){
        return body.style.display = 'block';
    } else {
        return body.style.display = 'none';
    }
};

closeBtn.onclick = function () {
    return comment.remove();
};

comment.addEventListener('mousedown', function(event) {
    var element = this;
    var initX = element.offsetLeft;
    var initY = element.offsetTop;
    var mousePressX = event.clientX;
    var mousePressY = event.clientY;

    var repositionElement = function (event) {
        element.style.left = initX + event.clientX - mousePressX + 'px';
        element.style.top = initY + event.clientY - mousePressY + 'px';
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
})();
