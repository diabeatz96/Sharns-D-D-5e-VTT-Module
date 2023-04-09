import { getActorData, setClassHitDie } from './helpers.js';
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

Hooks.on('renderDeclasseSkills', (app, html, data) => {


  const spendButtons = document.querySelectorAll('.spend-button');   


  spendButtons.forEach(button => {
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
});

});
