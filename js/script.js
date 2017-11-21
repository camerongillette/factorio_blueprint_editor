window.onload = function () {
    document.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        console.log(key);
        if (key === 114) { // 114 is r
            rotatePreview();


        }
    });
    createItems();
    createTiles();
};


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
    ["boiler.png", 1, 2, 3, 2],
    ["heat-boiler.png", 1, 2, 3, 2],
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
    ["steam-engine.png", 1, 0, 5, 3],
    ["steam-turbine.png", 1, 0, 5, 3],
    ["centrifuge.png", 0, 0, 3, 3],
    ["nuclear-reactor.png", 0, 0, 5, 5],
    ["offshore-pump.png", 1, 4, 2, 1],


    ["pump.png", 1, 0, 2, 1],


    ["straight-rail.png", 1, 0, 2, 2],
    ["train-stop.png", 1, 0, 2, 2],
    ["rail-chain-signal.png", 0, 0, 1, 1],
    ["rail-signal.png", 0, 0, 1, 1],

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
    var temp;
    if (entities.length == 0) {
        document.getElementById("bp").value = "Grid is empty";
    } else {
        for (i = 0; i < entities.length; i++) {
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
            var posy = Number(entities[i].dataset.y) + Number(entities[i].dataset.posoffsety)
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
        console.log('jsonstring ' + jsonstring);
        var json = JSON.parse(jsonstring);
        console.log(json);
        document.getElementById("bp").value = encode(jsonstring);
    }
    document.getElementById("bp").select();

}
function closebtn() {
    document.getElementById("blueprint").style.display = "none";
}

/*
https://stackoverflow.com/a/33928558
*/
function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

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

function copybtn() {
    copyToClipboard(document.getElementById('bp').value);
}

function bpbtn() {
    document.getElementById("blueprint").style.display = "block";
    createJSON();

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
        var temp = preview.dataset.posoffsetx
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


        //div.style.width= w*32-2 +"px";
        //div.style.height= h*32-2 +"px";

    }

}

function createPreview(url, r, direction, w, h) {
    var preview = document.getElementById("preview");
    //document.getElementsByTagName("body")[0].style.cursor = "url('icons/placeable/"+url+"'), auto";
    preview.innerHTML = "";
    div = document.createElement("div");
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

    img = document.createElement("img");
    img.src = "icons/placeable/" + url;
    img.setAttribute("class", "placedimage");
    div.appendChild(img);
    div.addEventListener('contextmenu', function (e) {
        //e.preventDefault();
        //alert('success!');
        //return false;
    }, false);
    preview.appendChild(div);

}
function createTiles() {
    var grid = document.getElementById("grid");
    var row;
    var col;
    for (r = -9; r < 15; r++) {
        row = document.createElement("div");
        row.setAttribute("class", "row")
        for (d = -9; d < 25; d++) {
            tile = document.createElement("div");
            tile.setAttribute("data-x", d);
            tile.setAttribute("data-y", r);
            tile.setAttribute("data-status", 0);
            tile.setAttribute("class", "tile");
            if (d == 0 && r == 0) {
                tile.style.background = "darkgrey";
            }
            tile.addEventListener('mouseover', tileMouseOver);
            tile.addEventListener('click', tileClick);
            tile.addEventListener('contextmenu', tileContextMenu, false);
            row.appendChild(tile);
        }
        grid.appendChild(row);
    }
}

function createItems() {
    var grid = document.getElementById("sidebar");
    var url;
    for (i = 0; i < placeable.length; i++) {
        item = document.createElement("div");
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

function itemClick() {
    createPreview(this.dataset.url, this.dataset.r, this.dataset.direction, this.dataset.w, this.dataset.h)
    setActiveItem(this);
}

function setActiveItem(item) {
    var active = document.querySelectorAll('.activeitem')
    if (active.length > 0) {
        for (i = 0; i < active.length; i++) {
            active[i].classList.remove("activeitem");
        }
    }
    item.classList.add("activeitem");
}

function tileContextMenu(e) {
    if (e) {
        e.preventDefault();
    }
    this.innerHTML = "";
}

function tileClick() {
    this.innerHTML = "";
    var preview = document.getElementById("preview");
    if (preview.innerHTML == "") {
        return;
    }
    var previewdiv = document.querySelector('#preview div').cloneNode(true);
    if ((this.dataset.x % 2 == 0 || this.dataset.y % 2 == 0) && (previewdiv.dataset.name == "straight-rail" || previewdiv.dataset.name == "train-stop")) {
        var x = this.dataset.x;
        var y = this.dataset.y;
        if (x % 2 == 0) {
            x -= 1;
        }
        if (y % 2 == 0) {
            y -= 1;
        }
        document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]').click();

    } else {
        previewdiv.setAttribute("data-x", this.dataset.x);
        previewdiv.setAttribute("data-y", this.dataset.y);
        previewdiv.setAttribute("class", "entity");
        this.appendChild(previewdiv);
    }
}

function tileMouseOver(event) {
    if (event.buttons == 1) { // Left mouse button is pressed
        tileClick.call(this);
    } else if (event.buttons == 2) {
        tileContextMenu.call(this);
    }
}
function insertImg(tile, url) {
    div = document.createElement("div");
    div.setAttribute("class", "itemdiv");
    img = document.createElement("img");
    img.src = "icons/placeable/" + url;
    img.setAttribute("class", "placedimage");
    div.appendChild(img);
    tile.appendChild(div);
}

function encode(json) {
    var string = json.replace(/\s/g, "");
    console.log("string", string);
    var enc = new TextEncoder("utf-8").encode(string);
    console.log("enc", enc);
    var zip = pako.deflate(enc, {level: 9});
    console.log("zip", zip);
    var base64 = Base64.encodeU(zip);
    var bstring = "0" + base64;
    return bstring;
}
