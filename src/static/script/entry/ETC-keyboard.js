(function (w) {
    var window = w;
    var document = window.document;
    var DELETE_EVENT = 'keyboard-delete-event';
    var COMPLETE_EVENT = 'keyboard-complete-event';
    var INPUT_EVENT = 'keyboard-input-event';
    var OPEN_EVENT = 'keyboard-open-event';
    var CLOSE_EVENT = 'keyboard-close-event';
    var PListObj = {
        '0': ['京', '沪', '粤', '津', '冀', '晋', '蒙', '辽', '吉', '黑'],
        '1': ['苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘'],
        '2': ['桂', '琼', '渝', '川', '贵', '云', '藏'],
        '3': ['陕', '甘', '青', '宁', '新'],
        length: 4
    };

    var LNListObj = {
        '0': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        '1': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
        '2': ['L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U'],
        '3': ['V', 'W', 'X', 'Y', 'Z'],
        length: 4
    };
    var _DISTANCE = 8; //默认输入框和键盘之间的间距
    var bindingElement;
    var scrollElement;
    var scrollSpacerHeight;

    var contType;

    _initDOM();

    _initListeners();

    function _initDOM() {
        var keyboardPanel = createElement('div', {class: 'keyboard-panel close-panel keyboard-hide keyboard-type-p'});//keyboard-type-n //keyboard-type-l //keyboard-type-p
        var doneBtn = createElement('div', {class: 'keyboard-complete-btn'});
        doneBtn.innerHTML = '完成';
        keyboardPanel.appendChild(doneBtn);

        //创建省份键盘
        var mainCont = createElement('div', {class: 'keyboard-main-cont p-type'});
        keyboardPanel.appendChild(mainCont);
        for (var i=0, len = PListObj.length;i<len;i++) {
            var keyboardRow = createElement('div', {class: 'keyboard-row'});
            var rowDataList = PListObj[i];
            for (var j=0,_len=rowDataList.length;j<_len;j++) {
                var keyboardCell = createElement('div', {class: 'keyboard-cell', 'data-val': rowDataList[j]});
                var label = createElement('span', {class: 'label-text'});
                label.innerHTML = rowDataList[j];
                keyboardCell.appendChild(label);
                keyboardRow.appendChild(keyboardCell);
            }
            if (i == len - 1) {
                var deleteBtn = createElement('div', {class: 'keyboard-delete-btn'});
                keyboardRow.appendChild(deleteBtn);
            }
            mainCont.appendChild(keyboardRow);
        }

        //创建字母数字键盘
        var mainCont = createElement('div', {class: 'keyboard-main-cont letter-number-type'});
        keyboardPanel.appendChild(mainCont);
        for (var i=0, len = LNListObj.length;i<len;i++) {
            var keyboardRow = createElement('div', {class: 'keyboard-row'});
            var rowDataList = LNListObj[i];
            for (var j=0,_len=rowDataList.length;j<_len;j++) {
                var keyboardCell = createElement('div', {class: 'keyboard-cell', 'data-val': rowDataList[j]});
                var label = createElement('span', {class: 'label-text'});
                label.innerHTML = rowDataList[j];
                keyboardCell.appendChild(label);
                keyboardRow.appendChild(keyboardCell);
            }
            if (i == len - 1) {
                var deleteBtn = createElement('div', {class: 'keyboard-delete-btn'});
                keyboardRow.appendChild(deleteBtn);
            }
            mainCont.appendChild(keyboardRow);
        }
        document.querySelector('body').appendChild(keyboardPanel)
    }

    function _initListeners() {
        var listDel = document.querySelectorAll('.keyboard-delete-btn');
        for(var i=0,len=listDel.length;i<len;i++){
            var item = listDel[i];
            item.addEventListener('click', deleteHandler);
        }
        document.querySelector('.keyboard-complete-btn').addEventListener('click', completeHandler);
        var listRow = document.querySelectorAll('.keyboard-row');
        for(var i=0,len=listRow.length;i<len;i++){
            var item = listRow[i];
            item.addEventListener('click', cellClickHandler);
        }
    }

    function initScrollContData() {
        if (contType == 'pop') {
            var scrollele = document.querySelector(scrollElement);
            scrollele.style.transition = 'height 0.15s ease-out';
            var styles = window.getComputedStyle(scrollele);
            scrollele.style.height = styles['height'];
        }
    }

    function deleteHandler() {
        dispatchEventHandler(DELETE_EVENT);
    }

    function completeHandler() {
        dispatchEventHandler(COMPLETE_EVENT);
        hideKeyBoard();
    }

    function cellClickHandler(e) {
        var ele = getElement(getEventTarget(e), 'keyboard-cell');
        if (ele) {
            dispatchEventHandler(INPUT_EVENT, {value: ele.getAttribute('data-val')});
        }
    }

    function inputBoxFocusHandler(e) {
        var ele = getElement(getEventTarget(e), 'ETC-input-box');
        if (ele) {
            keyBoardPanelOpend();
        }
    }

    function getElement(ele, className) {
        var classList = ele.classList;
        for (var i=0,len=classList.length;i<len;i++) {
            if (classList[i] == className) {
                return ele;
            }
        }
        var parentEle = ele.parentElement;
        while (parentEle) {
            classList = parentEle.classList;
            for (var i=0,len=classList.length;i<len;i++) {
                if (classList[i] == className) {
                    return parentEle;
                }
            }
            parentEle = parentEle.parentElement;
        }
        return null;
    }

    function dispatchEventHandler(eventName, option) {
        var e = new Event(eventName);
        e.data = option;
        document.querySelector(bindingElement).dispatchEvent(e);
    }

    function getEventTarget(e) {
        e = e || window.event;
        return e.target || e.srcElement;
    }

    function createElement(type, options) {
        var ele = document.createElement(type);
        if (options) {
            var keys = Object.keys(options);
            for (var i=0,len=keys.length;i<len;i++) {
                var key = keys[i];
                ele.setAttribute(key, options[key]);
            }
        }
        return ele;
    }

    function hideKeyBoard() {
        var panel = document.querySelector('.keyboard-panel');
        panel.classList.remove('open-panel');
        panel.classList.add('close-panel');
        var t = setTimeout(function () {
            panel.classList.add('keyboard-hide');
            clearTimeout(t);
            t = null;
            dispatchEventHandler(CLOSE_EVENT);
            autoScrollDownHandler();
        }, 350);
    }

    function showKeyBoard() {
        var panel = document.querySelector('.keyboard-panel');
        panel.classList.remove('keyboard-hide');
        panel.classList.remove('close-panel');
        panel.classList.add('open-panel');
        var t = setTimeout(function () {
            dispatchEventHandler(OPEN_EVENT);
            clearTimeout(t);
            t = null;
            autoScrollUpHandler();
        }, 500);
    }

    function keyBoardPanelOpend() {
        var panel = document.querySelector('.keyboard-panel');
        if (panel.classList.contains('open-panel')) {
            return ;
        } else {
            showKeyBoard();
        }
    }

    function triggerByEle(ele) {
        var typeVal = ele.getAttribute('data-required-type');
        var panel = document.querySelector('.keyboard-panel');
        var classList = panel.classList;
        if (!classList.contains('keyboard-type-' + typeVal)) {
            panel.classList.add('keyboard-type-' + typeVal);
            switch (typeVal) {
                case 'p':
                    panel.classList.remove('keyboard-type-l');
                    panel.classList.remove('keyboard-type-n');
                    break;
                case 'l':
                    panel.classList.remove('keyboard-type-p');
                    panel.classList.remove('keyboard-type-n');
                    break;
                case 'n':
                    panel.classList.remove('keyboard-type-p');
                    panel.classList.remove('keyboard-type-l');
                    break;
            }
        }
    }

    function autoScrollUpHandler() {
       if (scrollElement) {
           var scrollele = document.querySelector(scrollElement);
           var distance = getDisTance(bindingElement, '.keyboard-panel');
           if (distance < _DISTANCE) {
               scrollSpacerHeight = _DISTANCE - distance;
               if (contType == 'pop') {
                   var styles = window.getComputedStyle(scrollele);
                   var defaultH = styles['height'].replace('px', '');
                   scrollele.setAttribute('default-h',defaultH);
                   scrollele.style.height = Number(defaultH) + Number(scrollSpacerHeight) + 'px';
               }
           }
       }
    }

    function autoScrollDownHandler() {
        if (scrollElement) {
            if (contType == 'pop') {
                var scrollele = document.querySelector(scrollElement);
                scrollele.style.height = scrollele.getAttribute('default-h') + 'px';
            }
        }
    }

    function getInputBoxBottomPosition(ele) {
        var el = document.querySelector(ele);
        var rec = el.getBoundingClientRect();
        var bottom = rec.bottom || (rec.top + rec.height);
        return bottom;
    }

    function getKeyBoardBoxTopPosition(ele) {
        var el = document.querySelector(ele);
        var rec = el.getBoundingClientRect();
        return rec.top;
    }

    function getDisTance(ele1, ele2) {
        return getKeyBoardBoxTopPosition(ele2) - getInputBoxBottomPosition(ele1);
    }

    window.bindingETCKeyBoard = function (el, option) {
        //option {autoScroll: false, ele: HTMLelement}
        bindingElement = el;
        document.querySelector(bindingElement).addEventListener('click', inputBoxFocusHandler);
        if (option && option.autoScroll === true) {
            scrollElement = option.element || option.ele || option.el;
            contType = option.contType || 'pop';
            initScrollContData();
        }
        return {
            activeNext: triggerByEle,
            EVENTS: {
                DELETE: DELETE_EVENT,
                COMPLETE: COMPLETE_EVENT,
                INPUT: INPUT_EVENT,
                OPEN: OPEN_EVENT,
                CLOSE: CLOSE_EVENT
            },
            open: keyBoardPanelOpend,
            close: hideKeyBoard
        }
    };
})(window)