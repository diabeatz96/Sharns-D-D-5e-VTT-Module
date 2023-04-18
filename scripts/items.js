import { Declasse, DeclasseData } from "./module.js";
import { getActorData, getActorItem, getItemData } from "./helpers.js";
/*
    This script will allow you to inject a feature option into the game that will allow you to
    change the physical and mental modifiers for the Declasse system. 
    When selecting a feature, you will be able to select a physical or mental modifier addition based on your
    character's attributes.

    This will be put under the details tab of the character sheet.
    The feature will be called "Declasse Settings and Effect the rolls".
*/

class ItemSheetData {

   static createItemSheetData(itemId) {
        const triggers = {
            physical: false,
            mental: false,
            AP: 0,
            tags: ["test-tag", "ASI", "BUTTON"],
        }
        return getItemData(itemId)?.setFlag(Declasse.ID, Declasse.FLAGS.triggers, triggers);
    }

    static getTriggers(userId, itemId) {
        return getActorItem(userId, itemId)?.getFlag(Declasse.ID, Declasse.FLAGS.triggers);
    }

    static setTriggers(userId, itemId, triggers) {
        return getActorItem(userId, itemId)?.setFlag(Declasse.ID, Declasse.FLAGS.triggers, triggers);
    }

    static setAP (itemId, AP) {
        let triggers = getItemData(itemId).getFlag(Declasse.ID, Declasse.FLAGS.triggers);
        triggers.AP = AP;
        getItemData(itemId).setFlag(Declasse.ID, Declasse.FLAGS.triggers, triggers);
    }

    static getPlayerItemAP(actorId, itemId) {
        return getActorItem(actorId, itemId).getFlag(Declasse.ID, Declasse.FLAGS.triggers).AP;
    }
    
    static setPlayerItemAP(actorId, itemId, AP) {
        let triggers = getActorItem(actorId, itemId).getFlag(Declasse.ID, Declasse.FLAGS.triggers);
        triggers.AP = AP;
        getActorItem(actorId, itemId).setFlag(Declasse.ID, Declasse.FLAGS.triggers, triggers);
    }

    static setTags (itemId, tags) {
        let triggers = getItemData(itemId).getFlag(Declasse.ID, Declasse.FLAGS.triggers);
        triggers.tags = tags;
        getItemData(itemId).setFlag(Declasse.ID, Declasse.FLAGS.triggers, triggers);
    }

    static setPlayerItemTags(actorId, itemId, tags) {
        let triggers = getActorItem(actorId, itemId).getFlag(Declasse.ID, Declasse.FLAGS.triggers);
        triggers.tags = tags;
        getActorItem(actorId, itemId).setFlag(Declasse.ID, Declasse.FLAGS.triggers, triggers);
    }

    static getAP(itemId) {
        return getItemData(itemId).getFlag(Declasse.ID, Declasse.FLAGS.triggers).AP;
    }

    static getTags(itemId) {
        return getItemData(itemId).getFlag(Declasse.ID, Declasse.FLAGS.triggers).tags;
    }

    static getPlayerItemTags(actorId, itemId) {
        return getActorItem(actorId, itemId).getFlag(Declasse.ID, Declasse.FLAGS.triggers).tags;
    }
};

const renderSidebar = (sheet, html, data) => {
    const sidebar = html.find(".item-properties");
    
    //check if item is class
    if(sheet.item.type !== "feat") {
        return;
    }
   
    if(sheet.actor) {
        if(!ItemSheetData.getTriggers(sheet.actor.id, sheet.item.id)) {
            ItemSheetData.createItemSheetData(sheet.item.id);
        }
    } else {
        if(getItemData(sheet.item.id).getFlag(Declasse.ID, Declasse.FLAGS.triggers) === undefined) {
            ItemSheetData.createItemSheetData(sheet.item.id);
        }
    }


    sidebar.append(`<label class = 'properties-header'> Tags </label> <ol class = 'properties-list'>
    
    ${!sheet.actor ?
        ItemSheetData.getTags(sheet.item.id).map(tag => `<li>${tag}</li>`).join("")
        :
        ItemSheetData.getPlayerItemTags(sheet.actor.id, sheet.item.id).map(tag => `<li>${tag}</li>`).join("")
    }    
    </ol>`); 
    // create a button that will allow you to add a tag to the item
    sidebar.append(`<div> <label class = "properties-header"> Tags settings </label>
    <button id = 'save-tag'> Save Tag </button>
    <input class = "flex-row small-input-height" type = "text" placeholder ="type tag here" id = 'tag'>
    <button id = 'delete-tag'> Delete Tag </button>
    </div>`);

    html.find("#save-tag").click(() => {
        let tag = html.find("#tag").val();
        let tags = !sheet.actor ? ItemSheetData.getTags(sheet.item.id) : ItemSheetData.getPlayerItemTags(sheet.actor.id, sheet.item.id);
        tags.push(tag);
        console.log(tags);

        if(sheet.actor) {
            ItemSheetData.setPlayerItemTags(sheet.actor.id, sheet.item.id, tags);
            return; 
        }

        ItemSheetData.setTags(sheet.item.id, tags);
    })

    html.find("#delete-tag").click(() => {
        let tags = !sheet.actor ? ItemSheetData.getTags(sheet.item.id) : ItemSheetData.getPlayerItemTags(sheet.actor.id, sheet.item.id);
        tags.pop();

        if(sheet.actor) {
            ItemSheetData.setPlayerItemTags(sheet.actor.id, sheet.item.id, tags);
            return;
        }

        ItemSheetData.setTags(sheet.item.id, tags);
    })

    sidebar.append(`<div> <label class = "properties-header"> AP </label> <input type = 'number' id = 'ap' value = '${!sheet.actor ? ItemSheetData.getAP(sheet.item.id) : ItemSheetData.getPlayerItemAP(sheet.actor.id, sheet.item.id)}'> </div>`);
    sidebar.append(`<button id = 'save'> Save </button>`);

    html.find("#save").click(() => {
        let AP = html.find("#ap").val();
      
        if(sheet.actor) {
            ItemSheetData.setPlayerItemAP(sheet.actor.id, sheet.item.id, AP);
            return;
        }

        ItemSheetData.setAP(sheet.item.id, AP);
    });
}


const renderDetails = (sheet, html, data) => {
    const table = html.find(".details");

    if(!sheet.actor) { 
        table.append(`<h3 class = "form-header"> Declasse Modifiers </h3> <p class = "bold"> Please Attach to character sheet first. </p>`);
        return; 
    }

    console.log(sheet.actor.id)

    const actorId = sheet.actor.id;

    function setPhysicalItem(state) {
        let triggers = ItemSheetData.getTriggers(actorId, sheet.item.id);
        if(state === "false") {
            triggers.physical = false;
        } else {
        triggers.physical = true;
        addBonuses("physical");
        console.log(triggers.physical + " " + sheet.item.id + " " + actorId);
        }
        ItemSheetData.setTriggers(actorId, sheet.item.id, triggers);
    }

    function setMentalItem(state) {
        let triggers = ItemSheetData.getTriggers(actorId, sheet.item.id);
        if(state === "false") {
            triggers.mental = false;
            ItemSheetData.setTriggers(actorId, sheet.item.id, triggers);
        } else {
        triggers.mental = true;
        console.log(triggers.mental + " " + sheet.item.id + " " + actorId);
        }
        ItemSheetData.setTriggers(actorId, sheet.item.id, triggers);
    }


    if(!ItemSheetData.getTriggers(actorId, sheet.item.id)) {
        ItemSheetData.createItemSheetData(actorId, sheet.item.id);
        console.log("Created Data");
    } else {
        console.log("Data already exists");
    }

    // If table is a feature, add the Declasse Modifiers


    // create button tp toggle physical and mental modifiers
    table.prepend(`
    <h3 class = "form-header"> Declasse Modifiers </h3>
    <div class = "form-group flexrow">
    <label> Modifiers </label>
    <ul class = "traits-list">
    <li class = "tag">  Physical Mod:  ${DeclasseData.getAttributes(actorId).physical} </li>
    <li class = "tag">  Mental Mod:  ${DeclasseData.getAttributes(actorId).mental} </li>
    <li class = "tag">  Mental Save DC:  ${DeclasseData.getAttributes(actorId).mental + 8 + getActorData(actorId).system.attributes.prof} </li>
    <li class = "tag">  Physical Save DC  ${DeclasseData.getAttributes(actorId).physical + 8 + getActorData(actorId).system.attributes.prof} </li>
    </ul>
    </div>
    </div>
    `);

}


Hooks.on('preCreateItem', (item, data) => {


    // Before this line do any work with items that do not have an actor
    if(!item.actor) { return; }
    // After this line do any work with items that have an actor

    if(item.type === "feat") {
        const itemAp = ItemSheetData.getAP(item.id);
        const actorAttributes = DeclasseData.getAttributes(item.actor.id);
        
        if(actorAttributes.ap - itemAp < 0) {
            ui.notifications.error("You do not have enough AP to purchase this item check your current AP");
            ui.notifications.error("Current AP: " + actorAttributes.ap);
            //stop item creation
            return;
        }
        // get history from declasse data
        // set history
        console.log(itemAp);
        console.log(item);

        DeclasseData.pushHistory(item.actor.id, {
            type: "Added",
            id: item.id,
            name: item.name,
            ap: itemAp,
            playerAp: DeclasseData.getAttributes(item.actor.id).ap,
            date: new Date().toLocaleString()
        });
        DeclasseData.decreaseAP(item.actor.id, itemAp);
        ui.notifications.info("You have successfully added " + item.name + " to your features");
    }

});

Hooks.on('preDeleteItem', (item, data) => {

    if(item.type === "feat" && item.actor) {
        const itemAp = ItemSheetData.getPlayerItemAP(item.actor.id, item.id);
        DeclasseData.increaseAP(item.actor.id, itemAp);
        ui.notifications.warn("You have successfully removed " + item.name + " from your features, your AP has been refunded");
        
        console.log(data);
        console.log(item.flags);

        DeclasseData.pushHistory(item.actor.id, {
            type: "Deleted",
            id: item.flags.core.sourceId.substring(5),
            name: item.name,
            ap: itemAp,
            playerAp: DeclasseData.getAttributes(item.actor.id).ap,
            date: new Date().toLocaleString()
        });
        
    }

  
    console.log("Item Deleted");

});

Hooks.on("renderItemSheet5e", (sheet, html, data) => {
    

    renderSidebar(sheet, html, data);
    renderDetails(sheet, html, data);
    
 ;

});

Hooks.on("renderChatMessage", (message, html, data) => {

});

Hooks.on("useItem", (actor, item) => {
    
    console.log(item.system);
});
