import { getItemData, getActorData, getAllActors, getAllActorIdsInArray, setActorData } from "./helpers.js";
import { DeclasseSkills } from "./skills.js";


class DeclasseSettingsTable extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions;
  
        const overrides = {
          height: 'auto',
          id: Declasse.ID,
          template: 'modules/Sharns-Declasse/templates/declasse-settings-table.hbs',
          title: 'Declasse Settings',
          userId: null,
        };
        
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions; 
    }

    getData() {
        return {
            attributes: DeclasseData.getAttributes(this.options.userId),
            userId: this.options.userId,
            functions: this.options.functions,
        };
    }
}

class Declasse {
    static ID = "Sharns-Declasse";
    static FLAGS = {
        atrributes: "attributes",
        properties: "properties",
        triggers: "triggers",
        history: "history",
    }
}

class DeclasseData {

    static createData(userId) {
        const attributes = {
            fp: 12,
            ap: 12,
            mental: 0,
            physical: 0,
            isCha: false,
            isStr: false,
            isDex: false,
            isInt: false,
            isWis: false,
            isCon: false,
        }
        return getActorData(userId)?.setFlag(Declasse.ID, Declasse.FLAGS.atrributes, attributes);
    }

    static createProperties(userId) {
        const properties = [
            { name: 'D8 HP', cost: 2, used: false},
            { name: 'D10 HP', cost: 4, used: false},
            { name: 'D12 HP', cost: 6, used: false},
            { name: 'Light armor proficiency', cost: 1, used: false},
            { name: 'Medium armor (+shields) proficiency', cost: 2, used: false},
            { name: 'Heavy armor proficiency', cost: 3, used: false},
            { name: 'Simple weapons + 4 martial proficiency', cost: 1, used: false},
            { name: 'Martial weapons cumulative proficiency', cost: 2, used: false},
            { name: 'Tool proficiency (can be taken once)', cost: 1, used: false},
            { name: 'Skill proficiency (can be taken twice)', cost: 1, used: false},
          ];

        return getActorData(userId)?.setFlag(Declasse.ID, Declasse.FLAGS.properties, properties);
        }
    
    static createHistory (userId) {
        const history = [];
        return getActorData(userId)?.setFlag(Declasse.ID, Declasse.FLAGS.history, history);
    }

    static pushHistory(userId, history) {
        const historyArray = DeclasseData.getHistory(userId);
        
        console.log(historyArray);

        historyArray.unshift(history);
        return getActorData(userId)?.setFlag(Declasse.ID, Declasse.FLAGS.history, historyArray);
    }

    static deleteHistoryItemById(userId, id) {
        let historyArray = DeclasseData.getHistory(userId);
        historyArray = historyArray.filter((item) => item.id !== id);
        return getActorData(userId)?.setFlag(Declasse.ID, Declasse.FLAGS.history, historyArray);
    }

    static getHistory(userId) {
        return getActorData(userId)?.getFlag(Declasse.ID, Declasse.FLAGS.history);
    }

    static getAttributes(userId) {
        return getActorData(userId)?.getFlag(Declasse.ID, Declasse.FLAGS.atrributes);
    }
    
    static getProperties(userId) {
        return getActorData(userId)?.getFlag(Declasse.ID, Declasse.FLAGS.properties);
    }

    static setAttributes(userId, attributes) {
        return getActorData(userId)?.setFlag(Declasse.ID, Declasse.FLAGS.atrributes, attributes);
    }

    static setProperties(userId, properties) {
        return getActorData(userId)?.setFlag(Declasse.ID, Declasse.FLAGS.properties, properties);
    }

    static decreaseFP(userId, amount) {
        const attributes = DeclasseData.getAttributes(userId);
        attributes.fp -= amount;
        DeclasseData.setAttributes(userId, attributes);
    }

    static decreaseAP(userId, amount) {
        const attributes = DeclasseData.getAttributes(userId);
        attributes.ap -= parseInt(amount);
        DeclasseData.setAttributes(userId, attributes);
    }

    static increaseFP(userId, amount) {
        const attributes = DeclasseData.getAttributes(userId);
        attributes.fp += amount;
        DeclasseData.setAttributes(userId, attributes);
    }

    static increaseAP(userId, amount) {
        const attributes = DeclasseData.getAttributes(userId);
        attributes.ap += parseInt(amount);
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

Hooks.once('init', async function() {});

Hooks.on('renderDeclasseSettingsTable', async function(sheet, html, data) {
    

    function toggleCheckbox(attribute) {
        const attributes = DeclasseData.getAttributes(data.userId);
        attributes[attribute] = !attributes[attribute];
        DeclasseData.setAttributes(data.userId, attributes);
}


   const checkboxes = document.querySelectorAll('.declasse-settings');
       checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', () => {
            const attribute = checkbox.value;
            toggleCheckbox(attribute, checkbox.className);
 });
});

});

Hooks.on('renderActorSheet5eCharacter', async function(sheet, html, data) {

    if(!getActorData(sheet.actor.id).getFlag(Declasse.ID, Declasse.FLAGS.atrributes)) {
        DeclasseData.createData(sheet.actor.id);
        DeclasseData.createProperties(sheet.actor.id);
        DeclasseData.createHistory(sheet.actor.id);
    } else {
        DeclasseData.setMental(sheet.actor.id);
        DeclasseData.setPhysical(sheet.actor.id);
    }




    // Make features tab minimizable
    
    const features = html.find(".biography");
    if(!DeclasseData.getHistory(sheet.actor.id)) {
        features.append(` <li class = "items-header flexrow"> <h3>Declasse History</h3> </li>`);
    } else {
    features.prepend(`
    <ol class="items-list">
    <li id = "list-header" class = "list-header items-header flexrow"> <h3>Declasse History</h3>
    <i class = "toggle-btn fas fa-plus"> </i>
    </li>
    <ol class="list-items">
    ${DeclasseData.getHistory(sheet.actor.id).map( (history, index) => {
    return ` <li class="item flexrow">
    <div class="item-name declasse-history-item">
    <h4> ${index + 1}.) <span class = "bold"> ${history.name} </span> -  ${history.type} </h4>
    </div>
    <div class="item-description">
    <p>AP Cost: ${history.ap} END AP = ${history.type === "Added" ? parseInt(history.playerAp) - parseInt(history.ap) :  parseInt(history.playerAp) + parseInt(history.ap)}
    START AP = ${history.playerAp}
    Time: ${history.date}</p>
    </div>
    </li>`
    })}
    </ol>
     </ol>
     <ol class="items-list">
     <li class = "items-header flexrow"> <h3>Biography</h3> </li>
     </ol>
     `);
}



const header = html.find('#list-header');
const items =  html.find('.list-items');
const toggle = html.find('.toggle-btn');
const itemName = html.find('.declasse-history-item');



/*
    Add event listener to each item name
*/
for(let i = 0; i < itemName.length; i++) {
    itemName[i].addEventListener('click', () => {
        const id = DeclasseData.getHistory(sheet.actor.id)[i].id;
        const item = getItemData(id);
        item.sheet.render(true);
    });
}

header.click(() => { 
    items.toggleClass('show');
    toggle.toggleClass('fa-plus');
    toggle.toggleClass('fa-minus');
});



    const table = html.find(".traits")
    table.prepend(`
    <div class = "counter flexrow"> <h4 class="fas fa-hand-fist"> Physical Mod: </h4> <i></i> ${DeclasseData.getAttributes(sheet.actor.id).physical} </div>
    <div class = "counter flexrow"> <h4 class = "fas fa-head-side-brain"> Mental Mod:</h4> <i></i> ${DeclasseData.getAttributes(sheet.actor.id).mental}</div>
    <div class = "counter flexrow"> <h4 class = "fas fa-dragon">  FP: </h4> <i></i> ${DeclasseData.getAttributes(sheet.actor.id).fp}</div>
    <div class = "counter flexrow"> <h4 class = "fas fa-hat-wizard"> AP: </h4> <i></i> ${DeclasseData.getAttributes(sheet.actor.id).ap} </div>
    <div class="buttons"> <div id="settings">Settings</div> <div id = "skills">FP/AP</div> </div>`);
    table.find(".buttons #settings").click(function() {
        new DeclasseSettingsTable(sheet.actor.id).render(true, {userId: sheet.actor.id});
    });
    table.find(".buttons #skills").click(function() {
        new DeclasseSkills(sheet.actor.id).render(true, {userId: sheet.actor.id});
    });

});

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag('Sharns-Declasse');
  });

Hooks.once('ready', async function() {
    getAllActorIdsInArray().forEach(actorId => {
        if(!getActorData(actorId).getFlag(Declasse.ID, Declasse.FLAGS.atrributes)) {
            DeclasseData.createData(actorId);
            DeclasseData.createProperties(actorId);
            DeclasseData.createHistory(actorId);
            DeclasseData.setMental(actorId);
            DeclasseData.setPhysical(actorId);
        }
    }); 
});


export { DeclasseData, Declasse };