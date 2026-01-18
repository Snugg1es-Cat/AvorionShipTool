//handles the calculation for ship stats
export default class shipCalculator {
    constructor (allBlocks, optimization, buildingKnowledge) {
        //palette
        this.palette = new palette(allBlocks);
        this.optimization = optimization;

        // set default PPLimit
        this.PPLimit = this.lookupPPLimitByBK(buildingKnowledge);

        //init default subsytem stats
        this.generatedEnergyMult = 1;
        this.shieldDuribilityMult = 1;

        //init default allocation varibles
        this.shieldPP = 0;
        this.enginePP = 0;

        //input variables
        this.genTypeBool = this.palette.CheckPowerSource();
        this.integrityFieldGeneratorCount = 0;
        //engine calc
        this.armorBlocks = 0;
        this.thrusterCount = 0;

        //init calculator output variables
        //shield calc
        this.eGenCountShields = 0;
        this.sGenCount = 0;
        this.shieldDurability = 0;
        this.sReqCrewEngineer = 0;
        this.sReqCrewmechanic = 0;

        //engines
        this.eGenCountEngines = 0;
        this.eCount = 0;
        this.cQCountEngines = 0;

        //set initial BK
        this.changeBuildingKnowledge(buildingKnowledge);
    }

    //Triggers a full ship calculation
    runCalcAll(){
        console.log(this.palette)
        console.log(this.eGenCountShields)
        this.shieldCalcHandler();
        console.log(this.eGenCountShields)
    }

    //change Building Knowledge and handle subsequent changes
    changeBuildingKnowledge(newBK) {
        this.buildingKnowledge = newBK;
        this.palette.setAll(newBK, this.optimization, this.buildingKnowledge);
        this.changePPLimit(this.lookupPPLimitByBK(newBK));
    }
    
    //returns the PPLimit based on current building Knowledge level
    lookupPPLimitByBK(BK) {
        if (BK == "iron") {return 128;}
        else if (BK == "titanium") {return 800;}
        else if (BK == "naonite") {return 2000;}
        else if (BK == "trinium") {return 5000;}
        else if (BK == "xanion") {return 12500;}
        else if (BK == "ogonite") {return 31250;}
        else if (BK == "avorion") {return 78125;}
    }

    //change PPLimit and handle subsequent changes
    changePPLimit(newLimit) {
        this.PPLimit = newLimit;
    }

    //shields
    shieldCalcHandler() {
        //check block palette

        //if shieldGenerator is unset or no power generators have been set
        if (this.palette.shieldGenerator == 'unset' || (this.palette.generator == 'unset' || this.palette.solarPanel == 'unset')) {console.log('shieldCalcHandler error: palette unset')}
        else {
            let blockCountArray = 0
            //checks if shield generator is providing shield strength
            if (this.palette.shieldGenerator.other == 0) {
                // shields invalid set to zero
                blockCountArray = [0,0]
                console.log('shield gen bad')
            }
            else {
                //shield generator as variable
                let sGen = this.palette.shieldGenerator
                let eGen;

                if (this.genTypeBool) {eGen = this.palette.generator /*set generator variable*/}
                else {eGen = this.palette.solarPanel /*set generator variable*/}
                //shield generator and power sources are valid
            
                //logic
                blockCountArray = calcBlockCount(this.shieldPP, eGen, sGen);
            }
            //output
            //block counts
            this.eGenCountShields = blockCountArray[0];
            this.sGenCount = blockCountArray[1];
            

            //stats
            this.shieldDurability = this.sGenCount * this.shieldDuribilityMult;
        }
    }

    // calculate block count
    // pp/((eGen/Req)+1) = eGen block count * (eGen/Req)
    // eGen block count * (eGen/Req) = other block count
    calcBlockCount(ppLimit, eGen, block) {
        //balances energy generating and energy consuming blocks
        //based on the given processing power limit
        //returns list containing the block counts of each
        let ratio = eGen.other*this.generatedEnergyMult / block.reqEnergy;
        let genCount = ppLimit/(ratio+1);
        let blockCount = genCount*ratio;
        console.log({genCount})

        return ([genCount , blockCount]);
    }

    //crew calculator
    //calculates how many crew members are needed
    calcCrewNeeded(block, blockCount, engiBool) {
        let crewType = 'reqCrewMechanic';
        if (engiBool) { crewType = 'reqCrewEngineer'; }
        return block[crewType] * blockCount;
    }

    engineCalcHandler(){
        //checking energy generator type
        // generator
        let eCalResults
        if(this.genTypeBool) {
            eCalResults = engineCalculator(this.enginePP, this.palette.engine, this.palette.generator, this.palette.crewQuarters, this.palette.shieldGenerator, this.sGenCount, this.palette.thruster, this.thrusterCount)
        }
        //solar panels
        else {
            eCalResults = engineCalculator();
        }
        this.eGenCountEngines = eCalResults[0];
        this.eCount = eCalResults[1];
        this.cQCountEngines = eCalResults[2];
    };

    engineCalculator(ppLimit, engineBlock, energySource, crewQuartersBlock, shieldBlock, shieldCount, thrusterBlock, thrusterCount) {
    // engineer polution
    // Crew Quarters to house the engineers responsible for shields and thrusters
    // add 0.01 because there is a small base engi requirement I believe to be 0.01
    let polutedEngiQuartersBlocks = calcCrewQuarters(calcCrewNeeded(shieldBlock, shieldCount, true) + calcCrewNeeded(thrusterBlock, thrusterCount, true) + 0.01);
    // power generators to power engi crew quarters
    let polutedEngiEnergySourceBlocks = (polutedEngiQuartersBlocks*crewQuartersBlock.reqEnergy) / energySource.other;


    //new processing power limit which ignores the engineers required from shields
    let newPPLimt = ppLimit - (polutedEngiQuartersBlocks + polutedEngiEnergySourceBlocks);

    // the ratio between engines and crew quarters
    // (10/19) is crew quarter density which should be apart of block stats but isnt in this test 
    let ratioEtoCQ = (1/90) / (10/19)/*engineBlock.reqCrewEngineer / crewQuartersBlock.other*/

    
    let percentageCQ = ratioEtoCQ / (1+ratioEtoCQ)
    let percentageE = 1 / (1+ratioEtoCQ)
    let ratioEGenToECQ = energySource.other / (percentageE*engineBlock.reqEnergy + percentageCQ*crewQuartersBlock.reqEnergy)


    //energy
    // the ratio between energy generators to the engine to crew quarter ratio
    // adjusts engine to crew quater ratio by their energy requirements
    // let ratioEGenToECQ = energySource.other / (engineBlock.reqEnergy + ratioEtoCQ*crewQuartersBlock.reqEnergy)
    
    // expand ratios to fill PP limit
    let eGenCount = newPPLimt/(ratioEGenToECQ+1);
    let engineAndCrewQCount = eGenCount*ratioEGenToECQ;
        
    let engineCount = engineAndCrewQCount * percentageE
    let crewQuartersCount = engineAndCrewQCount * percentageCQ

    //add shield gens / crew
    eGenCount += polutedEngiEnergySourceBlocks;
    crewQuartersCount += polutedEngiQuartersBlocks;

    return [eGenCount, engineCount, crewQuartersCount];
    };
};



//this class holds the current chosen blocks to calculate stats off
//blocks are set by their material
//needs to be fed a list of every block
class palette {
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

    CheckPowerSource(){
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