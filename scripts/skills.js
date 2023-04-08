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
  const pointsSpans = document.querySelectorAll('.points');

  console.log(spendButtons);
  console.log(pointsSpans);

});
