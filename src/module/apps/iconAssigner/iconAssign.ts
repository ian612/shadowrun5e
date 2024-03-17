import { SR5 } from "../../config";

export async function getIconFiles(): Promise<string[]> {

    // Icon locations
    const imgFolder = "systems/shadowrun5e/dist/icons/importer/";
    const folderList = await FilePicker.browse("data", imgFolder).then(picker => picker.dirs);
    let fileList = await FilePicker.browse("data", imgFolder).then(picker => picker.files);

    for (const folder of folderList) {
        const newFiles = await FilePicker.browse("data", folder).then(picker => picker.files);
        fileList = fileList.concat(newFiles);
    }

    return fileList
}

export async function iconAssign(importFlags: Shadowrun.ImportFlagData, system: Shadowrun.ShadowrunItemDataData, iconList: string[]): Promise<string> {

    const defaultImg = "icons/svg/item-bag.svg";
    const imgFolder = "systems/shadowrun5e/dist/icons/importer/";
    const imgExtensionOptions = ['.svg', '.webp', '.png', '.jpg', '.jpeg', '.avif'];
    const imgName = importFlags.name;
    const imgType = importFlags.type;
    const imgSubType = importFlags.subType;

    // Get the override, if any
    let override = ''
    if (imgSubType) override = SR5.itemSubTypeIconOverrides[imgType][imgSubType];

    // Priority of file names to check
    let fileNamePriority = [
        imgFolder + override,
        imgFolder + imgType + (imgSubType ? '/' : '') + imgSubType,
        imgFolder + imgType + '/' + imgType,
        imgFolder + imgSubType,
        imgFolder + imgType
    ]
    switch (imgType) {
        case 'armor':
            // TODO: Add separation by if it's an accessory

            break;

        case 'weapon':
            fileNamePriority = [
                imgFolder + override,
                imgFolder + imgType + (imgSubType ? '/' : '') + imgSubType,
                imgFolder + imgType + '/' + system.category,
                imgFolder + imgType + '/' + imgType,
                imgFolder + imgSubType,
                imgFolder + imgType
            ]
            break;

        default:
            break;
    }

    // Run through potential file names, taking the first one that has an icon that exists
    for (const iconFileName of fileNamePriority) {
        for (const imgExtension of imgExtensionOptions) {
            const withExtension = iconFileName + imgExtension;
            if (iconList.includes(withExtension)) {
                return withExtension
            }
        }
    }

    return defaultImg
}