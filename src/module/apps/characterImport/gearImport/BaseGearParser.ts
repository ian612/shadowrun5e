import { parseDescription, parseTechnology, formatAsSlug } from "../BaseParserFunctions.js"
import {DataDefaults} from "../../../data/DataDefaults";
import { SR5 } from "../../../config";

/**
 * Parses a certain class of gear (depending on the implementation).
 */
export interface GearParser {
    /**
     * Parses a gear entry and returns the corresponding foundry sr item data.
     * @param chummerGear A chummer gear entry
     */
    parse(chummerGear : any) : any
}

/**
 * Base class for all gear parsers. Parses common information across all gear.
 */
export class BaseGearParser implements GearParser {
    parse(chummerGear : any) : any {
        const parsedGear = this.getDefaultData();
        parsedGear.name = chummerGear.name;
        if (chummerGear.extra)
        {
            parsedGear.name += ` (${chummerGear.extra})`;
        }

        parsedGear.system.technology = parseTechnology(chummerGear);
        parsedGear.system.description = parseDescription(chummerGear);

        return parsedGear;
    }

    setSubType(parsedGear: any, parserType: string, subType: string) {
        if (Object.keys(SR5.itemSubTypeIconOverrides[parserType]).includes(subType)) {
            parsedGear.system.importFlags.subType = formatAsSlug(subType);
        }
    }

    private getDefaultData() {
        return DataDefaults.baseItemData<Shadowrun.EquipmentItemData, Shadowrun.EquipmentData>({type: 'equipment'});
    }
}
