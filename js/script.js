/* global pako */
/* global Base64 */

window.onload = function () {
    document.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        console.log(key);
        if (key === 114) { // 114 is r
            rotatePreview();
        }
        else if(key == 113){
            clearPreview();
        }
    });
    createItems();
    createTiles();
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
var placeable = [
    ["assembling-machine-1.png", 1, 0, 3, 3],
    ["assembling-machine-2.png", 1, 0, 3, 3],
    ["assembling-machine-3.png", 1, 0, 3, 3],
    ["chemical-plant.png", 1, 0, 3, 3],
    ["oil-refinery.png", 1, 0, 5, 5],
    ["beacon.png", 0, 0, 3, 3],
    ["roboport.png", 0, 0, 4, 4],
    ["lab.png", 0, 0, 3, 3],
    ["transport-belt.png", 1, 0, 1, 1],
    ["i-underground-belt.png", 1, 2, 1, 1],
    ["o-underground-belt.png", 1, 6, 1, 1],
    ["splitter.png", 1, 4, 2, 1],
    ["fast-transport-belt.png", 1, 0, 1, 1],
    ["i-fast-underground-belt.png", 1, 2, 1, 1],
    ["o-fast-underground-belt.png", 1, 6, 1, 1],
    ["fast-splitter.png", 1, 4, 2, 1],
    ["express-transport-belt.png", 1, 0, 1, 1],
    ["i-express-underground-belt.png", 1, 2, 1, 1],
    ["o-express-underground-belt.png", 1, 6, 1, 1],
    ["express-splitter.png", 1, 4, 2, 1],
    ["burner-mining-drill.png", 1, 4, 2, 2],
    ["electric-mining-drill.png", 1, 2, 3, 3],
    ["pumpjack.png", 1, 0, 2, 2],
    ["boiler.png", 1, 0, 3, 2],
    ["heat-boiler.png", 1, 0, 3, 2],
    ["heat-pipe.png", 0, 0, 1, 1],
    ["pipe.png", 0, 0, 1, 1],
    ["pipe-to-ground.png", 1, 2, 1, 1],
    ["stone-furnace.png", 0, 0, 2, 2],
    ["steel-furnace.png", 0, 0, 2, 2],
    ["electric-furnace.png", 0, 0, 3, 3],
    ["burner-inserter.png", 1, 6, 1, 1],
    ["inserter.png", 1, 6, 1, 1],
    ["long-handed-inserter.png", 1, 6, 1, 1],
    ["fast-inserter.png", 1, 6, 1, 1],
    ["filter-inserter.png", 1, 6, 1, 1],
    ["stack-filter-inserter.png", 1, 6, 1, 1],
    ["stack-inserter.png", 1, 6, 1, 1],
    ["wooden-chest.png", 0, 0, 1, 1],
    ["iron-chest.png", 0, 0, 1, 1],
    ["steel-chest.png", 0, 0, 1, 1],
    ["storage-tank.png", 1, 0, 3, 3],
    ["logistic-chest-active-provider.png", 0, 0, 1, 1],
    ["logistic-chest-passive-provider.png", 0, 0, 1, 1],
    ["logistic-chest-requester.png", 0, 0, 1, 1],
    ["logistic-chest-storage.png", 0, 0, 1, 1],
    ["small-electric-pole.png", 0, 0, 1, 1],
    ["medium-electric-pole.png", 0, 0, 1, 1],
    ["big-electric-pole.png", 0, 0, 2, 2],
    ["substation.png", 0, 0, 2, 2],
    ["solar-panel.png", 0, 0, 3, 3],
    ["accumulator.png", 0, 0, 2, 2],
    ["steam-engine.png", 1, 2, 5, 3],
    ["steam-turbine.png", 1, 2, 5, 3],
    ["centrifuge.png", 0, 0, 3, 3],
    ["nuclear-reactor.png", 0, 0, 5, 5],
    ["offshore-pump.png", 1, 6, 2, 1],
    ["pump.png", 1, 2, 2, 1],
    ["straight-rail.png", 1, 0, 2, 2],
    ["train-stop.png", 1, 0, 2, 2],
    ["rail-chain-signal.png", 1, 0, 1, 1],
    ["rail-signal.png", 1, 0, 1, 1],
    ["rocket-silo.png", 0, 0, 9, 10],
    ["radar.png", 0, 0, 3, 3],
    ["stone-wall.png", 0, 0, 1, 1],
    ["gate.png", 2, 2, 1, 1],
    ["gun-turret.png", 0, 0, 2, 2],
    ["flamethrower-turret.png", 0, 0, 2, 2],
    ["laser-turret.png", 0, 0, 2, 2],
    ["constant-combinator.png", 0, 0, 1, 1],
    ["decider-combinator.png", 1, 2, 2, 1],
    ["arithmetic-combinator.png", 1, 2, 2, 1],
    ["programmable-speaker.png", 0, 0, 1, 1],
    ["power-switch.png", 0, 0, 2, 2]];

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

function createPreview(url, r, direction, w, h) {
    var preview = document.getElementById("preview");
    //document.getElementsByTagName("body")[0].style.cursor = "url('icons/placeable/"+url+"'), auto";
    clearPreview();
    var div = document.createElement("div");
    div.style.width = w * 32 - 2 + "px";
    div.style.height = h * 32 - 2 + "px";
    div.style.margin = "-1px 0 0 -1px";
    div.setAttribute("data-name", url.slice(0, -4));
    div.setAttribute("data-r", r);
    div.setAttribute("data-x", 0);
    div.setAttribute("data-y", 0);
    div.setAttribute("data-posoffsetx", w / 2 - 0.5);
    div.setAttribute("data-posoffsety", h / 2 - 0.5);
    div.setAttribute("data-direction", direction);
    div.setAttribute("data-dirstart", direction);
    
    var span = document.createElement("span");
    span.setAttribute("class", "preview__image-helper");
    div.appendChild(span);
    var img = document.createElement("img");
    img.src = "vendor/factorio/icons/placeable/" + url;

    img.setAttribute("class", "item__image pixelated-image preview__image");
    div.appendChild(img);
    preview.appendChild(div);
    updatePreviewCopies();
}

function clearPreview(){
    document.getElementById("preview").innerHTML = "";
    updatePreviewCopies();
}

function previewIsEmpty(){
    return document.getElementById("preview").innerHTML == "";
}

function createTiles() {
    var grid = document.getElementById("grid");
    var row;

    for (var r = -9; r < 15; r++) {
        row = document.createElement("div");
        row.setAttribute("class", "row");
        for (var d = -9; d < 25; d++) {
            var tile = document.createElement("div");
            tile.setAttribute("data-x", d);
            tile.setAttribute("data-y", r);
            tile.setAttribute("data-status", 0);
            tile.setAttribute("class", "tile");
            if (d == 0 && r == 0) {
                tile.style.background = "darkgrey";
            }
            tile.addEventListener('mouseover', tileMouseOver);
            tile.addEventListener('mousedown', tileMouseOver);
            //prevent context menu from appearing
            tile.addEventListener('contextmenu', function(e) {e.preventDefault();})
            row.appendChild(tile);
        }
        grid.appendChild(row);
    }
}

window.clearGrid = function () {
    document.getElementById("grid").innerHTML = "";
    createTiles();
};

function createItems() {
    var grid = document.getElementById("sidebar");
    var url;
    for (var i = 0; i < placeable.length; i++) {
        var item = document.createElement("div");
        item.setAttribute("class", "item");
        url = placeable[i][0];
        item.setAttribute("data-url", url);
        item.setAttribute("data-r", placeable[i][1]);
        item.setAttribute("data-direction", placeable[i][2]);
        item.setAttribute("data-w", placeable[i][3]);
        item.setAttribute("data-h", placeable[i][4]);
        item.addEventListener('click', itemClick);
        insertImg(item, url);
        grid.appendChild(item);
    }
}

function setPreviewLocation(Loc){
    var preview = document.getElementsByClassName("mouse__follow");
    for(var i = 0; i < preview.length; i++){
        preview[i].style.left = (Loc.x) + "px";
        preview[i].style.top = (Loc.y) + "px";
    }
}

function itemClick() {
    createPreview(this.dataset.url, this.dataset.r, this.dataset.direction, this.dataset.w, this.dataset.h);
    setActiveItem(this);
}

function setActiveItem(item) {
    var active = document.querySelectorAll('.activeitem');
    if (active.length > 0) {
        for (var i = 0; i < active.length; i++) {
            active[i].classList.remove("activeitem");
        }
    }
    item.classList.add("activeitem");
}

function setTile(tile){
    var previewdiv = document.querySelector('#preview div').cloneNode(true);
    if ((tile.dataset.x % 2 == 0 || tile.dataset.y % 2 == 0) && (previewdiv.dataset.name == "straight-rail" || previewdiv.dataset.name == "train-stop")) {
        var x = tile.dataset.x;
        var y = tile.dataset.y;
        if (x % 2 == 0) {
            x -= 1;
        }
        if (y % 2 == 0) {
            y -= 1;
        }
        document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]').click();
    } else if (!isBlocked(previewdiv.dataset.name, tile.dataset.x, tile.dataset.y)) {
        previewdiv.setAttribute("data-x", tile.dataset.x);
        previewdiv.setAttribute("data-y", tile.dataset.y);
        previewdiv.setAttribute("class", "entity");
        tile.appendChild(previewdiv);
    }
}

function clearTile(tile){
    tile.innerHTML = "";
}

function tileClick(event, tile) {
    if(event.buttons == 2)  //right mouse button
        clearTile(tile);
    else if(event.buttons == 1 && !previewIsEmpty()) //left mouse button and item is selected
        setTile(tile);
}

function isBlocked(name, x, y) {
    var data = getPlaceableData(name);
    for (var i = 0; i < data[3]; i++) {
        for (var j = 0; j < data[4]; j++) {
            var existingPlaceable = getPlaceableAt(+x + i, +y + j);
            if (existingPlaceable) {
                return true;
            }
        }
    }
    return false;
}

function getPlaceableData(name) {
    for (var i in placeable) {
        if (placeable[i][0].startsWith(name)) {
            return placeable[i];
        }
    }
}

function getPlaceableAt(x, y) {
    for (var i = -9; i <= x; i++) {
        for (var j = -9; j <= y; j++) {
            var tile = document.querySelector("[data-x='" + i + "'][data-y='" + j + "']");
            if (!tile || !tile.innerHTML) {
                continue;
            }
            var data = getPlaceableData(tile.children[0].dataset.name);
            if (data && data[3] + i > x && data[4] + j > y) {
                return data[0];
            }
        }
    }
}
    
function tileMouseOver(event) {
    if (event.buttons != 0) { // any button is pressed
        tileClick(event, this);
    }

    var offset = this.getBoundingClientRect();
    var location = { x : offset.left, y : offset.top };
    setPreviewLocation(location);
}

function insertImg(tile, url) {
    var div = document.createElement("div");
    div.setAttribute("class", "itemdiv");
    var img = document.createElement("img");
    img.src = "vendor/factorio/icons/placeable/" + url;
    img.setAttribute("class", "item__image pixelated-image");
    div.appendChild(img);
    tile.appendChild(div);
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
