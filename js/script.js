window.onload = function () {
    document.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 'r'.charCodeAt(0)) {
            window.FBE.viewmodel.rotateSelectedItem();
        }
        else if (key === 'q'.charCodeAt(0)) {
            window.FBE.viewmodel.pickPlacable(null);
        }
    });

    window.FBE.view.createSideBar();
    // TODO: make these configurable - see #5
    window.FBE.view.createGrid(34, 24);

    // https://stackoverflow.com/questions/1586330/access-get-directly-from-javascript#1586333
    var $_GET = GETfromUrl();
    if ($_GET.id !== undefined) {
        getFromMyJSON($_GET.id);
    }
};

function GETfromUrl() {
    return location.search.substr(1).split("&").reduce(function (object, uriVal) {
        var entry = uriVal.split("=");
        if (entry[1]) {
            object[decodeURIComponent(entry[0])] = decodeURIComponent(entry[1]);
        }
        return object;
    }, {});
}

// https://stackoverflow.com/questions/5999118/how-can-i-add-or-update-a-query-string-parameter
function UpdateQueryString(key, value, url) {
    if (!url) {
        url = window.location.href;
    }

    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null) {
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        }
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                url += '#' + hash[1];
            }
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                url += '#' + hash[1];
            }
            return url;
        }
        else {
            return url;
        }
    }
}

function sendToMyJSON(jsonstring) {
    var http = new XMLHttpRequest();
    var url = "https://api.myjson.com/bins";
    var params = jsonstring;
    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 201) {
            var resp = JSON.parse(http.responseText);
            var id = resp.uri.replace("https://api.myjson.com/bins/", "");
            // to show on some text field
            //alert(UpdateQueryString("id", id));
            document.getElementById("shareURI").style.display = "block";
            document.getElementById("uri").value = UpdateQueryString("id", id);
            document.getElementById("uri").select();
        }
    };
    http.send(params);
}

function getFromMyJSON(id) {
    var http = new XMLHttpRequest();
    var url = "https://api.myjson.com/bins/" + id;
    http.open("GET", url, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
            var resp = JSON.parse(http.responseText);
            window.FBE.viewmodel.loadJSON(resp);
        }
    };
    http.send();
}

window.savebtn = function () {
    var jsonstring = window.FBE.viewmodel.toJSON();
    if (jsonstring !== "") {
        sendToMyJSON(jsonstring);
    }
};

window.closebtn = function () {
    document.getElementById("blueprint").style.display = "none";
};

/*
https://stackoverflow.com/a/33928558
*/
function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

window.copybtn = function (ev) {
    copyToClipboard(ev.target.parentElement.getElementsByClassName("modal__data")[0].value);
    window.closebtn(ev);
};

window.bpbtn = function () {
    document.getElementById("blueprint").style.display = "block";
    var encoded = window.FBE.viewmodel.encode();
    if (encoded) {
        document.getElementById("bp").value = encoded;
        document.getElementById("bp").select();
    } else {
        document.getElementById("bp").value = "Grid is empty";
    }
};
