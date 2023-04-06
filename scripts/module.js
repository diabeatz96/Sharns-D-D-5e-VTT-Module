
/*
        Helper functions to get Actor Data for pages and Edit those Actors
*/

function getActorData(actorId) {
    return game.actors.get(actorId).data;
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

class DeclasseData {

}

Hooks.once('init', async function() {
   
   
});

Hooks.once('ready', async function() {
    const Actors = getAllActorIdsInArray();
    console.log(Actors);
});


class Declasse {
    static ID = 'Sharns-Declasse'


    static FLAGS = {
        DECLASSE: 'declasse'
    }

}




/* Hooks */

Hooks.on('updateActor', async function(actor, data, options, userId) {

    console.log("Actor's health is " + actor.data.data.attributes.hp.value + userId);

});


Hooks.on('renderActorSheet', async function(sheet, html, data) {

    getActorData(sheet.actor.id);

    const table = html.find(".traits")

    table.append(`"Heloooooooooooooooooooooooooooooooo"`);

    sheet.actor.name = "Bob";

});
