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
            isCha: true,
            isStr: true,
            isDex: false,
            isInt: false,
            isWis: false,
            isCon: false,
        }
        return getActorData(userId)?.setFlag(Declasse.ID, Declasse.FLAGS.atrributes, attributes);
    }

    static getAttributes(userId) {
        return getActorData(userId)?.getFlag(Declasse.ID, Declasse.FLAGS.atrributes);
    }

    static setAttributes(userId, attributes) {
        return getActorData(userId)?.setFlag(Declasse.ID, Declasse.FLAGS.atrributes, attributes);
    }

    static decreaseFP(userId, amount) {
        const attributes = DeclasseData.getAttributes(userId);
        attributes.fp -= amount;
        DeclasseData.setAttributes(userId, attributes);
    }

    static decreaseAP(userId, amount) {
        const attributes = DeclasseData.getAttributes(userId);
        attributes.ap -= amount;
        DeclasseData.setAttributes(userId, attributes);
    }

    static increaseFP(userId, amount) {
        const attributes = DeclasseData.getAttributes(userId);
        attributes.fp += amount;
        DeclasseData.setAttributes(userId, attributes);
    }

    static increaseAP(userId, amount) {
        const attributes = DeclasseData.getAttributes(userId);
        attributes.ap += amount;
        DeclasseData.setAttributes(userId, attributes);
    }

    static setMentalModifiers(userId, attribute) {
        const attributes = DeclasseData.getAttributes(userId);
        attributes.isCha = false;
        attributes.isInt = false;
        attributes.isWis = false;
        attributes[attribute] = true;
        DeclasseData.setAttributes(userId, attributes);
    }

    static setPhysicalModifiers(userId, attribute) {
        const attributes = DeclasseData.getAttributes(userId);
        attributes.isStr = false;
        attributes.isDex = false;
        attributes.isCon = false;
        attributes[attribute] = true;
        DeclasseData.setAttributes(userId, attributes);
    }


    static setMental(userId) {
        
        let total = 0;
        if(DeclasseData.getAttributes(userId).isCha) {
            total = getActorData(userId).system.abilities.cha.mod;
            console.log(total);
        }
        if(DeclasseData.getAttributes(userId).isInt) {
            total = getActorData(userId).system.abilities.int.mod;
        }
        if(DeclasseData.getAttributes(userId).isWis) {
            total = getActorData(userId).system.abilities.wis.mod;
        }
        
        DeclasseData.setAttributes(userId, {mental: total});
    
    }

    static setPhysical(userId) {
            let total = 0;
    
            if(DeclasseData.getAttributes(userId).isStr) {
                total = getActorData(userId).system.abilities.str.mod;
            }
            if(DeclasseData.getAttributes(userId).isDex) {
                total = getActorData(userId).system.abilities.dex.mod;
            }
            if(DeclasseData.getAttributes(userId).isCon) {
                total = getActorData(userId).system.abilities.con.mod;
            }
            DeclasseData.setAttributes(userId, {physical: total});
        }
}

/* Hooks */

Hooks.once('init', async function() {


   
});

Hooks.on('renderActorSheet5eCharacter', async function(sheet, html, data) {
    

    if(!getActorData(sheet.actor.id).getFlag(Declasse.ID, Declasse.FLAGS.atrributes)) {
        DeclasseData.createData(sheet.actor.id);
        console.log("Created Data");
    }

    getActorData(sheet.actor.id);
    const table = html.find(".traits")
    table.prepend(`
    <div class = "counter flexrow"> <h4 class="fas fa-hand-fist"> Physical Mod: </h4> <i></i> ${DeclasseData.getAttributes(sheet.actor.id).physical} </div>
    <div class = "counter flexrow"> <h4 class = "fas fa-head-side-brain"> Mental Mod:</h4> <i></i> ${DeclasseData.getAttributes(sheet.actor.id).mental}</div>
    <div class = "counter flexrow"> <h4 class = "fas fa-dragon">  FP: </h4> <i></i> ${DeclasseData.getAttributes(sheet.actor.id).fp}</div>
    <div class = "counter flexrow"> <h4 class = "fas fa-hat-wizard"> AP: </h4> <i></i> ${DeclasseData.getAttributes(sheet.actor.id).ap} </div>`);

});


Hooks.once('ready', async function() {
    getAllActorIdsInArray().forEach(actorId => {
        if(!getActorData(actorId).getFlag(Declasse.ID, Declasse.FLAGS.atrributes)) {
            DeclasseData.createData(actorId);
            DeclasseData.setMental(actorId);
            DeclasseData.setPhysical(actorId);
            console.log("Created Data");
        }
    }); 
});




Hooks.on('updateActor', async function(actor, data, options, userId) {

});

Hooks.once('devModeReady', () => {
  });
