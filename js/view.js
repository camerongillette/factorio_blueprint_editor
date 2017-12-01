// TODO: add babel with a build process to support ES6 import/export and let it
// handle this messy IIFE + global namespace object on `window`
window.FBE = window.FBE || {};

(function (FBE) {
    'use strict';
    FBE.view = {
        createSideBar: createSideBar,
        createGrid: createGrid
    };

    var isDrawing = false,
        isClearing = false;

    function createGrid(width, height) {
        var grid = document.getElementById("grid");
        grid.innerHTML = '';
        var maxX = width / 2;
        var maxY = height / 2;

        for (var y = -maxY; y < maxY; y++) {
            var row = document.createElement('div');
            row.classList.add('row');
            for (var x = -maxX; x < maxX; x++) {
                var point = { x: x, y: y };
                row.appendChild(createTile(point));
            }
            grid.appendChild(row);
        }

        FBE.viewmodel.onItemPlaced(renderItemOnGrid);
        FBE.viewmodel.onItemRemoved(removeItemOnGrid);
        grid.addEventListener('mousedown', function (evt) {
            isDrawing = evt.button == 0;
            isClearing = evt.button == 2;
        });
        grid.addEventListener('mouseup', function () {
            isDrawing = isClearing = false;
        });
    }

    function renderItemOnGrid(event) {
        getTileFromPoint(event.point)
            .appendChild(createPreview(event.item));
    }

    function createTile(point) {
        var tile = document.createElement("div");
        tile.setAttribute('title', 'x: ' + point.x + ' y: ' + point.y);
        tile.setAttribute('data-point', point.x + ':' + point.y);
        tile.classList.add('tile');
        if (point.x == 0 && point.y == 0) {
            tile.classList.add('origin');
        }
        tile.addEventListener('mouseover', tileMouseOver.bind(null, point));
        tile.addEventListener('click', FBE.viewmodel.tryPlaceSelectedItem.bind(null, point));
        tile.addEventListener('contextmenu',
            function (evt) {
                evt.preventDefault();
                FBE.viewmodel.clearPosition(point);
            }
            , false);
        return tile;
    }

    function removeItemOnGrid(event) {
        getTileFromPoint(event.point).innerHTML = '';
    }

    function getTileFromPoint(point) {
        var selector = '.tile[data-point="' + point.x + ':' + point.y + '"]';

        var tile = document.querySelector(selector);
        if (!tile) {
            throw new Error('Expected to find a tile for point:', point, 'selector:', selector);
        }
        return tile;
    }

    function tileMouseOver(point, event) {
        if (isClearing) { FBE.viewmodel.clearPosition(point); }
        if (isDrawing) { FBE.viewmodel.tryPlaceSelectedItem(point); }

        var preview = document.getElementById("mousePreview");
        var location = event.currentTarget.getBoundingClientRect();
        preview.style.left = location.left + 'px';
        preview.style.top = location.top + 'px';

        if (FBE.viewmodel.couldPlaceSelectedItem(point)) {
            preview.classList.remove('blocked');
        }else{
            preview.classList.add('blocked');
        }
    }

    function createSideBar() {
        var grid = document.getElementById('sidebar');
        FBE.viewmodel.getPlaceableItems()
            .map(createSideBarItem)
            .forEach(grid.appendChild.bind(grid));
        FBE.viewmodel.onItemSelected(updatePreview);
    }

    function createSideBarItem(placeable) {
        var item = document.createElement("div");
        item.classList.add("item");
        item.setAttribute("title", placeable.name);
        item.addEventListener('click',
            FBE.viewmodel.pickPlacable.bind(null, placeable));
        var div = document.createElement("div");
        div.appendChild(createImage(placeable));
        item.appendChild(div);
        return item;
    }

    function createImage(placeable) {
        var img = document.createElement("img");
        img.src = placeable.iconUrl;
        img.classList.add('pixelated-image');
        img.setAttribute("alt", placeable.name);
        return img;
    }

    function updatePreview(placeable) {
        var previewContainer = document.getElementById("preview");
        var previewCopies = document.getElementsByClassName('preview__copy');

        var updateContainer = function (parent) {
            parent.innerHTML = '';
            if (placeable) {
                parent.appendChild(createPreview(placeable));
            }
        };

        updateContainer(previewContainer);
        for (var i = 0; i < previewCopies.length; i++) {
            updateContainer(previewCopies[i]);
        }
    }

    function createPreview(placeable) {
        var div = document.createElement("div");
        div.classList.add('preview');
        div.style.width = placeable.width * 32 - 2 + "px";
        div.style.height = placeable.height * 32 - 2 + "px";
        if (placeable.direction) {
            // TODO account for mismatch with icons rotation and CSS rotation
            div.style.transform = 'rotate(' + 45 * placeable.direction + 'deg)';
        }
        div.appendChild(createImage(placeable));
        return div;
    }

})(window.FBE);
