import allBlocks from './blockStats.js';
import shipCalculator from './shipCalculator.js';


//DOM elements
    //Block Calculator
        //Drop Down Boxes
        const materialDropBox = document.getElementById('material');
        const blockDropBox = document.getElementById('block');
        const statDropBox = document.getElementById('stat');
        //Stat Preview
        const statPreview = document.getElementById('statPreview');

        //Text Boxes
        const quantityTextBox = document.getElementById('quantityTextBox');
        const totalTextBox = document.getElementById('totalTextBox');

    //Main Ship Calculator
        //Ship Name
        const shipNameTextBox = document.getElementById('shipName');
        //Drop DOwn Boxes
        const buildingKnowledgeDropBox = document.getElementById('buildingKnowledgeDropBox');
        const blockPaletteDropBox = document.getElementById('blockPaletteDropBox');

        //Input Allocation Text Boxes
        const shieldAllocationTextBox = document.getElementById('shieldAllocationTextBox');
        const engineAllocationTextBox = document.getElementById('engineAllocationTextBox');
        //Other Inputs
        const PPLimitTextBox = document.getElementById('PPLimitTextBox');
        const armorTotalTextBox = document.getElementById('armorTotalTextBox');
        const thrusterTotalTextBox = document.getElementById('thrusterTotalTextBox');

//event listeners
    //Block Calculator
        //drop down boxes

        //Cascade when any of they're called material -> block -> stat
        //passes runCalc a boolean which triggers the Stat Calculator (statCalc)
        //runCalc checks if the block and stat are valid
        materialDropBox.addEventListener("input", () => {materialDropEvent();});
        function materialDropEvent() {
            //handles block list update
            let runCalc = updateBlockOptions(blockList, validateDropDown(validMaterials, materialDropBox.value), blockDropBox);
            //aswell as triggering the block drop down event
            blockDropEvent(runCalc);
        }
        //called code moved to function so other listeners can call them aswell
        blockDropBox.addEventListener("input", () => {blockDropEvent();});
        function blockDropEvent(runCalc=true) {
            //updates unique label for the other variable
            //runCalc must be second to prevent short circuiting (or seperate the second part to a constant first)
            //short circuiting in boolean operations is when the output is already decided and doesnt need to look at second value
            //eg. an AND operation with the first condition false does not need to check the check the second value(will not run any of it)
            runCalc = updateStatOtherLabel(blockList, validateDropDown(validMaterials, materialDropBox.value), validateDropDown(validBlocks, blockDropBox.value),statDropBox) && runCalc;
            statDropEvent(runCalc);
        }

        //statDropBox.addEventListener("input", () => {statDropEvent();});
        statDropBox.addEventListener("input", () => {statDropEvent();})
        function statDropEvent(runCalc=true) {
            //update stat preview value
            statPreview.innerHTML = blockList[validateDropDown(validMaterials, materialDropBox.value)][validateDropDown(validBlocks, blockDropBox.value)][validateDropDown(validStats, statDropBox.value)];
            //triggers text box update without delay
            if (runCalc) {runBlockCalc(quantityTextBox, totalTextBox);}
        }
        
        //auto submit text box events
        quantityTextBox.addEventListener("input", () => {autoSubmit(runBlockCalc, [quantityTextBox, totalTextBox]);});
        totalTextBox.addEventListener("input", () => {autoSubmit(runBlockCalc, [totalTextBox, quantityTextBox, true]);});
        //event listener stores an unnamed function '() => {}' specific to that event
        //which contains a function (generic for handling any auto submit textbox)
    

    //Main Ship Calculator
        //Building Knowledge
        buildingKnowledgeDropBox.addEventListener("input", () => {updateBK()})
        //Palette Optimization
        blockPaletteDropBox.addEventListener("input", () => {})
        //PP Limit
        PPLimitTextBox.addEventListener("input", () => {autoSubmit(updatePPLimit);})

        //Input Allocation Variables
        shieldAllocationTextBox.addEventListener("input", () => {autoSubmit(inputAllocation, ["shieldPP", shieldAllocationTextBox]);})
        engineAllocationTextBox.addEventListener("input", () => {autoSubmit(inputAllocation, ["enginePP", engineAllocationTextBox]);})
        //Other
        armorTotalTextBox.addEventListener("input", () => {autoSubmit(inputAllocation, ["armorBlocks", armorTotalTextBox]);})
        thrusterTotalTextBox.addEventListener("input", () => {autoSubmit(inputAllocation, ["thrusterCount", thrusterTotalTextBox]);})


//utility functions

    //Text Box Auto Submit 
    let autoSubmitDelay
    function autoSubmit(Func, paramArray=[]) {
        //triggers fed function feeding it a array as parameters after a delay reduces load of server machine

        //Timeout is a set of built in JS functions
        clearTimeout(autoSubmitDelay)
        autoSubmitDelay = setTimeout(() => {
            
            Func(...paramArray)

        }, 500); // waits 500ms after last keystroke)
    }

    //Display Output
    function setOutputAsRegOrPH(output, newValue) {
        //checks newValue validity to output value otherwise sets 0 as a placeholder ghost
        if (newValue == 0) {
            output.value = '';
            output.placeholder = 0;}
        else {output.value = newValue}
    }

    //Convert String to Camel Case   
    function camelCase(string) {
        //turns a string into camel case string eg. 'camelCaseString'

        //sorts into an array of words removing all spaces
        let wordArray = string.toLowerCase().split(' ').filter(word => word != '')
        
        //capitalizes the first letter of each word
        let newString = ''
        wordArray.forEach(element => {
            newString += element.charAt(0).toUpperCase() + element.slice(1);
        });
        //lowers the first letter
        return newString.charAt(0).toLowerCase() + newString.slice(1)
    }



//Validation Functions

    //Validate Numeric Input
    function validateAsNumericInput(string) {
        //strips input string to only allow valid numbers and converts to Number

        //remove everything but 0-9 and . (g = global flag ensuring it matches all instances)
        //replace first decimal point '.' with a 'D'
        //remove other remaining decimal points '.'
        //set 'D' back to decimal point
        let validatedString = string.replace(/[^0-9.]/g, '').replace('.', 'D').replaceAll('.', '').replace('D', '.');
        
        //standardise 0 to remove . and trailing 0's
        if(validatedString > 0) {
            //inserts 0 if the decimal point is the first character
            if (validatedString.charAt(0) == '.') {validatedString = '0'+validatedString;}
        }
        else {validatedString = 0;}
        
        return Number(validatedString);
    }

    //Validate Drop Boxes
        //Arrays of Valid Values
            //Block Calc
                const validMaterials = ["iron", "titanium", "naonite", "trinium", "xanion", "ogonite", "avorion"];
                const validBlocks = ["blankHull", "smartHull", "armor", "engine", "cargoBay", "crewQuarters", "thruster", "directionalThruster", "gyroArray", "inertiaDampner", "framework", "scaffold", "hangar", "dock", "turretRotationLock", "flightRecorder", "assembly", "torpedoLauncher", "torpedoStorage", "turretBase", "shieldGenerator", "energyContainer", "generator", "integrityFieldGenerator", "computerCore", "hyperspaceCore", "transporter", "academy", "cloningPods", "solarPanel", "light", "glow", "glass", "reflector", "stone", "hologram", "richStone", "superRichStone", "shipName", "shipEmblem", "hullAlternatePatternA", "hullVividColors", "hullWhiteStripesA"];
                const validStats = ["cost$", "costM", "health", "weight", "procPower", "reqEnergy", "other"];
            //Ship Calc
                const validBK = validMaterials; //idential to valid materials
                const validPalette = ["processingPower", "weight", "custom"];

    function validateDropDown(validInputs, dropBoxValue) {
        //Validates if the value is part of the array otherwise replaces it with an empty value
        if (!validInputs.includes(dropBoxValue)) {dropBoxValue = "";}
        return dropBoxValue;
    }




//functions for block calculator

    //Main Operations Block Calculator
    function runBlockCalc(input, output, bool=false) {
        //runs data from input element through statCalc (from blockStats) then submits to output element

        //validate input
        const validInputValue = validateAsNumericInput(input.value);
        
        //bool inverts the calculation to find count instead of total
        let newValue = blockList.statCalc([validateDropDown(validMaterials, materialDropBox.value)], [validateDropDown(validBlocks, blockDropBox.value)], [validateDropDown(validStats, statDropBox.value)], validInputValue, bool);

        //update output
        //if value is greater than 0 update value if not clear and set to placeholder
        setOutputAsRegOrPH(output, newValue);

        //checks if input needs to be a placeholder
        //if (validInputValue == '') {input.value = 0};
        setOutputAsRegOrPH(input, validInputValue);
    }

    //drop down boxes
        //update block type based on material selected
        function updateBlockOptions(blockList, material, blockElement) {
            //return boolean true if current selected block is invalid
            let blockSelected = blockElement.value;
            let boolCurrentBlockSpotted = false;
            blockElement.length = 0;
            Object.values(blockList[material]).forEach(block => {
                if (!isNaN(block.cost$)) {
                    //camel cases block name to be used as a value
                    let value = camelCase(block.name)
                    blockElement.add(new Option(block.name, value));
                    //spots block
                    if (value == blockSelected) {boolCurrentBlockSpotted = true;}
                }
            });
            //if block not spotted in list output message
            if (!boolCurrentBlockSpotted) {
                blockElement.add(new Option(blockList[material][blockSelected].name + ' Block N/A', blockSelected));
                blockElement.options[blockElement.length - 1].hidden = true;
            }
            blockElement.value = blockSelected;
            return boolCurrentBlockSpotted;
        }

        //update stats available based on block selected
        function updateStatOtherLabel(blockList, material, block, statElement) {
            //returns boolean true if current selected stat is invalid
            //changes the other stats displayed message
            statElement.options[6].text = blockList[material][block].otherType
            let boolCurrentStatValid = true;
            if (blockList[material][block].other == '') {
                statElement.options[6].text = 'Unique Stat N/A'
                statElement.options[6].hidden = true

                //checking if other is selected when it shouldnt exist
                if (statElement.value == "other") {boolCurrentStatValid = false;}
            }
            else {statElement.options[6].hidden = false;}
            return boolCurrentStatValid;
        }


//functions for main Ship Calc

    //updates building Knowledge and 
    function updateBK() {
        let validBKVal = validateDropDown(validBK, buildingKnowledgeDropBox.value)
        if (validBKVal != "") {
            ship.changeBuildingKnowledge(validBKVal)
            PPLimitTextBox.value = ship.lookupPPLimitByBK(validBKVal);
        }
    }

    //updates PP Limit
    function updatePPLimit() {
        let newValue = validateAsNumericInput(PPLimitTextBox.value);
        if (newValue == 0) {newValue = ship.lookupPPLimitByBK(ship.buildingKnowledge)}
        PPLimitTextBox.value = newValue;
        ship.changePPLimit(newValue);
    }

    //handles input data to ship from textboxes and running the ship calc
    function inputAllocation(varToChange, input) {
        let newValue = validateAsNumericInput(input.value);
        setOutputAsRegOrPH(input, newValue);
        ship[varToChange] = newValue;
        ship.runCalcAll();
    }


//init code

    const blockList = new allBlocks;
    blockList.convertCSVIntoData("Iron,Blank Hull,12,5,4,51,,,0,0,,\nIron,Smart Hull,12,5,4,51,,,1,0.5,,\nIron,Armor,4,8,25,85,,,0,0,,\nIron,Engine,28,13,2,25,,,1,4,19600,Thrust (N)\nIron,Cargo Bay,28,13,4,17,,,1,0,0.44,CargoHold\nIron,Crew Quarters,25,12,4,34,,,1,5,,Crew Quarters\nIron,Thruster,17,8,1,26,,,1,4.5,,Thrust (N)\nIron,Directional Thruster,17,8,1,26,,,1,3.75,,Thrust (N)\nIron,Gyro Array,56,25,2,9,,,1,7.32,,\nIron,Inertia Dampner,334,150,1,26,,,1,54.39,,\nIron,Framework,1,1,0(0.005),0(0.034),,,0,0,,\nIron,Scaffold,1,1,0(0.005),0(0.034),,,0,0,,\nIron,Hangar,N/A,N/A,N/A,N/A,,,N/A,N/A,,Hangar Space\nIron,Dock,50,23,2,17,,,0,0,,\nIron,Turret Rotation Lock,23,10,2,1,,,0,0,,\nIron,Flight Recorder,223,100,8,85,,,1,0,,\nIron,Assembly,556,30,2,51,,,1,0,,Production\nIron,Torpedo Launcher,50,23,4,51,,,1,0,,\nIron,Torpedo Storage,50,23,4,51,,,1,0,,Torpedo Storage\nIron,Turret Base,23,10,8,68,,,0,0,,\nIron,Shield Generator,N/A,N/A,N/A,N/A,,,N/A,N/A,,Shield Strength\nIron,Energy Container,N/A,N/A,N/A,N/A,,,N/A,N/A,,Energy Storage (MW)\nIron,Generator,N/A,N/A,N/A,N/A,,,N/A,N/A,,Energy Generation (MW)\nIron,Integrity Field Generator,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nIron,Computer Core,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nIron,Hyperspace Core,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nIron,Transporter,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nIron,Academy,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nIron,Cloning Pods,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nIron,Solar Panel,77,12,0(0.25),9,,,0,0,6,Power Generation (MW)\nIron,Light,12,5,0(0.25),17,,,0,0,,\nIron,Glow,12,5,1,17,,,0,0,,\nIron,Glass,12,1,1,17,,,0,0,,\nIron,Reflector,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nIron,Stone,0,1,4,204,,,0,0,,\nIron,Hologram,NULL,NULL,NULL,NULL,,,NULL,NULL,,\nIron,Rich Stone,0,1,6,204,,,0,0,,\nIron,Super Rich Stone,0,3,35,425,,,0,0,,\nIron,Ship Name,12,5,2,51,,,0,0,,\nIron,Ship Emblem,12,5,4,51,,,0,0,,\nIron,Hull (Alternate Pattern A),12,5,4,51,,,0,0,,\nIron,Hull (Vivid Colors),12,5,4,51,,,0,0,,\nIron,Hull (White Stripes A),12,5,4,51,,,0,0,,\nTitanium,Blank Hull,15,5,6,30,,,0,0,,\nTitanium,Smart Hull,15,5,6,30,,,1,0.5,,\nTitanium,Armor,5,8,37,50,,,0,0,,\nTitanium,Engine,38,13,3,15,,,1,3.82,19995,Thrust (N)\nTitanium,Cargo Bay,38,13,6,10,,,1,0,0.44,CargoHold\nTitanium,Crew Quarters,34,12,6,20,,,1,5,,Crew Quarters\nTitanium,Thruster,23,8,1,15,,,1,4.3,,Thrust (N)\nTitanium,Directional Thruster,23,8,1,15,,,1,3.58,,Thrust (N)\nTitanium,Gyro Array,75,N/A,3,5,,,1,7.61,,\nTitanium,Inertia Dampner,N/A,1,N/A,N/A,,,N/A,N/A,,\nTitanium,Framework,1,1,0,0,,,0,0,,\nTitanium,Scaffold,1,1,0,0,,,0,0,,\nTitanium,Hangar,N/A,N/A,N/A,N/A,,,N/A,N/A,,Hangar Space\nTitanium,Dock,68,23,3,10,,,0,0,,\nTitanium,Turret Rotation Lock,30,10,3,10,,,0,0,,\nTitanium,Flight Recorder,300,100,12,50,,,1,0,,\nTitanium,Assembly,750,30,3,30,,,1,0,,Production\nTitanium,Torpedo Launcher,68,23,6,30,,,1,0,,\nTitanium,Torpedo Storage,68,23,6,30,,,1,0,,Torpedo Storage\nTitanium,Turret Base,30,10,12,40,,,0,0,,\nTitanium,Shield Generator,N/A,N/A,N/A,N/A,,,N/A,N/A,,Shield Strength\nTitanium,Energy Container,53,18,1,30,,,1,0,2.06,Energy Storage (MW)\nTitanium,Generator,600,50,1,40,,,1,0,82.5,Energy Generation (MW)\nTitanium,Integrity Field Generator,550,100,1,40,,,1,9.37,,\nTitanium,Computer Core,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nTitanium,Hyperspace Core,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nTitanium,Transporter,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nTitanium,Academy,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nTitanium,Cloning Pods,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nTitanium,Solar Panel,86,12,0,5,,,0,0,6,Power Generation (MW)\nTitanium,Light,15,5,0,10,,,0,0,,\nTitanium,Glow,15,5,1,10,,,0,0,,\nTitanium,Glass,15,1,1,10,,,0,0,,\nTitanium,Reflector,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nTitanium,Stone,0,1,6,120,,,0,0,,\nTitanium,Hologram,NULL,NULL,NULL,NULL,,,NULL,NULL,,\nTitanium,Rich Stone,0,1,9,120,,,0,0,,\nTitanium,Super Rich Stone,0,3,52,250,,,0,0,,\nTitanium,Ship Name,15,5,6,30,,,0,0,,\nTitanium,Ship Emblem,15,5,6,30,,,0,0,,\nTitanium,Hull (Alternate Pattern A),15,5,6,30,,,0,0,,\nTitanium,Hull (Vivid Colors),15,5,6,30,,,0,0,,\nTitanium,Hull (White Stripes A),15,5,6,30,,,0,0,,\nNaonite,Blank Hull,21,5,9,33,,,0,0,,\nNaonite,Smart Hull,21,5,9,33,,,1,0.5,,\nNaonite,Armor,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nNaonite,Engine,51,13,4,16,,,1,3.6,19392,Thrust (N)\nNaonite,Cargo Bay,51,13,9,11,,,1,0,,CargoHold\nNaonite,Crew Quarters,46,12,9,22,,,1,5,,Crew Quarters\nNaonite,Thruster,31,8,1,16,,,1,4.05,,Thrust (N)\nNaonite,Directional Thruster,31,8,1,16,,,1,3.37,,Thrust (N)\nNaonite,Gyro Array,102,25,4,5,,,1,8.07,,\nNaonite,Inertia Dampner,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nNaonite,Framework,2,1,0,0,,,0,0,,\nNaonite,Scaffold,2,1,0,0,,,0,0,,\nNaonite,Hangar,N/A,N/A,N/A,N/A,,,N/A,N/A,,Hangar Space\nNaonite,Dock,92,23,4,11,,,0,0,,\nNaonite,Turret Rotation Lock,41,10,4,33,,,0,0,,\nNaonite,Flight Recorder,405,100,18,55,,,1,0,,\nNaonite,Assembly,1013,30,4,33,,,1,0,,Production\nNaonite,Torpedo Launcher,92,23,9,33,,,1,0,,\nNaonite,Torpedo Storage,92,23,9,33,,,1,0,,Torpedo Storage\nNaonite,Turret Base,41,10,18,44,,,0,0,,\nNaonite,Shield Generator,1258,50,1,44,,,1,23.44,112,Shield Strength\nNaonite,Energy Container,71,18,2,33,,,1,0,2.37,Energy Storage (MW)\nNaonite,Generator,653,50,1,44,,,1,0,93.75,Energy Generation (MW)\nNaonite,Integrity Field Generator,655,100,1,44,,,1,9.37,,\nNaonite,Computer Core,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nNaonite,Hyperspace Core,2013,250,1,44,,,1,25,,\nNaonite,Transporter,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nNaonite,Academy,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nNaonite,Cloning Pods,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nNaonite,Solar Panel,98,12,1,5,,,0,0,6,Power Generation (MW)\nNaonite,Light,21,5,1,11,,,0,0,,\nNaonite,Glow,21,5,2,11,,,0,0,,\nNaonite,Glass,21,1,2,11,,,0,0,,\nNaonite,Reflector,21,1,2,11,,,0,0,,\nNaonite,Stone,0,1,9,132,,,0,0,,\nNaonite,Hologram,NULL,NULL,NULL,NULL,,,NULL,NULL,,\nNaonite,Rich Stone,0,1,13,132,,,0,0,,\nNaonite,Super Rich Stone,0,3,79,275,,,0,0,,\nNaonite,Ship Name,21,5,9,33,,,0,0,,\nNaonite,Ship Emblem,21,5,9,33,,,0,0,,\nNaonite,Hull (Alternate Pattern A),21,5,9,33,,,0,0,,\nNaonite,Hull (Vivid Colors),21,5,9,33,,,0,0,,\nNaonite,Hull (White Stripes A),21,5,9,33,,,0,0,,\nTrinium,Blank Hull,28,5,13,21,,,0,0,,\nTrinium,Smart Hull,28,5,13,21,,,1,0.5,,\nTrinium,Armor,10,8,84,35,,,0,0,,\nTrinium,Engine,69,13,7,10,,,1,3.38,19050,Thrust (N)\nTrinium,Cargo Bay,69,13,13,7,,,1,0,,CargoHold\nTrinium,Crew Quarters,62,12,13,14,,,1,5,,Crew Quarters\nTrinium,Thruster,42,8,2,10,,,1,3.8,,Thrust (N)\nTrinium,Directional Thruster,42,8,2,10,,,1,3.17,,Thrust (N)\nTrinium,Gyro Array,137,25,7,3,,,1,8.82,,\nTrinium,Inertia Dampner,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nTrinium,Framework,2,1,0,0,,,0,0,,\nTrinium,Scaffold,2,1,0,0,,,0,0,,\nTrinium,Hangar,124,23,2,1,,,0,0,,Hangar Space\nTrinium,Dock,124,23,7,7,,,0,0,,\nTrinium,Turret Rotation Lock,55,10,7,21,,,0,0,,\nTrinium,Flight Recorder,547,100,27,35,,,1,0,,\nTrinium,Assembly,1367,30,7,21,,,1,0,,Production\nTrinium,Torpedo Launcher,124,23,13,21,,,1,0,,\nTrinium,Torpedo Storage,124,23,13,21,,,1,0,,Torpedo Storage\nTrinium,Turret Base,55,10,27,28,,,0,0,,\nTrinium,Shield Generator,1471,150,2,28,,,1,27.19,169,Shield Strength\nTrinium,Energy Container,96,18,3,21,,,1,0,2.72,Energy Storage (MW)\nTrinium,Generator,724,50,2,28,,,1,0,108.75,Energy Generation (MW)\nTrinium,Integrity Field Generator,797,100,2,28,,,1,9.37,,\nTrinium,Computer Core,1137,25,2,28,,,7,0,,\nTrinium,Hyperspace Core,2367,250,2,28,,,1,25,,\nTrinium,Transporter,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nTrinium,Academy,62,12,10,28,,,1,0,,\nTrinium,Cloning Pods,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nTrinium,Solar Panel,115,12,1,3,,,0,0,6,Power Generation (MW)\nTrinium,Light,28,5,1,7,,,0,0,,\nTrinium,Glow,28,5,3,7,,,0,0,,\nTrinium,Glass,28,1,3,7,,,0,0,,\nTrinium,Reflector,28,1,3,7,,,0,0,,\nTrinium,Stone,0,1,13,84,,,0,0,,\nTrinium,Hologram,NULL,NULL,NULL,NULL,,,NULL,NULL,,\nTrinium,Rich Stone,0,1,20,84,,,0,0,,\nTrinium,Super Rich Stone,0,3,118,175,,,0,0,,\nTrinium,Ship Name,28,5,13,21,,,0,0,,\nTrinium,Ship Emblem,28,5,13,21,,,0,0,,\nTrinium,Hull (Alternate Pattern A),28,5,13,21,,,0,0,,\nTrinium,Hull (Vivid Colors),28,5,13,21,,,0,0,,\nTrinium,Hull (White Stripes A),28,5,13,21,,,0,0,,\nXanion,Blank Hull,37,5,20,27,,,0,0,,\nXanion,Smart Hull,37,5,20,27,,,1,0.5,,\nXanion,Armor,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nXanion,Engine,93,13,10,13,,,1,3.18,19253,Thrust (N)\nXanion,Cargo Bay,93,13,20,9,,,1,0,,CargoHold\nXanion,Crew Quarters,84,12,20,18,,,1,5,,Crew Quarters\nXanion,Thruster,56,8,3,13,,,1,3.57,,Thrust (N)\nXanion,Directional Thruster,56,8,3,13,,,1,2.98,,Thrust (N)\nXanion,Gyro Array,185,25,10,4,,,1,10.06,,\nXanion,Inertia Dampner,N/A,N/A,N/A,N/A,,,N/A,N/A,,\nXanion,Framework,2,1,0,0,,,0,0,,\nXanion,Scaffold,2,1,0,0,,,0,0,,\nXanion,Hangar,167,23,3,2,,,0,0,,Hangar Space\nXanion,Dock,167,23,10,9,,,0,0,,\nXanion,Turret Rotation Lock,74,10,10,27,,,0,0,,\nXanion,Flight Recorder,739,100,40,45,,,1,0,,\nXanion,Assembly,1845,30,10,27,,,1,0,,Production\nXanion,Torpedo Launcher,167,23,20,27,,,1,0,,\nXanion,Torpedo Storage,167,23,20,27,,,1,0,,Torpedo Storage\nXanion,Turret Base,74,10,40,36,,,0,0,,\nXanion,Shield Generator,1758,150,3,36,,,1,31.87,283,Shield Strength\nXanion,Energy Container,130,18,5,27,,,1,0,3.19,Energy Storage (MW)\nXanion,Generator,820,50,3,36,,,1,0,127.5,Energy Generation (MW)\nXanion,Integrity Field Generator,989,100,3,36,,,1,9.37,,\nXanion,Computer Core,1185,25,3,36,,,7,0,,\nXanion,Hyperspace Core,2846,250,3,36,,,1,25,,\nXanion,Transporter,2496,250,3,27,,,0,0,,\nXanion,Academy,84,12,15,36,,,1,0,,\nXanion,Cloning Pods,739,100,13,45,,,1,0,,\nXanion,Solar Panel,137,12,1,4,,,0,0,6,Power Generation (MW)\nXanion,Light,37,5,1,9,,,0,0,,\nXanion,Glow,37,5,5,9,,,0,0,,\nXanion,Glass,37,1,5,9,,,0,0,,\nXanion,Reflector,37,1,5,9,,,0,0,,\nXanion,Stone,0,1,20,108,,,0,0,,\nXanion,Hologram,NULL,NULL,NULL,NULL,,,NULL,NULL,,\nXanion,Rich Stone,0,1,30,108,,,0,0,,\nXanion,Super Rich Stone,0,3,173,225,,,0,0,,\nXanion,Ship Name,37,5,20,27,,,0,0,,\nXanion,Ship Emblem,37,5,20,27,,,0,0,,\nXanion,Hull (Alternate Pattern A),37,5,20,27,,,0,0,,\nXanion,Hull (Vivid Colors),37,5,20,27,,,0,0,,\nXanion,Hull (White Stripes A),37,5,20,27,,,0,0,,\nOgonite,Blank Hull,,,3,36,,,0,25,,\nOgonite,Smart Hull,same as bank hull,,,,,,1,,,\nOgonite,Armor,,,,,,,0,,,\nOgonite,Engine,,,,,,,1,,,Thrust (N)\nOgonite,Cargo Bay,same as engine,,,,,,1,,,CargoHold\nOgonite,Crew Quarters,,,,,,,1,,,Crew Quarters\nOgonite,Thruster,,,,,,,1,,,Thrust (N)\nOgonite,Directional Thruster,same as thruster,,,,,,1,,,Thrust (N)\nOgonite,Gyro Array,,,,,,,1,,,\nOgonite,Inertia Dampner,,,N/A,N/A,,,N/A,N/A,,\nOgonite,Framework,,,,,,,0,,,\nOgonite,Scaffold,same as framework,,,,,,0,,,\nOgonite,Hangar,,,,,,,N/A,,,Hangar Space\nOgonite,Dock,same as hanger,,,,,,0,,,\nOgonite,Turret Rotation Lock,,,,,,,0,,,\nOgonite,Flight Recorder,,,,,,,1,,,\nOgonite,Assembly,,,,,,,1,,,Production\nOgonite,Torpedo Launcher,,,,,,,1,,,\nOgonite,Torpedo Storage,,,,,,,1,,,Torpedo Storage\nOgonite,Turret Base,,,,,,,0,,,\nOgonite,Shield Generator,,,,,,,1,,,Shield Strength\nOgonite,Energy Container,,,,,,,1,,,Energy Storage (MW)\nOgonite,Generator,,,,,,,1,,,Energy Generation (MW)\nOgonite,Integrity Field Generator,,,,,,,1,,,\nOgonite,Computer Core,,,,,,,N/A,,,\nOgonite,Hyperspace Core,,,,,,,N/A,,,\nOgonite,Transporter,,,,,,,N/A,,,\nOgonite,Academy,,,,,,,N/A,,,\nOgonite,Cloning Pods,,,,,,,N/A,,,\nOgonite,Solar Panel,,,,,,,0,,,Power Generation (MW)\nOgonite,Light,same as bank hull,,,,,,0,,,\nOgonite,Glow,same as bank hull,,,,,,0,,,\nOgonite,Glass,Money only same as bank hull,1,,,,,0,,,\nOgonite,Reflector,Money only same as bank hull,1,,,,,N/A,,,\nOgonite,Stone,0,1,,,,,0,,,\nOgonite,Hologram,NULL,NULL,NULL,NULL,,,NULL,NULL,,\nOgonite,Rich Stone,0,1,,,,,0,,,\nOgonite,Super Rich Stone,0,3,,,,,0,,,\nOgonite,Ship Name,same as bank hull,,,,,,0,,,\nOgonite,Ship Emblem,same as bank hull,,,,,,0,,,\nOgonite,Hull (Alternate Pattern A),same as bank hull,,,,,,0,,,\nOgonite,Hull (Vivid Colors),same as bank hull,,,,,,0,,,\nOgonite,Hull (White Stripes A),same as bank hull,,,,,,0,,,\nAvorion,Blank Hull,,,,,,,,,,\nAvorion,Smart Hull,,,,,,,,,,\nAvorion,Armor,,,,,,,,,,\nAvorion,Engine,,,,,,,,,,Thrust (N)\nAvorion,Cargo Bay,,,,,,,,,,CargoHold\nAvorion,Crew Quarters,,,,,,,,,,Crew Quarters\nAvorion,Thruster,,,,,,,,,,Thrust (N)\nAvorion,Directional Thruster,,,,,,,,,,Thrust (N)\nAvorion,Gyro Array,,,,,,,,,,\nAvorion,Inertia Dampner,,,,,,,,,,\nAvorion,Framework,,,,,,,,,,\nAvorion,Scaffold,,,,,,,,,,\nAvorion,Hangar,,,,,,,,,,Hangar Space\nAvorion,Dock,,,,,,,,,,\nAvorion,Turret Rotation Lock,,,,,,,,,,\nAvorion,Flight Recorder,,,,,,,,,,\nAvorion,Assembly,,,,,,,,,,Production\nAvorion,Torpedo Launcher,,,,,,,,,,\nAvorion,Torpedo Storage,,,,,,,,,,Torpedo Storage\nAvorion,Turret Base,,,,,,,,,,\nAvorion,Shield Generator,,,,,,,,,,Shield Strength\nAvorion,Energy Container,,,,,,,,,,Energy Storage (MW)\nAvorion,Generator,,,,,,,,,,Energy Generation (MW)\nAvorion,Integrity Field Generator,,,,,,,,,,\nAvorion,Computer Core,,,,,,,,,,\nAvorion,Hyperspace Core,,,,,,,,,,\nAvorion,Transporter,,,,,,,,,,\nAvorion,Academy,,,,,,,,,,\nAvorion,Cloning Pods,,,,,,,,,,\nAvorion,Solar Panel,,,,,,,,,,Power Generation (MW)\nAvorion,Light,,,,,,,,,,\nAvorion,Glow,,,,,,,,,,\nAvorion,Glass,,,,,,,,,,\nAvorion,Reflector,,,,,,,,,,\nAvorion,Stone,,,,,,,,,,\nAvorion,Hologram,,,,,,,,,,\nAvorion,Rich Stone,,,,,,,,,,\nAvorion,Super Rich Stone,,,,,,,,,,\nAvorion,Ship Name,,,,,,,,,,\nAvorion,Ship Emblem,,,,,,,,,,\nAvorion,Hull (Alternate Pattern A),,,,,,,,,,\nAvorion,Hull (Vivid Colors),,,,,,,,,,\nAvorion,Hull (White Stripes A),,,,,,,,,,\n");
        // let calc = shipCalculator();

    //example pull data
    //  .log(blockList.iron.blankHull.cost$)

    //Block Calculator
        //Set block select drop down boxes
        materialDropEvent();
        statPreview.innerHTML = blockList[validateDropDown(validMaterials, materialDropBox.value)][validateDropDown(validBlocks, blockDropBox.value)][validateDropDown(validStats, statDropBox.value)];

    //Main Ship Calculator
        //Create new ship instance
        const ship = new shipCalculator(blockList, validateDropDown(validPalette, blockPaletteDropBox.value), validateDropDown(validBK ,buildingKnowledgeDropBox.value));
        
        //Set PP Limit
        ship.PPLimit = validateAsNumericInput(PPLimitTextBox.value);

        //set initial textbox values on reload
            //block calc runs the calc so there it is automatic
        setOutputAsRegOrPH(shieldAllocationTextBox, validateAsNumericInput(shieldAllocationTextBox.value));
        setOutputAsRegOrPH(engineAllocationTextBox, validateAsNumericInput(engineAllocationTextBox.value));
        setOutputAsRegOrPH(armorTotalTextBox, validateAsNumericInput(armorTotalTextBox.value));
        setOutputAsRegOrPH(thrusterTotalTextBox, validateAsNumericInput(thrusterTotalTextBox.value));

        //PP Limit
        setOutputAsRegOrPH(PPLimitTextBox, validateAsNumericInput(PPLimitTextBox.value));

        //run calc
        ship.runCalc
