//this class holds the current chosen blocks to calculate stats off
//blocks are set by their material
//needs to be fed a list of every block
export default class palette {
    constructor(blockList) {
        this.blockList = blockList;

        //init values
        this.armor = 'unset';
        this.engine = 'unset';
        this.cargoBay = 'unset';
        this.crewQuarters = 'unset';
        this.thruster = 'unset';
        this.directionalThruster = 'unset';
        this.gyroArray = 'unset';
        this.inertialDampener = 'unset';
        this.hangar = 'unset';
        this.dock = 'unset';
        this.flightRecorder = 'unset';
        this.assembly = 'unset';
        this.torpedoLauncher = 'unset';
        this.torpedoStorage = 'unset';
        this.shieldGenerator = 'unset';
        this.energyContainer = 'unset';
        this.generator = 'unset';
        this.integrityFieldGenerator = 'unset';
        this.computerCore = 'unset';
        this.hyperspaceCore = 'unset';
        this.transporter = 'unset';
        this.academy = 'unset';
        this.cloningPods = 'unset';
        this.solarPanel = 'unset';
    }

    //do not input a value for loopEscape
    //this function is self calling and loopEscape sets itself to break the loop automatically
    setType(type, material, BK, opti, best, loopEscape){
        //check exit / loopEscape condition
        if (loopEscape == material) { this[type] = this.blockList[material][type] }
        else { 
            //set exit condition
            if (loopEscape == undefined) {loopEscape = material}

            let bipass = false

            //test block validity
            if (this.blockList[material][type].cost$ == 'N/A') {
                //check optimization type
                if (opti == 'processingPower') {
                    //save temp variables for faster calc
                    //current material
                    let newBlock = this.blockList[material][type];
                    //previous best material
                    let bestBlock = this.blockList[best][type];
                    if (newBlock.other >= bestBlock.other) {
                        // if they are equal check weight efficiency
                        if (newBlock.other = bestBlock.other) {
                            //checking weight/output ('other') efficiency
                            if (
                                (newBlock.weight/newBlock.other) 
                                <=
                                (bestBlock.weight/bestBlock.other)
                            ){best = material;} //sets current material as new best
                        }
                    }
                }
                //checking weight optimization type
                else if (opti == 'weight') {
                    //current material
                    let newBlock = this.blockList[material][type];
                    //previous best material
                    let bestBlock = this.blockList[best][type];
                    if (
                        (newBlock.weight/newBlock.other) 
                        <=
                        (bestBlock.weight/bestBlock.other)
                        ){best = material;} //sets current material as new best
                }
            
                // no optimization - exit
                else {
                    this[type] = this.blockList[material][type]
                    bipass = true; //allows code to end by jumping over loop
                }
            }
            
            //function loops by call itself
            //run after failed block or validated
            if (bipass != true) {
                //loops down through material levels
                if      (material == 'avorion') {this.setType(type, 'obonite',  BK, best, opti, loopEscape)}
                else if (material == 'obonite') {this.setType(type, 'xanion',   BK, best, opti, loopEscape)}
                else if (material == 'xanion')  {this.setType(type, 'trinium',  BK, best, opti, loopEscape)}
                else if (material == 'trinium') {this.setType(type, 'naonite',  BK, best, opti, loopEscape)}
                else if (material == 'naonite') {this.setType(type, 'titanium', BK, best, opti, loopEscape)}
                else if (material == 'titanium'){this.setType(type, 'iron',     BK, best, opti, loopEscape)}
                //resets back up to building knowledge level at iron
                else {this.setType(type, BK, BK, best, opti, loopEscape)}
            }
        }
    }//end of setTypeFunction
    
    //calls the setType for all types of block
    setAll(material, opti, BK){
        this.setType('armor', material, BK, opti);
        this.setType('engine', material, BK, opti);
        this.setType('cargoBay', material, BK, opti);
        this.setType('crewQuarters', material, BK, opti);
        this.setType('thruster', material, BK, opti);
        this.setType('directionalThruster', material, BK, opti);
        this.setType('gyroArray', material, BK, opti);
        this.setType('inertialDampener', material, BK, opti);
        this.setType('hangar', material, BK, opti);
        this.setType('dock', material, BK, opti);
        this.setType('flightRecorder', material, BK, opti);
        this.setType('assembly', material, BK, opti);
        this.setType('torpedoLauncher', material, BK, opti);
        this.setType('torpedoStorage', material, BK, opti);
        this.setType('shieldGenerator', material, BK, opti);
        this.setType('energyContainer', material, BK, opti);
        this.setType('generator', material, BK, opti);
        this.setType('integrityFieldGenerator', material, BK, opti);
        this.setType('computerCore', material, BK, opti);
        this.setType('hyperspaceCore', material, BK, opti);
        this.setType('transporter', material, BK, opti);
        this.setType('academy', material, BK, opti);
        this.setType('cloningPods', material, BK, opti);
        this.setType('solarPanel', material, BK, opti);
    }

    checkPowerSource(){
        //shield gen is valid checking power source
        if (this.generator.other > 0) {return true;}
        //generator failed attempting solarPanel as backup
        else {return false;}
        //there should be no case when solar panels are invalid
        //simplifying output of this function

        //     console.log('Generator output <= 0')
        //     console.log('Switching to Solar Panels')
        //     if (this.palette.solarPanel.other > 0) {return false}
        //     // no energy gen avaliable - 1st exit of function
        //     else {
        //         console.log('Solar Panel output <= 0');
        //         console.log('shieldCalcHandler: No available power generators');
        //         return 'error';
        //     }
        // }
    }

    //block palette

    // currently doesnt have premade palettes to pull from
    // could make custom palettes too
    // will be similar to material class in blockStats
    // light will find the most weight effcient per blocks unique output
    // pp efficient will select the material with highest unique output

    //selects the palette of blocks to calculate stats with based on the Building Knowledge Level
    selectBlockPalettePreset(optimization) {
        //light weight determines if the palette should focus on weight efficiency or processing power efficiency
        //true = weigh efficient
        //false = processing power efficiency
        if (optimization == 'weight') {
            if (this.buildingKnowledge = "iron") {this.palette = ironPaletteLight}
            else if (this.buildingKnowledge = "titanium") {this.palette = titaniumPaletteLight}
            else if (this.buildingKnowledge = "naonite") {this.palette = naonitePaletteLight}
            else if (this.buildingKnowledge = "trinium") {this.palette = triniumPaletteLight}
            else if (this.buildingKnowledge = "xanion") {this.palette = xanionPaletteLight}
            else if (this.buildingKnowledge = "ogonite") {this.palette = ogonitePaletteLight}
            else if (this.buildingKnowledge = "avorion") {this.palette = avorionPaletteLight}
        }
        else if(optimization == 'processingPower') {
            if (this.buildingKnowledge = "iron") {this.palette = ironPalette}
            else if (this.buildingKnowledge = "titanium") {this.palette = titaniumPalette}
            else if (this.buildingKnowledge = "naonite") {this.palette = naonitePalette}
            else if (this.buildingKnowledge = "trinium") {this.palette = triniumPalette}
            else if (this.buildingKnowledge = "xanion") {this.palette = xanionPalette}
            else if (this.buildingKnowledge = "ogonite") {this.palette = ogonitePalette}
            else if (this.buildingKnowledge = "avorion") {this.palette = avorionPalette}
        }
    }
}