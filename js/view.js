// TODO: add babel with a build process to support ES6 import/export and let it
// handle this messy IIFE + global namespace object on `window`
window.FBE = window.FBE || {};

(function (FBE) {
    'use strict';
    FBE.view = {
        createSideBar: createSideBar
    };

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
