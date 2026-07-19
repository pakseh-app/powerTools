/* ============================================================
 * PowerTools AI Creator Suite
 * Story Engine v1.0
 *
 * AI Story & Script Generator System
 * ============================================================ */


class StoryEngine {


    constructor(){


        this.version = "1.0";


        this.stories = [];


        this.memory = {


            title:"",
            genre:"",
            theme:"",
            characters:[],
            scenes:[]


        };



        this.settings = {


            defaultGenre:
            "cinematic story",


            defaultLength:
            "short film",


            defaultStructure:
            "three act structure"



        };


    }







    /* ============================================================
     * CREATE STORY PROJECT
     * ============================================================ */


    createStory(data = {}){


        const story = {


            id:
            this.stories.length + 1,


            title:
            data.title ||
            "Untitled Story",


            genre:
            data.genre ||
            this.settings.defaultGenre,


            theme:
            data.theme ||
            "inspiring journey",


            duration:
            data.duration ||
            this.settings.defaultLength,


            structure:
            data.structure ||
            this.settings.defaultStructure,


            premise:
            data.premise ||
            "",


            characters:
            [],


            scenes:
            [],


            script:
            "",


            created:
            new Date().toISOString()



        };



        this.stories.push(story);



        return story;


    }







    /* ============================================================
     * SET STORY MEMORY
     * ============================================================ */


    setMemory(data = {}){


        this.memory = {


            ...this.memory,


            ...data



        };



        return this.memory;


    }



    /* ============================================================
     * GENRE LIBRARY
     * ============================================================ */


    genreLibrary(){


        return {


            adventure:
            "epic adventure story with exploration and discovery",


            drama:
            "emotional human drama with deep character development",


            action:
            "fast paced action story with intense conflict",


            comedy:
            "lighthearted comedy story with funny situations",


            horror:
            "dark horror atmosphere with suspense and fear",


            romance:
            "emotional romantic story about relationships",


            documentary:
            "realistic documentary storytelling style",


            fantasy:
            "fantasy world with imagination and magic",


            inspirational:
            "motivational story with positive message"



        };


    }







    /* ============================================================
     * STORY STRUCTURE LIBRARY
     * ============================================================ */


    structureLibrary(){


        return {


            threeAct:

            {


                act1:
                "Introduction, character, world building, main problem",


                act2:
                "Conflict, challenges, character growth, climax preparation",


                act3:
                "Resolution, conclusion, emotional ending"



            },



            heroJourney:

            {


                step1:
                "Ordinary world",


                step2:
                "Call to adventure",


                step3:
                "Trials and challenges",


                step4:
                "Transformation",


                step5:
                "Return with new wisdom"



            },



            shortVideo:

            {


                hook:
                "Strong opening in first seconds",


                problem:
                "Introduce conflict",


                solution:
                "Show transformation",


                ending:
                "Memorable closing"



            }



        };


    }







    /* ============================================================
     * THREE ACT STORY GENERATOR
     * ============================================================ */


    generateThreeAct(story){


        if(!story){


            return null;


        }



        const structure =
        this.structureLibrary().threeAct;



        return {


            title:
            story.title,


            act1:

            {


                name:
                "Beginning",


                description:
                structure.act1,


                content:
                `
                Introduce the main character.
                Show the world and situation.
                Present the first challenge.
                `



            },



            act2:

            {


                name:
                "Middle",


                description:
                structure.act2,


                content:
                `
                Character faces obstacles.
                Conflict becomes stronger.
                Character learns and changes.
                `



            },



            act3:

            {


                name:
                "Ending",


                description:
                structure.act3,


                content:
                `
                Final confrontation.
                Problem solved.
                Emotional conclusion.
                `



            }



        };


    }







    /* ============================================================
     * STORY FORMULA BUILDER
     * ============================================================ */


    buildFormula(type = "threeAct"){


        const formulas =
        this.structureLibrary();



        return formulas[type] ||
        formulas.threeAct;


    }


  

    /* ============================================================
     * CHARACTER ROLE GENERATOR
     * ============================================================ */


    createCharacter(data = {}){


        const character = {


            id:
            this.memory.characters.length + 1,


            name:
            data.name ||
            "Main Character",


            role:
            data.role ||
            "protagonist",


            personality:
            data.personality ||
            "determined and kind",


            background:
            data.background ||
            "unknown background",


            goal:
            data.goal ||
            "achieve something important",


            weakness:
            data.weakness ||
            "personal weakness",


            growth:
            data.growth ||
            "learn valuable lesson",


            created:
            new Date().toISOString()



        };



        this.memory.characters.push(character);



        return character;


    }







    /* ============================================================
     * CHARACTER ARC BUILDER
     * ============================================================ */


    createCharacterArc(character){


        if(!character){


            return null;


        }



        return {


            character:
            character.name,



            beginning:

            `
            Character starts with:

            ${character.weakness}

            `,



            conflict:

            `
            Character faces challenges
            that test personality and goal.
            `,



            transformation:

            `
            Character grows and learns:

            ${character.growth}

            `,



            ending:

            `
            Character becomes a better version
            of themselves.
            `



        };


    }







    /* ============================================================
     * CONFLICT BUILDER
     * ============================================================ */


    createConflict(data = {}){


        return {


            type:
            data.type ||
            "internal conflict",


            problem:
            data.problem ||
            "main character faces obstacle",


            pressure:
            data.pressure ||
            "situation becomes more difficult",


            consequence:
            data.consequence ||
            "failure creates emotional impact",


            resolution:
            data.resolution ||
            "character finds solution"



        };


    }







    /* ============================================================
     * EMOTION FLOW ENGINE
     * ============================================================ */


    emotionFlow(){


        return {


            opening:
            "curiosity and attention",


            rising:
            "tension and emotional connection",


            climax:
            "strong emotional peak",


            ending:
            "satisfaction and memorable feeling"



        };


    }







    /* ============================================================
     * STORY DEVELOPMENT ENGINE
     * ============================================================ */


    developStory(story){


        if(!story){


            return null;


        }



        const structure =
        this.generateThreeAct(story);



        story.structureData =
        structure;



        story.emotion =
        this.emotionFlow();



        story.characters =
        this.memory.characters;



        return story;


    }


  

    /* ============================================================
     * SCENE BREAKDOWN GENERATOR
     * ============================================================ */


    createSceneBreakdown(story, totalScene = 5){


        if(!story){


            return [];


        }



        let scenes = [];



        for(
            let i = 1;
            i <= totalScene;
            i++
        ){


            scenes.push({


                id:
                i,


                title:
                `Scene ${i}`,


                purpose:
                i === 1 ?

                "Introduce character and world"

                :

                i === totalScene ?

                "Final resolution and ending"

                :

                "Develop conflict and story progression",



                location:
                "cinematic environment",


                action:
                "main character performing important action",


                emotion:
                "natural emotional expression",


                duration:
                "8 seconds"



            });


        }



        story.scenes =
        scenes;



        return scenes;


    }







    /* ============================================================
     * SCRIPT GENERATOR
     * ============================================================ */


    generateScript(story){


        if(!story){


            return "";


        }



        let script = "";



        script +=

`

TITLE:

${story.title}



GENRE:

${story.genre}



THEME:

${story.theme}



STORY:

${story.premise}



`;


        if(
            story.scenes.length > 0
        ){


            script +=

`
SCENE BREAKDOWN:

`;



            story.scenes.forEach(
                (scene)=>{


                    script +=

`

SCENE ${scene.id}

Location:
${scene.location}


Action:
${scene.action}


Emotion:
${scene.emotion}


Purpose:
${scene.purpose}


`;



                }

            );



        }



        story.script =
        script;



        return script;


    }







    /* ============================================================
     * DIALOGUE GENERATOR
     * ============================================================ */


    generateDialogue(character, situation){


        return {


            speaker:
            character?.name ||
            "Narrator",


            emotion:
            character?.personality ||
            "neutral",


            dialogue:

            `
            I must continue forward.

            Even though this journey is difficult,
            I will find a way.

            ${situation || ""}

            `



        };


    }







    /* ============================================================
     * STORY TO SCENE CONVERTER
     * ============================================================ */


    convertToSceneEngine(story){


        if(!story || !story.scenes){


            return [];


        }



        return story.scenes.map(

            (scene)=>{


                return {


                    environment:
                    scene.location,


                    action:
                    scene.action,


                    duration:
                    scene.duration,


                    style:
                    "cinematic realistic",


                    lighting:
                    "cinematic natural lighting"



                };


            }

        );


    }


  

    /* ============================================================
     * EXPORT STORY JSON
     * ============================================================ */


    exportJSON(){


        return JSON.stringify(

            {


                engine:
                "PowerTools AI Creator Suite",


                module:
                "Story Engine",


                version:
                this.version,


                created:
                new Date().toISOString(),


                memory:
                this.memory,


                stories:
                this.stories



            },


            null,


            4


        );


    }







    /* ============================================================
     * EXPORT SCRIPT TXT
     * ============================================================ */


    exportTXT(){


        let output = "";



        output +=

`
POWERTOOLS AI CREATOR SUITE

STORY ENGINE EXPORT

`;



        this.stories.forEach(

            (story)=>{


                output +=

`

=================================

TITLE:

${story.title}


GENRE:

${story.genre}


THEME:

${story.theme}



PREMISE:

${story.premise}



SCRIPT:

${story.script}



=================================

`;



            }

        );



        return output;


    }







    /* ============================================================
     * FINAL STORY PACKAGE
     * ============================================================ */


    generatePackage(){


        return {


            engine:
            "Story Engine",


            version:
            this.version,


            totalStory:
            this.stories.length,


            characters:
            this.memory.characters,


            stories:
            this.stories,


            json:
            this.exportJSON(),


            text:
            this.exportTXT()



        };


    }







    /* ============================================================
     * CLEAR MEMORY
     * ============================================================ */


    reset(){


        this.stories = [];


        this.memory = {


            title:"",
            genre:"",
            theme:"",
            characters:[],
            scenes:[]


        };



        return {


            status:
            "success",


            message:
            "Story memory cleared"



        };


    }



}







/* ============================================================
 * GLOBAL INSTANCE
 * ============================================================ */


const storyEngine =
new StoryEngine();







/* ============================================================
 * POWERTOOLS LOADER
 * ============================================================ */


console.log(

    "%c====================================",

    "color:#06b6d4"

);



console.log(

    "%c PowerTools AI Creator Suite",

    "color:#22c55e;font-weight:bold"

);



console.log(

    "%c Story Engine v1.0 Loaded",

    "color:#facc15"

);



console.log(

    "%c AI Story Generator Ready",

    "color:#38bdf8"

);
