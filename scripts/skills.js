import { getActorData, hasAnyClass } from './helpers.js';
import { Declasse, DeclasseData } from './module.js';

export class DeclasseSkills extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions;
  
        const overrides = {
          height: 'auto',
          width: "600px",
          id: Declasse.ID,
          template: 'modules/Sharns-Declasse/templates/skills.hbs',
          title: 'Skills Allocation',
          userId: null,
        };
        
    

        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions; 
    }

    getData() {
        return {
            attributes: DeclasseData.getAttributes(this.options.userId),
            properties: DeclasseData.getProperties(this.options.userId),
            userId: this.options.userId,        
        };
    }
}

// write a function to change dnd5e class hit die
function setNewClassHitDie(userId, hitDie) {
    const actor = getActorData(userId);
    const classData = actor.items.find(i => i.type === "class");
    classData.hitDie = hitDie;
    console.log(classData);
    // list all embedded documents
   
    const collection = actor.getEmbeddedCollection("Item");

    collection.forEach(item => {
        if (item.type === "class") {
            item.update({"hitDie": hitDie});
            item.update({"system.hitDice": hitDie});
            console.log(item);
        }
    });

    console.log(actor.items.find(i => i.type === "class"));   
}



Hooks.on('renderDeclasseSkills', (app, html, data) => {

  const spendButtons = html.find('.spend-button');   
  const fundamentals = html.find('.fp-properties');
  
  for(let i = 0; i < fundamentals.length; i++) {
    if(DeclasseData.getProperties(data.userId)[i].used === false) {
    fundamentals[i].style.textDecoration = "none";
    } else {
        fundamentals[i].style.textDecoration = "line-through";
    }
}

  for(let i = 0; i < fundamentals.length; i++) {
    console.log(fundamentals[i].cost);
    fundamentals[i].addEventListener('click', () => {
        const fundamental = fundamentals[i];

        // check if player has a class
        if(!hasAnyClass(data.userId)) {
            ui.notifications.error("Please select a class first, or drag Declasse to the character sheet");
            return;
        }


        if(DeclasseData.getProperties(data.userId)[i].used === false) {
            if(DeclasseData.getAttributes(data.userId).fp - DeclasseData.getProperties(data.userId)[i].cost < 0) {
                ui.notifications.error("You don't have enough FP to buy this fundamental");
                return;
           } 
            const characterProperties = DeclasseData.getProperties(data.userId);
            characterProperties[i].used = true;
            DeclasseData.decreaseFP(data.userId, characterProperties[i].cost);
            DeclasseData.setProperties(data.userId, characterProperties);
            fundamental.style.textDecoration = "line-through";
        } else {
            const characterProperties = DeclasseData.getProperties(data.userId);
            characterProperties[i].used = false;
            DeclasseData.increaseFP(data.userId, characterProperties[i].cost);
            DeclasseData.setProperties(data.userId, characterProperties);
            fundamental.style.textDecoration = "none";
        }

        switch(fundamental.innerText) {
            case "D8 HP":
                break;
            case "D10 HP":
                break;
            case "D12 HP":
                break;
            case "Light armor proficiency":
                break;
            case "Medium armor (+shields) proficency":
                break;
            case "Heavy armor proficiency":
                break;
            case "Simple weapons + 4 martial proficiency":
                break;
            case "Martial weapons cumulative proficiency":
                break;
            case "Tool proficiency (can be taken once)":
                break;
            case "Skill proficiency (can be taken twice)":
                break;
            default:
                console.log("Error: Fundamental not recognized");
        }
    });

    html.find("#current-fp").text(DeclasseData.getAttributes(data.userId).fp);
    }
    
  for( let i = 0; i < spendButtons.length; i++) {
        const button = spendButtons[i];
        button.addEventListener('click', () => {
            switch(button.id) {
                case "increase-ap":
                    const currentap = html.find("#current-ap");
                    DeclasseData.increaseAP(data.userId, 1);
                    currentap.css("color", "black");
                    html.find("#current-ap").text(DeclasseData.getAttributes(data.userId).ap);
                break;
                case "decrease-ap":
                    if (DeclasseData.getAttributes(data.userId).ap <= 0) {
                        const currentap = html.find("#current-ap");
                        currentap.css("color", "red");
                    } else {
                        const currentap = html.find("#current-ap");
                        currentap.css("color", "black");
                        DeclasseData.decreaseAP(data.userId, 1);
                        html.find("#current-ap").text(DeclasseData.getAttributes(data.userId).ap);
                    }
                break;
                case "increase-fp":
                    const currentfp = html.find("#current-fp");
                    if(DeclasseData.getAttributes(data.userId).fp >= 12) {
                        currentfp.css("color", "green");
                    } else {
                    DeclasseData.increaseFP(data.userId, 1);
                    currentfp.css("color", "black");
                    html.find("#current-fp").text(DeclasseData.getAttributes(data.userId).fp);
                    }
                break;
                case "decrease-fp":
                    if (DeclasseData.getAttributes(data.userId).fp <= 0) {
                        const currentfp = html.find("#current-fp");
                        currentfp.css("color", "red");
                    } else {
                        const currentfp = html.find("#current-fp");
                        currentfp.css("color", "black");
                        DeclasseData.decreaseFP(data.userId, 1);
                        html.find("#current-fp").text(DeclasseData.getAttributes(data.userId).fp);
                    }
                break;
                default:
                    console.log("Error: Button ID not recognized");
                break;
            }
        });
    }
        
});
