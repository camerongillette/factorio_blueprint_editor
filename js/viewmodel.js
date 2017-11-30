window.FBE = window.FBE || {};

(function (FBE) {
    'use strict';
    /* global Blueprint, TinyEmitter */

    FBE.viewmodel = {
        getPlaceableItems: getPlaceableItems,
        pickPlacable: pickPlacable,
        onItemSelected: onItemSelected,
        rotateSelectedItem: rotateSelectedItem
    };

    var events = new TinyEmitter(),
        selectedItem;

    function rotateSelectedItem() {
        if (selectedItem && selectedItem.canRotate) {
            console.log('rotating', selectedItem);
            selectedItem.direction = (selectedItem.direction + 2) % 8;
            pickPlacable(selectedItem);
        }
    }

    function onItemSelected(callback) {
        return events.on('itemSelected', callback);
    }

    // TODO: this name feels wrong
    function pickPlacable(placeable) {
        console.log('selected', placeable);
        selectedItem = placeable && Object.assign({}, placeable);
        events.emit('itemSelected', selectedItem);
    }

    function getPlaceableItems() {
        var rawEntities = Blueprint.getEntityData();
        return Object.keys(rawEntities)
            .map(function (name) {
                return Object.assign(
                    {
                        name: name
                    },
                    rawEntities[name]);
            })
            .filter(isPlaceable)
            .reduce(addDirectionalEntities, [])
            .map(addDerivedProperties);
    }

    function isPlaceable(entity) {
        return entity.type === "item" && entity.width;
    }

    function addDirectionalEntities(results, entity) {

        if (entity.directionType) {
            return results.concat([
                Object.assign({}, entity, { type: 'input' }),
                Object.assign({}, entity, { type: 'output' })
            ]);
        }
        return results.concat([entity]);
    }

    function addDerivedProperties(entity) {

        var nonRotators = /beacon|roboport|lab|heat_pipe|pipe|furnace|chest|pole|substation|solar|accumulator|centrifuge|wall|rocket_silo|radar|turret|speaker|power_switch/i;

        return Object.assign({}, entity, {
            iconUrl: getIconUrl(entity),
            canRotate: entity.width !== entity.height
                || !nonRotators.test(entity.name),
            direction: entity.width > entity.height ? 2 : 0
        });
    }

    function getIconUrl(entity) {
        var directionPrefix = entity.directionType
            ? entity.type[0] + '-'
            : '';
        var fileName = directionPrefix + entity.name.replace(/_/g, '-') + '.png';
        return 'vendor/factorio/icons/placeable/' + fileName;
    }

})(window.FBE);
