
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

function setClassHitDie(actorId, className, hitDie) {
    const classData = findClass(actorId, className);
    if(!classData) return;
    classData.hitDie = hitDie;
}

export { getActorData, getAllActors, getAllActorIdsInArray, setActorData, findClass, setClassHitDie};