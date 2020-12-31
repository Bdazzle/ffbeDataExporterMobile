var exportDate;
exportDate = formatDate(new Date());
function formatDate(d) {
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function addInventoryLink(data) {
    var ret = [];

    let userData = data.userData;
    let userData2 = data.userData2;
    let userData3 = data.userData3;

    var userEquipListStringArray = userData['w83oV9uP'][0]['HpL3FM4V'].split(",");

    userEquipListStringArray.forEach(function (userEquipStr) {
        var equipStrData = userEquipStr.split(':');
        var equipId = equipStrData[0];
        var equipCount = parseInt(equipStrData[1]);
        if (equipId && equipCount) {
            ret.push({ 'id': equipId, 'count': equipCount });
        }
    });

    var visionCards = userData['2Xi0wuGA'];
    visionCards.forEach(vc => {
        ret.push({ 'id': vc['5giCMUd2'], 'count': 1, 'level': vc['7wV3QZ80'] });
    })

    if (userData3 != null) {
        var userCustomEquips = userData3['uRZxw78i'];
        userCustomEquips.forEach(function (userCustomEquip) {
            var equipId = userCustomEquip["J1YX9kmM"];
            var enhancements = [];
            var customAbilityArray = userCustomEquip["nM63Zvtp"].split(",");
            customAbilityArray.forEach(function (customAbilityStr) {
                if (customAbilityStr) {
                    var abilityId = customAbilityStr.split(":")[1];
                    enhancements.push(abilityId);
                }
            });
            ret.push({ 'id': equipId, 'count': 1, 'enhancements': enhancements });
        });
    }

    var userMateriaListStringArray = userData['aS39Eshy'][0]['HpL3FM4V'].split(",");

    userMateriaListStringArray.forEach(function (userMateriaStr) {
        var materiaStrData = userMateriaStr.split(':');
        var materiaId = materiaStrData[0];
        var materiaCount = parseInt(materiaStrData[1]);
        if (materiaId && materiaCount) {
            ret.push({ 'id': materiaId, 'count': materiaCount });
        }
    });

    return { href: JSON.stringify(ret), download: userData['LhVz6aD2'][0]['9qh17ZUf'] + "_" + exportDate + "_inventory.json" }
}

function addUnitCollectionLink(data) {
    let userData = data.userData;
    let userData2 = data.userData2;

    var unitSublimiation = {};

    var subInfoList = userData["Duz1v8x9"];
    subInfoList.forEach(function (subinfo) {
        var unitUniqueId = subinfo["og2GHy49"];
        var subLvl = subinfo["yjY4GK3X"];
        var subSkillId = subinfo["6bHxDEL0"];

        if (!unitSublimiation[unitUniqueId]) {
            unitSublimiation[unitUniqueId] = [];
        }
        unitSublimiation[unitUniqueId].push(subSkillId + "," + subLvl);
    });

    var ret = [];

    var unitList = userData["B71MekS8"];
    unitList.forEach(function (unitToken) {
        var unitId = unitToken["3HriTp6B"];
        var unitUniqueId = unitToken["og2GHy49"];

        var pots = {
            hp: parseInt(unitToken["em5hx4FX"].split("-")[1]),
            mp: parseInt(unitToken["L0MX7edB"].split("-")[1]),
            atk: parseInt(unitToken["o7Ynu1XP"].split("-")[1]),
            def: parseInt(unitToken["6tyb58Kc"].split("-")[1]),
            mag: parseInt(unitToken["Y9H6TWnv"].split("-")[1]),
            spr: parseInt(unitToken["sa8Ewx3H"].split("-")[1])
        };
        var doors = {
            hp: parseInt(unitToken["em5hx4FX"].split("-")[2]) || 0,
            mp: parseInt(unitToken["L0MX7edB"].split("-")[2]) || 0,
            atk: parseInt(unitToken["o7Ynu1XP"].split("-")[2]) || 0,
            def: parseInt(unitToken["6tyb58Kc"].split("-")[2]) || 0,
            mag: parseInt(unitToken["Y9H6TWnv"].split("-")[2]) || 0,
            spr: parseInt(unitToken["sa8Ewx3H"].split("-")[2]) || 0
        };

        var skillEnhancements = [];
        if (unitSublimiation[unitUniqueId]) {
            unitSublimiation[unitUniqueId].forEach(function (skillInfo) {
                skillEnhancements.push(skillInfo.split(",")[0]);
            });
        }
        var unitData = {
            'id': unitId,
            'uniqueId': unitUniqueId,
            'level': parseInt(unitToken["7wV3QZ80"]),
            'pots': pots,
            'doors': doors,
            'enhancements': skillEnhancements,
            'tmr': parseInt(unitToken["f17L8wuX"]),
            'stmr': parseInt(unitToken["o6m7L38B"]),
            'lbLevel': parseInt(unitToken["a71oxzCH"]),
            'currentLbLevelExp': parseInt(unitToken["EXf5G3Mk"]),
            'totalExp': parseInt(unitToken["X9ABM7En"]),
            'currentLevelExp': parseInt(unitToken["B6H34Mea"]),
            'exRank': parseInt(unitToken["f8vk4JrD"]),
            'nvRarity': unitToken["T9Apq5fS"] == '1',
            'nva': unitToken["k9GFaWm1"] == '1'
        };
        if (unitId == "904000115" || unitId == "904000103") { // Prism Moogle or specific trust moogle
            var tmrId = unitToken["9mu4boy7"];
            if (tmrId) {
                tmrId = tmrId.split(":")[1];
                unitData['tmrId'] = tmrId;
            }
        }
        if (unitId == "906000103") { // super trust moogle
            var stmrId = unitToken["C74EmZ1I"];
            if (stmrId) {
                stmrId = stmrId.split(":")[1];
                unitData['stmrId'] = stmrId;
            }
        }
        ret.push(unitData);

    });

    return { href: JSON.stringify(ret), download: userData['LhVz6aD2'][0]['9qh17ZUf'] + "_" + exportDate + "_units.json" }
}

function addConsumablesLink(data) {
    // console.log('addConsumablesLink data', data)
    let userData = data.userData;
    let ret = [];
    var itemList = userData["4rC0aLkA"];
    itemList.forEach(function (itemToken) {
        let itemCSV = itemToken["HpL3FM4V"];
        var array = itemCSV.split(',');
        array.forEach(function (array) {
            let itemId = array.split(":")[0];
            let itemQty = array.split(":")[1];
            var consumble = {
                'itemId': itemId,
                'itemQty': itemQty
            };
            ret.push(consumble);
        });
    });

    return { href: JSON.stringify(ret), download: userData['LhVz6aD2'][0]['9qh17ZUf'] + "_" + exportDate + "_consumables.json" }
}

function addEspersLink(data) {
    // console.log(' addEspersLink data', data)
    let userData = data.userData;

    let ret = [];
    let map = {};

    userData["gP9TW2Bf"].forEach(e => {
        let esper = {
            "id": e["Iwfx42Wo"],
            "rarity": parseInt(e["9fW0TePj"]),
            "level": parseInt(e["7wV3QZ80"])
        };
        map[esper.id] = esper;
        ret.push(esper);

    });
    userData["1S8P2u9f"].forEach(e => {
        map[e["Iwfx42Wo"]].board = e["E8WRi1bg"];
    });

    return { href: JSON.stringify(ret), download: userData['LhVz6aD2'][0]['9qh17ZUf'] + "_" + exportDate + "_espers.json" }
}

export function addLinks(link_type, data) {
    return link_type == "inventory" ? addInventoryLink(data) :
        link_type == 'units' ? addUnitCollectionLink(data) :
            link_type == "espers" ? addEspersLink(data) :
                addConsumablesLink(data)
}
