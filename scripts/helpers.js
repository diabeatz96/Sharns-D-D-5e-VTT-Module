
/*
        Helper functions to get Actor Data for pages and Edit those Actors
*/

function getActorData(actorId) {
    return game.actors.get(actorId);
}

function getAllActors() {
    return game.actors;
}

function getAllActorIdsInArray() {
    return game.actors.map(actor => actor.id);
}

function setActorData(actorId, data) {
    game.actors.get(actorId).update(data);
}

function findClass(actorId, className) {
    return getActorData(actorId).items.find(item => item.name === className);
}

function getActorItem(actorId, itemId) {
    return getActorData(actorId).items.get(itemId);
}

function setActorItem(actorId, itemId, data) {
    getActorItem(actorId, itemId).update(data);
}

function getItemData(itemId) {
    console.log(game.items);
    return game.items.get(itemId);
}

function setItemData(itemId, data) {
    game.items.get(itemId).update(data);
}
 
export { getActorData, getAllActors, getAllActorIdsInArray, setActorData, findClass, getActorItem, getItemData, setItemData};