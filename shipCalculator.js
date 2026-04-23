import palette from './palette.js';

//handles the calculation for ship statsengineerOverclock
export default class shipCalculator {
    constructor (allBlocks, optimization, buildingKnowledge) {
        //palette
        this.palette = new palette(allBlocks);
        this.optimization = optimization;

        // set default PPLimit
        this.PPLimit = this.lookupPPLimitByBK(buildingKnowledge);

        //init default subsytem effects
        this.setSubsystemEffectsToDefault();

        //init default allocation varibles
        this.shieldPP = 0;
        this.enginePP = 0;

        //input variables
        this.integrityFieldGeneratorCount = 0;
        //engine calc
        this.armorBlocks = 0;
        this.thrusterCount = 0;
        this.engineerOverclock = false;
        this.otherWeight = 0;

        //init calculator output variables
        //shield calc
        this.eGenCountShields = 0;
        this.sGenCount = 0;
        this.shieldDurability = 0;
        this.sReqCrewEngineer = 0;
        this.sReqCrewmechanic = 0;
        this.shieldsTotalWeight = 0;

        //engines
        this.eGenCountEngines = 0;
        this.eCount = 0;
        this.cQCountEngines = 0;
        this.maxSpeed = 0;
        this.acceleration = 0;
        this.enginesTotalWeight = 0;

        //other
        this.subsystemEGenCount = 0;

        //set initial BK
        this.changeBuildingKnowledge(buildingKnowledge);
    }

    //Triggers a full ship calculation
    runCalcAll() {
        this.shieldCalcHandler();
        this.engineCalcHandler();

        //other
        if (this.palette.checkPowerSource()) {
            //calc how many generator blocks are required to run all subsystems
            this.subsystemEGenCount = this.requiredEnergyAdditive / this.palette.generator.other;
        } else {
            //use solar panels instead
            this.subsystemEGenCount = this.requiredEnergyAdditive / this.palette.solarPanel.other;
        }
    }

    //sets Subsystem Effects back to default
    setSubsystemEffectsToDefault() {

        this.generatedEnergyMultiplier = 1;
        
        this.requiredEnergyMultiplier = 1;
        this.requiredEnergyAdditive = 0;

        this.shieldDuribilityMultiplier = 1;
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
        //check if shieldGenerator is valid
        else if (Number.isNaN(this.palette.shieldGenerator.other)) {console.log('invalid shield ganerator')}
        else {
            let blockCountArray = 0
            //checks if shield generator is providing shield strength
            if (this.palette.shieldGenerator.other == 0) {
                // shields invalid set to zero
                blockCountArray = [0,0]
                console.log('No Avaliable Shield Generators')
                console.log(this.palette.shieldGenerator)
            }
            else {
                //shield generator as variable
                let sGen = this.palette.shieldGenerator
                let eGen;

                if (this.palette.checkPowerSource()) {eGen = this.palette.generator /*set generator variable*/}
                else {eGen = this.palette.solarPanel /*set generator variable*/}
                //shield generator and power sources are valid
            
                //logic
                blockCountArray = this.calcBlockCount(this.shieldPP, eGen, sGen);
            }
            //output
            //block counts
            this.eGenCountShields = blockCountArray[0];
            this.sGenCount = blockCountArray[1];
            

            //stats
            this.shieldDurability = this.palette.shieldGenerator.other * this.sGenCount * this.shieldDuribilityMultiplier;
        }
    }

    // calculate block count
    // pp/((eGen/Req)+1) = eGen block count * (eGen/Req)
    // eGen block count * (eGen/Req) = other block count
    calcBlockCount(ppLimit, eGen, block) {
        //balances energy generating and energy consuming blocks
        //based on the given processing power limit
        //returns list containing the block counts of each
        let ratio = (eGen.other*this.generatedEnergyMultiplier) / (block.reqEnergy * this.requiredEnergyMultiplier);
        let genCount = ppLimit/(ratio+1);
        let blockCount = genCount*ratio;

        return ([genCount , blockCount]);
    }

    //crew calculator
    //calculates how many crew members are needed
    calcCrewNeeded(block, blockCount, engiBool="false", overclock="false") {
        let crewType = 'reqCrewMechanic';
        let overclockMult = 1;
        if (engiBool) { crewType = 'reqCrewEngineer'; }
        if (overclock) { overclockMult = 3; }
        //validate block as a valid crew type req oherwise set it as 0
        // if NaN will use 0 instead
        let crewRequired = block[crewType] || 0;
        return (crewRequired * blockCount) * overclockMult;
    }
    //calculate the crew Quarter blocks needed
    calcCrewQuarters(reqCrew) {
        return this.palette.crewQuarters.other * reqCrew;
    }

    engineCalcHandler(){
        //checking energy generator type
        // generator
        let eCalResults
        //select energy source block (solarPanel or generator)
        let energySource = this.palette.solarPanel;
        if(this.palette.checkPowerSource()) {
            energySource = this.palette.generator;
        }

        //run the calc
        eCalResults = this.engineCalculator(this.enginePP, this.palette.engine, energySource, this.palette.crewQuarters, this.engineerOverclock, this.palette.shieldGenerator, this.sGenCount, this.palette.thruster, this.thrusterCount)
        

        this.eGenCountEngines = eCalResults[0];
        this.eCount = eCalResults[1];
        this.cQCountEngines = eCalResults[2];

        //max speed
        this.maxSpeed = this.calcMaxSpeed(this.eCount, this.engineerOverclock);

        //acceleration
        let weightDict = this.calcTotalWeight();
        this.acceleration = this.eCount * this.palette.engine.other / weightDict.totalWeight;
    };

    engineCalculator(ppLimit, engineBlock, energySource, crewQuartersBlock, engineerOverclock, shieldBlock, shieldCount, thrusterBlock, thrusterCount) {

        // output calculates differently depending on the type of the energy source
        // generators need to take up a slice of PP
        // solar panels do not need to take that slice
        let returnPackage = [];
        if (energySource.name == "Generator") {

            // engineer polution
            // Crew Quarters to house the engineers responsible for shields and thrusters
            // add 0.01 because there is a small base engi requirement I believe to be 0.01
            let polutedEngiQuartersBlocks = this.calcCrewQuarters(this.calcCrewNeeded(shieldBlock, shieldCount, true, engineerOverclock) + this.calcCrewNeeded(thrusterBlock, thrusterCount, true, engineerOverclock) + 0.01);
            // power generators to power engi crew quarters
            let polutedEngiEnergySourceBlocks = (polutedEngiQuartersBlocks*(crewQuartersBlock.reqEnergy * this.requiredEnergyMultiplier)) / (energySource.other * this.generatedEnergyMultiplier);

            //new processing power limit which ignores the engineers required from shields
            let newPPLimt = ppLimit - (polutedEngiQuartersBlocks + polutedEngiEnergySourceBlocks);

            // the ratio between engines and crew quarters
            // (10/19) is crew quarter density which should be apart of block stats but isnt in this test 
            //let ratioEtoCQ = (1/90) / (10/19)/*engineBlock.reqCrewEngineer / crewQuartersBlock.other*/
            let ratioEtoCQ = this.calcCrewNeeded(engineBlock, 1, true, engineerOverclock) /crewQuartersBlock.other;

            //generators    
            let percentageCQ = ratioEtoCQ / (1+ratioEtoCQ)
            let percentageE = 1 / (1+ratioEtoCQ)
            let ratioEGenToECQ = (energySource.other * this.generatedEnergyMultiplier) / (percentageE*(engineBlock.reqEnergy * this.requiredEnergyMultiplier) + percentageCQ*(crewQuartersBlock.reqEnergy * this.requiredEnergyMultiplier))


            //energy
            // the ratio between energy generators to the engine to crew quarter ratio
            // adjusts engine to crew quater ratio by their energy requirements
            // let ratioEGenToECQ = energySource.other / (engineBlock.reqEnergy + ratioEtoCQ*crewQuartersBlock.reqEnergy)
            
            // expand ratios to fill PP limit
            let eGenCount = newPPLimt/(ratioEGenToECQ+1);
            let engineAndCrewQCount = eGenCount*ratioEGenToECQ;
                
            let engineCount = engineAndCrewQCount * percentageE
            let crewQuartersCount = engineAndCrewQCount * percentageCQ

            //add polution from shield gens / crew
            eGenCount += polutedEngiEnergySourceBlocks;
            crewQuartersCount += polutedEngiQuartersBlocks;

            returnPackage = [eGenCount, engineCount, crewQuartersCount];

        } else {
            // using solar panels instead as the energy source

            // calculate engineer polution
            let polutedEngiQuartersBlocks = this.calcCrewQuarters(this.calcCrewNeeded(shieldBlock, shieldCount, true, engineerOverclock) + this.calcCrewNeeded(thrusterBlock, thrusterCount, true, engineerOverclock) + 0.01);
            let polutedEngiEnergySourceBlocks = (polutedEngiQuartersBlocks*(crewQuartersBlock.reqEnergy * this.requiredEnergyMultiplier)) / (energySource.other * this.generatedEnergyMultiplier);

            //adjusts ppLimit by removing the EngiQuarters blocks demanded by shields
            //unlike above (the generator version) this doesnt also subtract pp to power these crew q (since solar panels dont do that)
            let newPPLimit = ppLimit - polutedEngiQuartersBlocks;

            // the ratio between engines and crew quarters
            let ratioEtoCQ = this.calcCrewNeeded(engineBlock, 1, true, engineerOverclock) /crewQuartersBlock.other;

            let engineCount = newPPLimit /(ratioEtoCQ+1);
            let crewQuartersCount = engineCount * ratioEtoCQ;

            let eGenCount = (engineCount*(engineBlock.reqEnergy * this.requiredEnergyMultiplier) + crewQuartersCount*(crewQuartersBlock.reqEnergy * this.requiredEnergyMultiplier) ) / (energySource.other * this.generatedEnergyMultiplier);

            //add polution from shield gens / crew
            eGenCount += polutedEngiEnergySourceBlocks;
            crewQuartersCount += polutedEngiQuartersBlocks;

            returnPackage = [eGenCount, engineCount, crewQuartersCount];
        }
        return returnPackage;
    };

    calcMaxSpeed(engineCount, overclock) {
        let overclockMult = 1;
        if (overclock) {overclockMult = 2;}
        return (100 * Math.log(engineCount + 5) - 86) * overclockMult;
    };

    calcTotalWeight () {
        let energyGen = "solarPanel"
        if (this.palette.checkPowerSource()) {energyGen = "generator"}
        
        let otherWeight = this.otherWeight;
        let totalWeight = otherWeight;

        // this adds running total safely if eGenWeightSheilds is a valid number if not it uses 0 instead
        // totalWeight += eGenWeightSheilds || 0;

        //shields
        let eGenWeightSheilds = this.eGenCountShields * this.palette[energyGen].weight;
        totalWeight += eGenWeightSheilds || 0;

        let sGenWeight = this.sGenCount * this.palette.shieldGenerator.weight;
        totalWeight += sGenWeight || 0;

        this.shieldsTotalWeight = eGenWeightSheilds + sGenWeight;

        //engines
        let thrusterWeight = this.thrusterCount * this.palette.thruster.weight;
        totalWeight += thrusterWeight || 0;

        let eGenWeightEngines = this.eGenCountEngines * this.palette[energyGen].weight;
        totalWeight += eGenWeightEngines || 0;

        let engineWeight = this.eCount * this.palette.engine.weight;
        totalWeight += engineWeight || 0;

        let crewQWeight = this.cQCountEngines * this.palette.crewQuarters.weight;
        totalWeight += crewQWeight || 0;

        this.enginesTotalWeight = thrusterWeight + eGenWeightEngines + engineWeight + crewQWeight;

        //subsystem
        let subsystemEGenWeight = this.subsystemEGenCount * this.palette[energyGen].weight;
        totalWeight += subsystemEGenWeight || 0;
        
        return {
            totalWeight: totalWeight, 
            otherWeight: otherWeight, 
            eGenWeightSheilds: eGenWeightSheilds, 
            eGenWeightEngines: eGenWeightEngines, 
            sGenWeight: sGenWeight, 
            engineWeight: engineWeight, 
            crewQWeight: crewQWeight,
            subsystemWeight: subsystemEGenWeight
        };
    }
};