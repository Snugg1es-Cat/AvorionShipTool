//handles the calculation for ship stats
class shipCalculator {
    constructor (buildingKnowledge, palette) {
        this.buildingKnowledge = buildingKnowledge;

        this.palette = palette

        // set default PPLimit
        this.setPPLimitToBK();

        //selects block palette 
        this.selectBlockPalette(false);

        // default subsytem stats
        this.generatedEnergyMult = 1;

        //init default allocation varibles
        this.shieldPP;
    }

    changeBuildingKnowledge(newBK) {
        this.buildingKnowledge = newBK;
    }
    
    //sets the PPLimit based on building Knowledge level
    setPPLimitToBK() {
        if (this.buildingKnowledge = "iron") {this.PPLimit = 128}
        else if (this.buildingKnowledge = "titanium") {this.PPLimit = 800}
        else if (this.buildingKnowledge = "naonite") {this.PPLimit = 2000}
        else if (this.buildingKnowledge = "trinium") {this.PPLimit = 5000}
        else if (this.buildingKnowledge = "xanion") {this.PPLimit = 12500}
        else if (this.buildingKnowledge = "ogonite") {this.PPLimit = 31250}
        else if (this.buildingKnowledge = "avorion") {this.PPLimit = 78125}
    }

    //manually insert PPLimit
    changePPLimit(newLimit) {
        this.PPLimit = newLimit;
    }



    //block palette

    // currently doesnt have palettes to pull from
    // could make custom palettes too
    // will be similar to material class in blockStats
    // light will find the most weight effcient per blocks unique output
    // pp efficient will select the material with highest unique output

    //selects the palette of blocks to calculate stats with based on the Building Knowledge Level
    selectBlockPalette(optimization) {
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

    // calculate block count
    // pp/((Gen/Req)+1) = Gen block count * (Gen/Req)
    // Gen block count * (Gen/Req) = other block count
    calcBlockCount (block, gen) {
        let ratio = gen.other/block.req;
        let genCount = this.PPLimit/(ratio+1);
        let blockCount = genCount*ratio;
    }


    //shields
    shieldCalculator() {
        //check block palette

        //if shieldGenerator is unset or no power generators have been set
        if (this.palette.shieldGenerator == 'unset' || (this.palette.generator == 'unset' || this.palette.solarPanel == 'unset')) {console.log('shieldCalculator error: palette unset')}
        else {
            //checks if shield generator is providing shield strength
            if (this.palette.shieldGenerator.other > 0) {
                //shield generator as variable
                let sGen = this.palette.shieldGenerator

                //shield gen is valid checking power source
                if (this.palette.generator.other > 0) {let gen = this.palette.generator /*set generator variable*/}
                //generator failed attempting solarPanel as backup
                else {
                    console.log('Generator output <= 0')
                    console.log('Switching to Solar Panels')
                    if (this.palette.solarPanel.other > 0) {let gen = this.palette.solarPanel /*set generator variable*/}
                    // no power gen avaliable - exits function
                    else {
                        console.log('Solar Panel output <= 0');
                        console.log('shieldCalculator: No available power generators');
                        return false;
                    }
                }
                //shield generator and power sources are valid

                //TO DO
                //write out logic 
                //set up outputs

            }
            //failed shield generator test - exits function
            else {
                console.log('Shield Generator output <= 0');
                return false;
            }
        }
    }
}

import allBlocks from './blockStats.js';
let blockList = new allBlocks()
blockList.convertCSVIntoData("Blank Hull,12,5,4,51,0,0,,\nSmart Hull,12,5,4,51,1,500kW,,\nArmor,4,8,25,85,0,0,,\nEngine,28,13,2,25,1,4MW,,\nCargo Bay,28,13,4,17,1,0,,\nCrew Quarters,25,12,4,34,1,5MW,,\nThruster,17,8,1,26,1,4.5MW,,\nDirectional Thruster,17,8,1,26,1,3.75M,,\nGyro Array,56,25,2,9,1,7.32MW,,\nInertia Dampner,334,150,1,26,1,54.39MW,,\nFramework,1,1,0(0.005),0(0.034),0,0,,\nScaffold,1,1,0(0.005),0(0.034),0,0,,\nHangar,N/A,N/A,N/A,N/A,N/A,N/A,,\nDock,50,23,2,17,0,0,,\nTurret Rotation Lock,23,10,2,1,0,0,,\nFlight Recorder,223,100,8,85,1,0,,\nAssembly,556,30,2,51,1,0,,\nTorpedo Launcher,50,23,4,51,1,0,,\nTorpedo Storage,50,23,4,51,1,0,,\nTurret Base,23,10,8,68,0,0,,\nShield Generator,N/A,N/A,N/A,N/A,N/A,N/A,,\nEnergy Container,N/A,N/A,N/A,N/A,N/A,N/A,,\nGenerator,N/A,N/A,N/A,N/A,N/A,N/A,,\nIntegrity Field Generator,N/A,N/A,N/A,N/A,N/A,N/A,,\nComputer Core,N/A,N/A,N/A,N/A,N/A,N/A,,\nHyperspace Core,N/A,N/A,N/A,N/A,N/A,N/A,,\nTransporter,N/A,N/A,N/A,N/A,N/A,N/A,,\nAcademy,N/A,N/A,N/A,N/A,N/A,N/A,,\nCloning Pods,N/A,N/A,N/A,N/A,N/A,N/A,,\nSolar Panel,77,12,0(0.25),9,0,0,6,Generated Power (MW)\nLight,12,5,0(0.25),17,0,0,,\nGlow,12,5,1,17,0,0,,\nGlass,12,1,1,17,0,0,,\nReflector,N/A,N/A,N/A,N/A,N/A,N/A,,\nStone,0,1,4,204,0,0,,\nHologram,NULL,NULL,NULL,NULL,NULL,NULL,,\nRich Stone,0,1,6,204,0,0,,\nSuper Rich Stone,0,3,35,425,0,0,,\nShip Name,12,5,2,51,0,0,,\nShip Emblem,12,5,4,51,0,0,,\nHull (Alternate Pattern A),12,5,4,51,0,0,,\nHull (Vivid Colors),12,5,4,51,0,0,,\nHull (White Stripes A),12,5,4,51,0,0,,\nBlank Hull,15,5,6,30,0,0,,\nSmart Hull,15,5,6,30,1,500kW,,\nArmor,5,8,37,50,0,0,,\nEngine,38,13,3,15,1,3.82MW,,\nCargo Bay,38,13,6,10,1,0,,\nCrew Quarters,34,12,6,20,1,5MW,,\nThruster,23,8,1,15,1,4.3MW,,\nDirectional Thruster,23,8,1,15,1,3.58MW,,\nGyro Array,75,N/A,3,5,1,7.61MW,,\nInertia Dampner,N/A,1,N/A,N/A,N/A,N/A,,\nFramework,1,1,0,0,0,0,,\nScaffold,1,1,0,0,0,0,,\nHangar,N/A,N/A,N/A,N/A,N/A,N/A,,\nDock,68,23,3,10,0,0,,\nTurret Rotation Lock,30,10,3,10,0,0,,\nFlight Recorder,300,100,12,50,1,0,,\nAssembly,750,30,3,30,1,0,,\nTorpedo Launcher,68,23,6,30,1,0,,\nTorpedo Storage,68,23,6,30,1,0,,\nTurret Base,30,10,12,40,0,0,,\nShield Generator,N/A,N/A,N/A,N/A,N/A,N/A,,\nEnergy Container,53,18,1,30,1,0,2.08,Battery Storage (GJ)\nGenerator,600,50,1,40,1,0,82.5,Generated Power (MW)\nIntegrity Field Generator,550,100,1,40,1,9.37,,\nComputer Core,N/A,N/A,N/A,N/A,N/A,N/A,,\nHyperspace Core,N/A,N/A,N/A,N/A,N/A,N/A,,\nTransporter,N/A,N/A,N/A,N/A,N/A,N/A,,\nAcademy,N/A,N/A,N/A,N/A,N/A,N/A,,\nCloning Pods,N/A,N/A,N/A,N/A,N/A,N/A,,\nSolar Panel,86,12,0,5,0,0,6,Generated Power (MW)\nLight,15,5,0,10,0,0,,\nGlow,15,5,1,10,0,0,,\nGlass,15,1,1,10,0,0,,\nReflector,N/A,N/A,N/A,N/A,N/A,N/A,,\nStone,0,1,6,120,0,0,,\nHologram,NULL,NULL,NULL,NULL,NULL,NULL,,\nRich Stone,0,1,9,120,0,0,,\nSuper Rich Stone,0,3,52,250,0,0,,\nShip Name,15,5,6,30,0,0,,\nShip Emblem,15,5,6,30,0,0,,\nHull (Alternate Pattern A),15,5,6,30,0,0,,\nHull (Vivid Colors),15,5,6,30,0,0,,\nHull (White Stripes A),15,5,6,30,0,0,,\nBlank Hull,21,5,9,33,0,0,,\nSmart Hull,21,5,9,33,1,500kW,,\nArmor,N/A,N/A,N/A,N/A,N/A,N/A,,\nEngine,51,13,4,16,1,3.6MW,,\nCargo Bay,51,13,9,11,1,0,,\nCrew Quarters,46,12,9,22,1,5MW,,\nThruster,31,8,1,16,1,4.05MW,,\nDirectional Thruster,31,8,1,16,1,3.37MW,,\nGyro Array,102,25,4,5,1,8.07MW,,\nInertia Dampner,N/A,N/A,N/A,N/A,N/A,N/A,,\nFramework,2,1,0,0,0,0,,\nScaffold,2,1,0,0,0,0,,\nHangar,N/A,N/A,N/A,N/A,N/A,N/A,,\nDock,92,23,4,11,0,0,,\nTurret Rotation Lock,41,10,4,33,0,0,,\nFlight Recorder,405,100,18,55,1,0,,\nAssembly,1013,30,4,33,1,0,,\nTorpedo Launcher,92,23,9,33,1,0,,\nTorpedo Storage,92,23,9,33,1,0,,\nTurret Base,41,10,18,44,0,0,,\nShield Generator,1258,50,1,44,1,23.44,,\nEnergy Container,71,18,2,33,1,0,2.37,Battery Storage (GJ)\nGenerator,653,50,1,44,1,0,93.75,Generated Power (MW)\nIntegrity Field Generator,655,100,1,44,1,9.37,,\nComputer Core,N/A,N/A,N/A,N/A,N/A,N/A,,\nHyperspace Core,2013,250,1,44,1,25MW,,\nTransporter,N/A,N/A,N/A,N/A,N/A,N/A,,\nAcademy,N/A,N/A,N/A,N/A,N/A,N/A,,\nCloning Pods,N/A,N/A,N/A,N/A,N/A,N/A,,\nSolar Panel,98,12,1,5,0,0,6,Generated Power (MW)\nLight,21,5,1,11,0,0,,\nGlow,21,5,2,11,0,0,,\nGlass,21,1,2,11,0,0,,\nReflector,21,1,2,11,0,0,,\nStone,0,1,9,132,0,0,,\nHologram,NULL,NULL,NULL,NULL,NULL,NULL,,\nRich Stone,0,1,13,132,0,0,,\nSuper Rich Stone,0,3,79,275,0,0,,\nShip Name,21,5,9,33,0,0,,\nShip Emblem,21,5,9,33,0,0,,\nHull (Alternate Pattern A),21,5,9,33,0,0,,\nHull (Vivid Colors),21,5,9,33,0,0,,\nHull (White Stripes A),21,5,9,33,0,0,,\nBlank Hull,28,5,13,21,0,0,,\nSmart Hull,28,5,13,21,1,500kW,,\nArmor,10,8,84,35,0,0,,\nEngine,69,13,7,10,1,3.38MW,,\nCargo Bay,69,13,13,7,1,0,,\nCrew Quarters,62,12,13,14,1,5MW,,\nThruster,42,8,2,10,1,3.8MW,,\nDirectional Thruster,42,8,2,10,1,3.17MW,,\nGyro Array,137,25,7,3,1,8.82MW,,\nInertia Dampner,N/A,N/A,N/A,N/A,N/A,N/A,,\nFramework,2,1,0,0,0,0,,\nScaffold,2,1,0,0,0,0,,\nHangar,124,23,2,1,0,0,,\nDock,124,23,7,7,0,0,,\nTurret Rotation Lock,55,10,7,21,0,0,,\nFlight Recorder,547,100,27,35,1,0,,\nAssembly,1367,30,7,21,1,0,,\nTorpedo Launcher,124,23,13,21,1,0,,\nTorpedo Storage,124,23,13,21,1,0,,\nTurret Base,55,10,27,28,0,0,,\nShield Generator,1471,150,2,28,1,27.19,,\nEnergy Container,96,18,3,21,1,0,2.72,Battery Storage (GJ)\nGenerator,724,50,2,28,1,0,108.75,Generated Power (MW)\nIntegrity Field Generator,797,100,2,28,1,9.37MW,,\nComputer Core,1137,25,2,28,7,0,,\nHyperspace Core,2367,250,2,28,1,25MW,,\nTransporter,N/A,N/A,N/A,N/A,N/A,N/A,,\nAcademy,62,12,10,28,1,0,,\nCloning Pods,N/A,N/A,N/A,N/A,N/A,N/A,,\nSolar Panel,115,12,1,3,0,0,6,Generated Power (MW)\nLight,28,5,1,7,0,0,,\nGlow,28,5,3,7,0,0,,\nGlass,28,1,3,7,0,0,,\nReflector,28,1,3,7,0,0,,\nStone,0,1,13,84,0,0,,\nHologram,NULL,NULL,NULL,NULL,NULL,NULL,,\nRich Stone,0,1,20,84,0,0,,\nSuper Rich Stone,0,3,118,175,0,0,,\nShip Name,28,5,13,21,0,0,,\nShip Emblem,28,5,13,21,0,0,,\nHull (Alternate Pattern A),28,5,13,21,0,0,,\nHull (Vivid Colors),28,5,13,21,0,0,,\nHull (White Stripes A),28,5,13,21,0,0,,\nBlank Hull,37,5,20,27,0,0,,\nSmart Hull,37,5,20,27,1,500kW,,\nArmor,N/A,N/A,N/A,N/A,N/A,N/A,,\nEngine,93,13,10,13,1,3.18MW,,\nCargo Bay,93,13,20,9,1,0,,\nCrew Quarters,84,12,20,18,1,5MW,,\nThruster,56,8,3,13,1,3.57MW,,\nDirectional Thruster,56,8,3,13,1,2.98MW,,\nGyro Array,185,25,10,4,1,10.06MW,,\nInertia Dampner,N/A,N/A,N/A,N/A,N/A,N/A,,\nFramework,2,1,0,0,0,0,,\nScaffold,2,1,0,0,0,0,,\nHangar,167,23,3,2,0,0,,\nDock,167,23,10,9,0,0,,\nTurret Rotation Lock,74,10,10,27,0,0,,\nFlight Recorder,739,100,40,45,1,0,,\nAssembly,1845,30,10,27,1,0,,\nTorpedo Launcher,167,23,20,27,1,0,,\nTorpedo Storage,167,23,20,27,1,0,,\nTurret Base,74,10,40,36,0,0,,\nShield Generator,1758,150,3,36,1,31.87,,\nEnergy Container,130,18,5,27,1,0,3.19,Battery Storage (GJ)\nGenerator,820,50,3,36,1,0,127.5,Generated Power (MW)\nIntegrity Field Generator,989,100,3,36,1,9.37MW,,\nComputer Core,1185,25,3,36,7,0,,\nHyperspace Core,2846,250,3,36,1,25MW,,\nTransporter,2496,250,3,27,0,0,,\nAcademy,84,12,15,36,1,0,,\nCloning Pods,739,100,13,45,1,0,,\nSolar Panel,137,12,1,4,0,0,6,Generated Power (MW)\nLight,37,5,1,9,0,0,,\nGlow,37,5,5,9,0,0,,\nGlass,37,1,5,9,0,0,,\nReflector,37,1,5,9,0,0,,\nStone,0,1,20,108,0,0,,\nHologram,NULL,NULL,NULL,NULL,NULL,NULL,,\nRich Stone,0,1,30,108,0,0,,\nSuper Rich Stone,0,3,173,225,0,0,,\nShip Name,37,5,20,27,0,0,,\nShip Emblem,37,5,20,27,0,0,,\nHull (Alternate Pattern A),37,5,20,27,0,0,,\nHull (Vivid Colors),37,5,20,27,0,0,,\nHull (White Stripes A),37,5,20,27,0,0,,\nBlank Hull,,,3,36,0,25MW,,\nSmart Hull,same as bank hull,,,,1,,,\nArmor,,,,,0,,,\nEngine,,,,,1,,,\nCargo Bay,same as engine,,,,1,,,\nCrew Quarters,,,,,1,,,\nThruster,,,,,1,,,\nDirectional Thruster,same as thruster,,,,1,,,\nGyro Array,,,,,1,,,\nInertia Dampner,,,N/A,N/A,N/A,N/A,,\nFramework,,,,,0,,,\nScaffold,same as framework,,,,0,,,\nHangar,,,,,N/A,,,\nDock,same as hanger,,,,0,,,\nTurret Rotation Lock,,,,,0,,,\nFlight Recorder,,,,,1,,,\nAssembly,,,,,1,,,\nTorpedo Launcher,,,,,1,,,\nTorpedo Storage,,,,,1,,,\nTurret Base,,,,,0,,,\nShield Generator,,,,,1,,,\nEnergy Container,,,,,1,,,Battery Storage (GJ)\nGenerator,,,,,1,,,Generated Power (MW)\nIntegrity Field Generator,,,,,1,,,\nComputer Core,,,,,N/A,,,\nHyperspace Core,,,,,N/A,,,\nTransporter,,,,,N/A,,,\nAcademy,,,,,N/A,,,\nCloning Pods,,,,,N/A,,,\nSolar Panel,,,,,0,,,Generated Power (MW)\nLight,same as bank hull,,,,0,,,\nGlow,same as bank hull,,,,0,,,\nGlass,Money only same as bank hull,1,,,0,,,\nReflector,Money only same as bank hull,1,,,N/A,,,\nStone,0,1,,,0,,,\nHologram,NULL,NULL,NULL,NULL,NULL,NULL,,\nRich Stone,0,1,,,0,,,\nSuper Rich Stone,0,3,,,0,,,\nShip Name,same as bank hull,,,,0,,,\nShip Emblem,same as bank hull,,,,0,,,\nHull (Alternate Pattern A),same as bank hull,,,,0,,,\nHull (Vivid Colors),same as bank hull,,,,0,,,\nHull (White Stripes A),same as bank hull,,,,0,,,\nBlank Hull,,,,,,,,\nSmart Hull,,,,,,,,\nArmor,,,,,,,,\nEngine,,,,,,,,\nCargo Bay,,,,,,,,\nCrew Quarters,,,,,,,,\nThruster,,,,,,,,\nDirectional Thruster,,,,,,,,\nGyro Array,,,,,,,,\nInertia Dampner,,,,,,,,\nFramework,,,,,,,,\nScaffold,,,,,,,,\nHangar,,,,,,,,\nDock,,,,,,,,\nTurret Rotation Lock,,,,,,,,\nFlight Recorder,,,,,,,,\nAssembly,,,,,,,,\nTorpedo Launcher,,,,,,,,\nTorpedo Storage,,,,,,,,\nTurret Base,,,,,,,,\nShield Generator,,,,,,,,\nEnergy Container,,,,,,,,Battery Storage (GJ)\nGenerator,,,,,,,,Generated Power (MW)\nIntegrity Field Generator,,,,,,,,\nComputer Core,,,,,,,,\nHyperspace Core,,,,,,,,\nTransporter,,,,,,,,\nAcademy,,,,,,,,\nCloning Pods,,,,,,,,\nSolar Panel,,,,,,,,Generated Power (MW)\nLight,,,,,,,,\nGlow,,,,,,,,\nGlass,,,,,,,,\nReflector,,,,,,,,\nStone,,,,,,,,\nHologram,,,,,,,,\nRich Stone,,,,,,,,\nSuper Rich Stone,,,,,,,,\nShip Name,,,,,,,,\nShip Emblem,,,,,,,,\nHull (Alternate Pattern A),,,,,,,,\nHull (Vivid Colors),,,,,,,,\nHull (White Stripes A),,,,,,,,\n");


//this class holds the current chosen blocks to calculate stats off
//blocks are set by their material
//needs to be feed a list of every block
class palette {
    constructor(blockList){
        this.blockList = blockList;

        //init values
        this.armor = 'unset';
        this.engine = 'unset';
        this.cargoBay = 'unset';
        this.crewQuarters = 'unset';
        this.thruster = 'unset';
        this.directionalThruster = 'unset';
        this.gyroArray = 'unset';
        this.inertialDampner = 'unset';
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
        if (loopEscape == material) { this[type] = blockList[material][type] }
        else { 
            //set exit condition
            if (loopEscape == undefined) {loopEscape = material}

            //test block validity
            if (blockList[material][type].cost$ == 'N/A') {
                //check optimization type
                if (opti == 'processingPower') {
                    //save temp variables for faster calc
                    //current material
                    let newBlock = blockList[material][type];
                    //previous best material
                    let bestBlock = blockList[best][type];
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
                    let newBlock = blockList[material][type];
                    //previous best material
                    let bestBlock = blockList[best][type];
                    if (
                        (newBlock.weight/newBlock.other) 
                        <=
                        (bestBlock.weight/bestBlock.other)
                        ){best = material;} //sets current material as new best
                }
            
                // no optimization - exit
                else {
                    this[type] = blockList[material][type]
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
    setAll(material, opti){
        setType('armor', material, BK, opti);
        setType('engine', material, BK, opti);
        setType('cargoBay', material, BK, opti);
        setType('crewQuarters', material, BK, opti);
        setType('thruster', material, BK, opti);
        setType('directionalThruster', material, BK, opti);
        setType('gyroArray', material, BK, opti);
        setType('inertialDampner', material, BK, opti);
        setType('hangar', material, BK, opti);
        setType('dock', material, BK, opti);
        setType('flightRecorder', material, BK, opti);
        setType('assembly', material, BK, opti);
        setType('torpedoLauncher', material, BK, opti);
        setType('torpedoStorage', material, BK, opti);
        setType('shieldGenerator', material, BK, opti);
        setType('energyContainer', material, BK, opti);
        setType('generator', material, BK, opti);
        setType('integrityFieldGenerator', material, BK, opti);
        setType('computerCore', material, BK, opti);
        setType('hyperspaceCore', material, BK, opti);
        setType('transporter', material, BK, opti);
        setType('academy', material, BK, opti);
        setType('cloningPods', material, BK, opti);
        setType('solarPanel', material, BK, opti);
    }
}