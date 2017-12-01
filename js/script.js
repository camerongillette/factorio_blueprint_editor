/* global pako */
/* global Base64 */

window.onload = function () {
    document.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 'r'.charCodeAt(0)) {
            window.FBE.viewmodel.rotateSelectedItem();
        }
        else if(key == 'q'.charCodeAt(0)){
            window.FBE.viewmodel.pickPlacable(null);
        }
    });

    window.FBE.view.createSideBar();
    // TODO: make these configurable - see #5
    window.FBE.view.createGrid(34, 24);

    // https://stackoverflow.com/questions/1586330/access-get-directly-from-javascript#1586333
    var $_GET = GETfromUrl();
    if($_GET.id != undefined){
        getFromMyJSON($_GET.id);
    }
};
function GETfromUrl(){
    return location.search.substr(1).split("&").reduce(function(object,uriVal){
        var entry = uriVal.split("=");
        if(entry[1]){
            object[decodeURIComponent(entry[0])] = decodeURIComponent(entry[1]);
        }
        return object;
    },{});
}

function createJSON() {
    var jsonstring = '{"blueprint": {"icons": [{"signal": {"type": "item","name": "express-transport-belt"},"index": 1}],"entities": [';
    var entities = document.getElementsByClassName("entity");

    if (entities.length == 0) {
        return "";
    } else {
        for (var i = 0; i < entities.length; i++) {
            var number = i + 1;
            var name = entities[i].dataset.name;
            var type = "";
            if (name.slice(0, 2) == "i-" || name.slice(0, 2) == "o-") {
                if (name.slice(0, 2) == "i-") {
                    type = '"type": "input",';
                } else {
                    type = '"type": "output",';
                }
                name = name.slice(2);
            }
            var posx = Number(entities[i].dataset.x) + Number(entities[i].dataset.posoffsetx);
            var posy = Number(entities[i].dataset.y) + Number(entities[i].dataset.posoffsety);
            jsonstring = jsonstring + '{' +
                '"entity_number": ' + number + ',' +
                '"name": "' + name + '",' +
                '"position": {' +
                '"x": ' + posx + ',' +
                '"y": ' + posy +
                '},' + type +
                '"direction":' + entities[i].dataset.direction +
                '},';
        }
        jsonstring = jsonstring.slice(0, -1) + '],' +
            '"item": "blueprint",' +
            '"version": 64426934272' +
            '}' +
            '}';
        return jsonstring;
    }
    
}

function createEntitiesFromJSON(jsonobj){
    var entities = jsonobj.blueprint.entities;
    var items = document.querySelectorAll('#sidebar div'); 
    console.log(entities.length);
    console.log(entities);
    for (var ent = 0; ent < entities.length; ent++){
        var name = entities[ent].name;
        var type = entities[ent].type;
        if (type == "input"){
            name = "i-" + name;
        }else if (type == "output"){
            name = "o-" + name;
        }
        for (var j = 0; j < items.length; j++){
            if(items[j].dataset.url == name+".png"){
                items[j].click();
                var edir = entities[ent].direction || 0;
                var rotations = Number(edir) - Number(items[j].dataset.direction);
                console.log(name + " " + items[j].dataset.direction);
                if(rotations < 0){
                    rotations = rotations + 8;
                }
                rotations = Math.round(rotations / 2);
                for (var k = 0; k < rotations; k++){
                    rotatePreview();
                }
                var preview = document.querySelector('#preview div');
                var offsetx = Number(preview.dataset.posoffsetx);
                var offsety = Number(preview.dataset.posoffsety);
                var tilex = Number(entities[ent].position.x) - offsetx;
                var tiley = Number(entities[ent].position.y) - offsety;
                // rounded tile numbers because position or offset is wrong somewhere else.
                document.querySelector('[data-x="' + Math.floor(tilex) + '"][data-y="' + Math.floor(tiley) + '"]').click();
                break;
            }
        }
    }
}

// https://stackoverflow.com/questions/5999118/how-can-i-add-or-update-a-query-string-parameter
function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}

function sendToMyJSON(jsonstring){
    var http = new XMLHttpRequest();
    var url = "https://api.myjson.com/bins";
    var params = jsonstring;
    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 201) {
            var resp = JSON.parse(http.responseText);
            var id = resp.uri.replace("https://api.myjson.com/bins/","");
            // to show on some text field
            //alert(UpdateQueryString("id", id));
            document.getElementById("shareURI").style.display = "block";
            document.getElementById("uri").value = UpdateQueryString("id", id);
            document.getElementById("uri").select();
        }
    };
    http.send(params);
}

function getFromMyJSON(id){
    var http = new XMLHttpRequest();
    var url = "https://api.myjson.com/bins/"+id;
    http.open("GET", url, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var resp = JSON.parse(http.responseText);
            createEntitiesFromJSON(resp);
        }
    };
    http.send();
}

window.savebtn = function () {
    var jsonstring = createJSON();
    if (jsonstring == ""){
        //to show on some text field
        console.log("Grid is empty");
    } else {
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
    var jsonstring = createJSON();
    if (jsonstring == ""){
        document.getElementById("bp").value = "Grid is empty";
    } else {
        document.getElementById("bp").value = encode(jsonstring);
        document.getElementById("bp").select();
    }
};

function updatePreviewCopies(){
    if(!previewIsEmpty()){
        var staticPreview = document.querySelector('.preview__main').firstChild.cloneNode(true);
    }

    var copies = document.getElementsByClassName('preview__copy');
    for(var i = 0; i < copies.length; i++){
        copies[i].innerHTML = "";
        
        if(!previewIsEmpty()){
            copies[i].appendChild(staticPreview);
        }
    }
}

function rotatePreview() {
    var preview = document.querySelector('#preview div');
    if (preview != null && preview.dataset.r != 0) {
        var direction = (Number(preview.dataset.direction) + 2) % 8;
        var dirStart = Number(preview.dataset.dirstart);
        console.log('sadjkhkjdhs' + dirStart);
        var w = (Number(preview.style.width.slice(0, -2)) + 2) / 32;
        console.log('w: ' + w);
        var h = (Number(preview.style.height.slice(0, -2)) + 2) / 32;
        var low;
        var high;
        if (w < h) {
            low = w;
            high = h;
        } else {
            low = h;
            high = w;
        }
        var temp = preview.dataset.posoffsetx;
        preview.dataset.posoffsetx = preview.dataset.posoffsety;
        preview.dataset.posoffsety = temp;
        var offsetx;
        var offsety;
        var rotation = direction - dirStart;
        if (rotation < 0) {
            rotation += 8;
        }
        if (rotation == 0) {
            offsetx = low * 16;
            offsety = low * 16;
        }
        if (rotation == 2) {
            offsetx = low * 16;
            offsety = low * 16;
        }
        if (rotation == 4) {
            offsetx = high * 16;
            offsety = low * 16;
        }
        if (rotation == 6) {
            offsetx = high * 16;
            offsety = high * 16;
        }
        console.log('rotation: ' + rotation);
        preview.setAttribute("data-direction", direction);
        preview.style.transformOrigin = offsetx + 'px ' + offsety + 'px';
        preview.style.transform = 'rotate(' + 45 * rotation + 'deg)';
        updatePreviewCopies();
        //div.style.width= w*32-2 +"px";
        //div.style.height= h*32-2 +"px";
    }
}

function previewIsEmpty(){
    return document.getElementById("preview").innerHTML == "";
}

function encode(json) {
    var string = json.replace(/\s/g, "");
    console.log("string", string);
    var enc = new TextEncoder("utf-8").encode(string);
    console.log("enc", enc);
    var zip = pako.deflate(enc, { level: 9 });
    console.log("zip", zip);
    var base64 = Base64.encodeU(zip);
    var bstring = "0" + base64;
    return bstring;
}
