window.FBE = window.FBE || {};

(function (FBE) {
    'use strict';
    /* global Blueprint, TinyEmitter */

    var events = new TinyEmitter(),
        bp = new Blueprint(),
        selectedItem,
        entityNamesThatDoNotRotate = /beacon|roboport|lab|heat_pipe|pipe$|furnace|chest|pole|substation|solar|accumulator|centrifuge|wall|rocket_silo|radar|turret|speaker|power_switch|reactor|lamp|land_mine/i
        ;

    FBE.viewmodel = {
        getPlaceableItems: getPlaceableItems,
        pickPlacable: pickPlacable,
        onItemSelected: onItemSelected,
        onItemPlaced: onItemPlaced,
        onItemRemoved: onItemRemoved,
        rotateSelectedItem: rotateSelectedItem,
        tryPlaceSelectedItem: tryPlaceSelectedItem,
        clear: clear,
        clearPosition: clearPosition,
        couldPlaceSelectedItem: couldPlaceSelectedItem,
        encode: encode,
        toJSON: toJSON,
        loadJSON: loadJSON,
        _: {
            bp: bp,
            selectedItem: selectedItem
        }
    };

    function loadJSON(json) {
        clear();

        var parsed = new Blueprint(json);
        var placeableItems = getPlaceableItems();

        parsed.entities.forEach(function (entity) {
            loadEntity(placeableItems, entity);
        });
        selectedItem = null;
    }

    function loadEntity(placeables, entity) {
        var items = placeables
                .filter(function (p) { return p.name === entity.name; }),
            item;

        if (items.length === 2) {
            item = items.filter(function (p) {
                return p.type === entity.directionType;
            })[0];
        } else if (items.length === 1) {
            item = items[0];
        }

        item.direction = entity.direction;
        selectedItem = item;
        tryPlaceSelectedItem(entity.position);
    }

    function toJSON() {
        return bp.entities.length > 0 ? bp.toJSON() : null;
    }

    function encode() {
        return bp.entities.length > 0 ? bp.encode() : null;
    }

    function couldPlaceSelectedItem(point) {
        if (!selectedItem) { return false; }

        try {
            bp
                .createEntity(selectedItem.name, point, selectedItem.direction)
                .remove();
            return true;
        } catch (e) {
            return false;
        }
    }

    function clear() {
        bp.entities.map(function (e) { return e.position; })
            .forEach(clearPosition);
    }

    function onItemRemoved(callback) {
        return events.on('itemRemoved', callback);
    }

    function onItemPlaced(callback) {
        return events.on('itemPlaced', callback);
    }

    function clearPosition(point) {
        var wasCleared = bp.removeEntityAtPosition(point);

        if (wasCleared) {
            console.log('cleared blueprint position', point);
            events.emit('itemRemoved', { point: point });
        }
        return wasCleared;
    }

    function tryPlaceSelectedItem(point) {
        if (!selectedItem) { return false; }
        try {
            var entity = bp.createEntity(
                selectedItem.name,
                point,
                selectedItem.direction
            );
            if (entity.directionType) {
                entity.directionType = selectedItem.type;
            }
            console.log('added to blueprint:', selectedItem, 'at', point, entity);
            events.emit('itemPlaced', {
                point: point,
                item: Object.assign({}, selectedItem),
                entity: entity
            });
            return true;
        } catch (e) {
            console.warn('failed to create entity', e);
            return false;
        }
    }

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
                    rawEntities[name],
                    // fix bad data in factorio-blueprint
                    name === 'steam_turbine' && { width: 5, height: 3 },
                    name === 'boiler' && { width: 3, height: 2 },
                    // fix spots where height/width are swapped
                    name === 'pump' && { width: 2, height: 1 },
                    name === 'decider_combinator' && { width: 2, height: 1 },
                    name === 'arithmetic_combinator' && { width: 2, height: 1 }
                );
            })
            .filter(isPlaceable)
            .reduce(addDirectionalEntities, [])
            .map(addDerivedProperties);
    }

    function isPlaceable(entity) {
        return (entity.type === "item" && entity.width)
            && entity.name !== 'curved_rail'; // curved rail is strange
        // TODO: support tiles
        // || entity.type === "tile"
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
        return Object.assign({}, entity, {
            iconUrl: getIconUrl(entity),
            canRotate: entity.width !== entity.height
                || !entityNamesThatDoNotRotate.test(entity.name),
            defaultDirection: getDefaultDirection(entity),
            direction: getDefaultDirection(entity)
        });
    }

    function getIconUrl(entity) {
        var directionPrefix = entity.directionType
            ? entity.type[0] + '-'
            : '';

        var fileName = directionPrefix
            + entity.name.replace(/_/g, '-') // TODO: rename files so we can drop this
            + '.png';
        return 'vendor/factorio/icons/placeable/' + fileName;
    }

    function getDefaultDirection(entity) {
        if (entity.type === 'input') { return 2; }
        if (entity.type === 'output') { return 6; }
        if (/inserter|offshore_pump/.test(entity.name)) { return 6; }
        if (/splitter|burner_mining/.test(entity.name)) { return 4; }
        if (/electric_mining|pipe_to_ground|steam_engine|steam_turbine|pump|gate|arithmetic_combinator|decider_combinator/.test(entity.name)) { return 2; }
        return 0;
    }

})(window.FBE);
