import { getActorData, getAllActors, getAllActorIdsInArray, setActorData } from "./helpers.js";


class Declasse {
    static ID = "Sharns-Declasse";
    static FLAGS = {
        atrributes: "attributes",
    }
}

class DeclasseData {

    static createData(userId) {
        const attributes = {
            fp: 12,
            ap: 12,
            mental: 0,
            physical: 0,
        }
        return getActorData(userId)?.setFlag(Declasse.ID, Declasse.FLAGS.atrributes, attributes);
    }
}

/* Hooks */

Hooks.once('init', async function() {


   
});

Hooks.once('ready', async function() {


    const Actors = getAllActorIdsInArray();
    console.log(Actors);


    for(let i = 0; i < Actors.length; i++) {
        DeclasseData.createData(Actors[i]);
        console.log(getActorData(Actors[i]))
    }
    //set flags for each actor with declasse
    
    console.log(getActorData(Actors[0]).getFlag(Declasse.ID, Declasse.FLAGS.atrributes));
});





Hooks.on('updateActor', async function(actor, data, options, userId) {

    console.log("Actor's health is " + actor.data.data.attributes.hp.value + userId);

});


Hooks.on('renderActorSheet', async function(sheet, html, data) {

    getActorData(sheet.actor.id);

    const table = html.find(".traits")

    table.append(`"Heloooooooooooooooooooooooooooooooo"`);

    sheet.actor.name = "Bob";

});

Hooks.once('devModeReady', () => {
  });
