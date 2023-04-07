
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


export { getActorData, getAllActors, getAllActorIdsInArray, setActorData };