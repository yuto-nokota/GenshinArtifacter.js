// Copyright (c) 2023 yuto-nokota. All rights reserved.
var _GET = (function () {
  var vars = {}; 
  var param = location.search.substring(1).split('&');
  for(var i = 0; i < param.length; i++) {
    var keySearch = param[i].search(/=/);
    var key = '';
    if ( keySearch != -1) key = param[i].slice(0, keySearch);
    var val = param[i].slice(param[i].indexOf('=', 0) + 1);
    if ( key != '') vars[key] = decodeURI(val);
  } 
  return vars; 
})();

function get2url () {
  var get_param_string='';
  for ( var key in _GET ) {
    if ( get_param_string === '' ) {
      get_param_string += '?' + key + '=' + _GET[key];
    } else {
      get_param_string += '&' + key + '=' + _GET[key];
    }
  }
  // TODO which is better ?
  //window.history.pushState(null, null, get_param_string);
  if ( !get_param_string ) {
    get_param_string = "?"
  }
  window.history.replaceState(null, null, encodeURI(get_param_string));
}

function copy_url () {
  var  obj = document.createElement('textarea');
  document.body.appendChild(obj);
  obj.innerHTML = location.href;
  obj.readonly = true;
  obj.select();
  document.execCommand('Copy');
  document.body.removeChild(obj);
}

let data_json = '';
function load_data ( uid ) {
  var xhr = new XMLHttpRequest();
  var url = 'https://enka.network/api/uid/' + uid;
  //var url = './851415193.json';
  xhr.responseType = "text"
  xhr.open('GET', url , true);
  xhr.onload = function () {
    data_json = JSON.parse(xhr.responseText);
    if ( xhr.status == '200' ) {
      console.log('[INFO]'+' Success loading data.' + xhr.status);
      console.log(data_json);
      parse_data(data_json);
    } else {
      console.log('[INFO]'+ 'Failure loading data.' + xhr.status);
    }
  }
  xhr.send();
}

let store_json = {};
function load_store_json ( fname ) {
  var xhr = new XMLHttpRequest();
  var url = 'https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/' + fname;
  //var url = fname;
  xhr.responseType = "text"
  xhr.open('GET', url , true);
  xhr.onload = function () {
    store_json[fname] = JSON.parse(xhr.responseText);
    if ( xhr.status == '200' ) {
      console.log('[INFO]'+' Success loading characters.' + xhr.status);
    } else {
      console.log('[INFO]'+ 'Failure loading characters.' + xhr.status);
    }
  }
  xhr.send();
}

let loc_appendix = {
  "ja" : {
    "FIGHT_PROP_BASE_ATTACK":'基礎攻撃力',
    "FIGHT_PROP_HP":'HP固定値',
    "FIGHT_PROP_ATTACK":'攻撃力固定値',
    "FIGHT_PROP_DEFENSE":'防御力固定値',
    "FIGHT_PROP_HP_PERCENT":'HP%',
    "FIGHT_PROP_ATTACK_PERCENT":'攻撃力%',
    "FIGHT_PROP_DEFENSE_PERCENT":'防御力%',
    "FIGHT_PROP_CRITICAL":'会心率',
    "FIGHT_PROP_CRITICAL_HURT":'会心ダメージ',
    "FIGHT_PROP_CHARGE_EFFICIENCY":'元素チャージ効率',
    "FIGHT_PROP_HEAL_ADD":'与える治癒効果',
    "FIGHT_PROP_ELEMENT_MASTERY":'元素熟知',
    "FIGHT_PROP_PHYSICAL_ADD_HURT":'物理ダメージ',
    "FIGHT_PROP_FIRE_ADD_HURT":'炎元素ダメージ',
    "FIGHT_PROP_ELEC_ADD_HURT":'雷元素ダメージ',
    "FIGHT_PROP_WATER_ADD_HURT":'水元素ダメージ',
    "FIGHT_PROP_WIND_ADD_HURT":'風元素ダメージ',
    "FIGHT_PROP_ICE_ADD_HURT":'氷元素ダメージ',
    "FIGHT_PROP_ROCK_ADD_HURT":'岩元素ダメージ',
    "FIGHT_PROP_GRASS_ADD_HURT":'草元素ダメージ',
    "EQUIP_BRACER":'花',
    "EQUIP_NECKLACE":'羽',
    "EQUIP_SHOES":'時計',
    "EQUIP_RING":'杯',
    "EQUIP_DRESS":'冠',
    "FIGHT_PROP_ID_TABLE" : {
      "1":'基礎HP',
      "2":'HP',
      "3":'HP%',
      "4":'基礎攻撃力',
      "5":'攻撃力',
      "6":'攻撃力%',
      "7":'基礎防御力',
      "8":'防御力',
      "9":'防御力%',
      "10":'基礎速度',
      "11":'速度%',
      "20":'会心率',
      "22":'会心ダメージ',
      "23":'元素チャージ効率',
      "26":'与える治癒効果',
      "27":'受ける治癒効果',
      "28":'元素熟知',
      "29":'物理耐性',
      "30":'物理ダメージ',
      "40":'炎元素ダメージ',
      "41":'雷元素ダメージ',
      "42":'水元素ダメージ',
      "43":'草元素ダメージ',
      "44":'風元素ダメージ',
      "45":'岩元素ダメージ',
      "46":'氷元素ダメージ',
      "50":'炎元素耐性',
      "51":'雷元素耐性',
      "52":'水元素耐性',
      "53":'草元素耐性',
      "54":'風元素耐性',
      "55":'岩元素耐性',
      "56":'氷元素耐性',
      "70":'炎元素 元素エネルギー 要求量(元素爆発)',
      "71":'雷元素 元素エネルギー 要求量(元素爆発)',
      "72":'水元素 元素エネルギー 要求量(元素爆発)',
      "73":'草元素 元素エネルギー 要求量(元素爆発)',
      "74":'風元素 元素エネルギー 要求量(元素爆発)',
      "75":'氷元素 元素エネルギー 要求量(元素爆発)',
      "76":'岩元素 元素エネルギー 要求量(元素爆発)',
      "80":'クールタイム短縮',
      "81":'シールド強化',
      "1000":'現在の炎元素 元素エネルギー',
      "1001":'現在の雷元素 元素エネルギー',
      "1002":'現在の水元素 元素エネルギー',
      "1003":'現在の草元素 元素エネルギー',
      "1004":'現在の風元素 元素エネルギー',
      "1005":'現在の氷元素 元素エネルギー',
      "1006":'現在の岩元素 元素エネルギー',
      "1010":'現在HP',
      "2000":'最大HP',
      "2001":'攻撃力',
      "2002":'防御力',
      "2003":'速度',
      "3025":'元素反応 会心率',
      "3026":'元素反応 会心ダメージ',
      "3027":'元素反応(過負荷)会心率',
      "3028":'元素反応(過負荷)会心ダメージ',
      "3029":'元素反応(拡散)会心率',
      "3030":'元素反応(拡散)会心ダメージ',
      "3031":'元素反応(感電)会心率',
      "3032":'元素反応(感電)会心ダメージ',
      "3033":'元素反応(超伝導)会心率',
      "3034":'元素反応(超伝導)会心ダメージ',
      "3035":'元素反応(燃焼)会心率',
      "3036":'元素反応(燃焼)会心ダメージ',
      "3037":'元素反応(凍結(氷砕き))会心率',
      "3038":'元素反応(凍結(氷砕き))会心ダメージ',
      "3039":'元素反応(開花)会心率',
      "3040":'元素反応(開花)会心ダメージ',
      "3041":'元素反応(烈開花)会心率',
      "3042":'元素反応(烈開花)会心ダメージ',
      "3043":'元素反応(超開花)会心率',
      "3044":'元素反応(超開花)会心ダメージ',
      "3045":'基礎元素反応会心率',
      "3046":'基礎元素反応会心ダメージ',
    }
  }
};

function roundScore ( score ) {
  return Math.floor(score * 10 + 0.5) / 10;
}

let timeout_counter=5;
let timeout_ms = 1500;
let build_card = {};
function parse_data ( data ) {
  let lang = 'ja';
  if ( !(store_json['characters.json'] && store_json['loc.json']) ) {
    if ( --timeout_counter !== 0 ) setTimeout(parse_data,timeout_ms,data);
    return;
  }
  let characters = store_json['characters.json'];
  let loc = store_json['loc.json'];
  console.log(characters);
  if ( !(loc[lang] && loc_appendix[lang] ) ) {
    console.log('[INFO] lang:' + lang + ' is not supported.');
    return;
  }
  let playerInfo = data.playerInfo;
  let avatarInfoList = data.avatarInfoList;
  console.log(data.avatarInfoList[0]);
  for ( var avatarInfo of avatarInfoList ) {
    var id = avatarInfo.avatarId;
    var charName = loc[lang][characters[id].NameTextMapHash];
    console.log(charName);
    build_card[charName] = { "prop" : {}, "totalScore" : 0, "セット効果":{} };
    // parse char data
    //   TODO parse skillMap
    build_card[charName]["天賦"] = {};
    build_card[charName]["天賦"]["通常"]   = avatarInfo.skillLevelMap[characters[id].SkillOrder[0]];
    build_card[charName]["天賦"]["スキル"] = avatarInfo.skillLevelMap[characters[id].SkillOrder[1]];
    build_card[charName]["天賦"]["爆発"]   = avatarInfo.skillLevelMap[characters[id].SkillOrder[2]];
    //   TODO parse Prop
    build_card[charName]["レベル"] = avatarInfo.propMap[4001].val;
    // parse fight properties
    //   parse HP
    var MaxHP   = Math.floor( avatarInfo.fightPropMap[2000] + 0.5 );
    var BaseHP  = Math.floor( avatarInfo.fightPropMap[   1] + 0.5 );
    var AdditionalHP = Math.floor ( MaxHP - BaseHP );
    build_card[charName].prop['HP'] = MaxHP + '=' + BaseHP + '+' + AdditionalHP;
    //   parse ATK
    var ATK     = Math.floor( avatarInfo.fightPropMap[2001] + 0.5 );
    var BaseATK = Math.floor( avatarInfo.fightPropMap[   4] + 0.5 );
    var AdditionalATK = Math.floor ( ATK - BaseATK );
    build_card[charName].prop['攻撃力'] = ATK + '=' + BaseATK + '+' + AdditionalATK;
    //   parse DF
    var DF     = Math.floor( avatarInfo.fightPropMap[2002] + 0.5 );
    var BaseDF = Math.floor( avatarInfo.fightPropMap[   7] + 0.5 );
    var AdditionalDF = Math.floor ( DF - BaseDF );
    build_card[charName].prop['防御力'] = DF + '=' + BaseDF + '+' + AdditionalDF;
    //   parse Elemental Mastery
    build_card[charName].prop['元素熟知'] = Math.floor(avatarInfo.fightPropMap[28] + 0.5);
    //   parse Critical Rate
    build_card[charName].prop['会心率'] = Math.floor(avatarInfo.fightPropMap[20] * 1000 + 0.5 ) / 10 + '%';
    //   parse Critical Damage
    build_card[charName].prop['会心ダメ'] = Math.floor(avatarInfo.fightPropMap[22] * 1000 + 0.5 ) / 10 + '%';
    //   parse Charge
    build_card[charName].prop['元素チャージ効率'] = Math.floor(avatarInfo.fightPropMap[23] * 1000 + 0.5 ) / 10 + '%';
    //   parse Elemental Damage Buff
    for ( var i of [ 30, 40, 41, 42, 43, 44, 45, 46] ) {
      if ( !avatarInfo.fightPropMap[i] ) continue;
      //if ( avatarInfo.fightPropMap[i] == 0 ) continue;
      build_card[charName].prop[loc_appendix[lang].FIGHT_PROP_ID_TABLE[i]] = 
        Math.floor(avatarInfo.fightPropMap[i] * 1000 + 0.5 ) / 10 + '%';
    }
    //   parse Others
    for ( var i of [ 26, 27, ] ) {
      if ( !avatarInfo.fightPropMap[i] ) continue;
      //if ( avatarInfo.fightPropMap[i] == 0 ) continue;
      build_card[charName].prop[loc_appendix[lang].FIGHT_PROP_ID_TABLE[i]] = 
        Math.floor(avatarInfo.fightPropMap[i] * 1000 + 0.5 ) / 10 + '%';
    }
    // parse artifacts and weapon
    for ( var equip of avatarInfo.equipList ) {
      var name = '';
      if ( equip['reliquary'] ) {
        // if equip is an artifact
        var score = 0;
        score = 0;
        equipName = loc[lang][equip.flat.setNameTextMapHash];
        if ( !build_card[charName]['セット効果'][equipName] ) build_card[charName]['セット効果'][equipName] = 0;
        build_card[charName]['セット効果'][equipName]++;
        typeName = loc_appendix[lang][equip.flat.equipType];
        build_card[charName][typeName] = {"部位" : typeName, "名前":equipName, "メイン":[],"サブ":[],"Score":0};
        mainop = equip.flat['reliquaryMainstat'];
        var propname = loc_appendix[lang][mainop.mainPropId];
        var propval  = mainop.statValue;
        build_card[charName][typeName]["メイン"] = [ propname , propval ];
        for ( var subop of equip.flat['reliquarySubstats'] ) {
          var propname = loc_appendix[lang][subop.appendPropId];
          var propval  = subop.statValue;
          build_card[charName][typeName]["サブ"].push( [ propname , propval ] );
          switch ( subop.appendPropId ) {
            case 'FIGHT_PROP_ATTACK_PERCENT' : score += propval;   break;
            case 'FIGHT_PROP_CRITICAL'       : score += propval*2; break;
            case 'FIGHT_PROP_CRITICAL_HURT'  : score += propval;   break;
          }
        }
        build_card[charName][typeName].Score = roundScore(score);
        build_card[charName].totalScore += score;
      } 
      if (equip['weapon'] ) {
        // if equip is a weapon
        equipName = loc[lang][equip.flat.nameTextMapHash];
        affixMap = equip.weapon.affixMap;
        affixRank = affixMap[Object.keys(affixMap)[0]] + 1;
        build_card[charName]["武器"] = { 
          "名前" : equipName,
          "レベル" : equip.weapon.level,
          "精錬ランク" : affixRank,
        };
        for ( var wStats of equip.flat.weaponStats ) {
          var propname = loc_appendix[lang][wStats.appendPropId];
          var propval  = wStats.statValue;
          build_card[charName]["武器"][propname] = propval;
        }
      }
    }
    totalScore = build_card[charName].totalScore;
    build_card[charName].totalScore = roundScore(totalScore);
  }
  for ( var key in build_card ) {
    document.getElementById('main').appendChild(build_card_table(key));
  }
}

function create_td_from_text ( text ) {
  var td = document.createElement('td');
  td.appendChild(document.createTextNode(text));
  return td;
}

function create_single_artifact_table ( artifact ) {
  var table = document.createElement('table');
  var tr = document.createElement('tr');
  tr.appendChild(create_td_from_text(artifact["部位"]));
  tr.appendChild(create_td_from_text(artifact["名前"]));
  table.appendChild(tr);
  var tr = document.createElement('tr');
  tr.appendChild(create_td_from_text('【' + artifact["メイン"][0] + '】' ));
  tr.appendChild(create_td_from_text(artifact["メイン"][1]));
  table.appendChild(tr);
  for ( var subs of artifact["サブ"] ) {
    var tr = document.createElement('tr');
    tr.appendChild(create_td_from_text(subs[0]));
    tr.appendChild(create_td_from_text(subs[1]));
    table.appendChild(tr);
  }
  var tr = document.createElement('tr');
  tr.appendChild(create_td_from_text('Score'));
  tr.appendChild(create_td_from_text(artifact["Score"]));
  table.appendChild(tr);
  return table;
}

function create_single_artifactSet_table ( artifactSet ) {
  var table = document.createElement('table');
  for ( var key in artifactSet ) {
    if ( (artifactSet[key]-0) >= 2 ) {
      var tr = document.createElement('tr');
      tr.appendChild(create_td_from_text(key));
      tr.appendChild(create_td_from_text(artifactSet[key]));
      table.appendChild(tr);
    }
  }
  return table;
}

function create_single_weapon_table ( weapon ) {
  var keyHash = { "名前" : true, "レベル": true, "精錬ランク": true, "基礎攻撃力" : true, };
  var table = document.createElement('table');
  var tr = document.createElement('tr');
  tr.appendChild(create_td_from_text("武器"));
  tr.appendChild(create_td_from_text(weapon["名前"]));
  table.appendChild(tr);
  for ( var key of ["レベル", "精錬ランク", "基礎攻撃力"] ) {
    var tr = document.createElement('tr');
    tr.appendChild(create_td_from_text(key));
    tr.appendChild(create_td_from_text(weapon[key]));
    table.appendChild(tr);
  }
  for ( var key in weapon ) {
    if ( keyHash[key] ) continue;
    var tr = document.createElement('tr');
    tr.appendChild(create_td_from_text(key));
    tr.appendChild(create_td_from_text(weapon[key]));
    table.appendChild(tr);
  }
  table.appendChild(tr);
  return table;
}

function create_single_prop_table ( prop ) {
  var table = document.createElement('table');
  var tr = document.createElement('tr');
  for ( var key in prop ) {
    var tr = document.createElement('tr');
    tr.appendChild(create_td_from_text(key));
    tr.appendChild(create_td_from_text(prop[key]));
    table.appendChild(tr);
  }
  table.appendChild(tr);
  return table;
}

function create_all_artifacts_table ( charName ) {
  var table = document.createElement('table');
  table.setAttribute('border',1);
  table.style['border-collapse'] = 'collapse';
  var tr = document.createElement('tr');
  for ( var equipType of ["花", "羽", "時計","杯","冠"] ) {
    var td = document.createElement('td');
    td.appendChild(create_single_artifact_table(build_card[charName][equipType]));
    tr.appendChild(td);
  }
  table.appendChild(tr);
  return table;
}

function create_skillLevel_table ( skill ) {
  var table = document.createElement('table');
  table.setAttribute('border',1);
  table.style['border-collapse'] = 'collapse';
  for ( var key of [ '通常', 'スキル', '爆発'] ) {
    var tr = document.createElement('tr');
    tr.appendChild(create_td_from_text(key));
    tr.appendChild(create_td_from_text(skill[key]));
    table.appendChild(tr);
  }
  return table;
}

function create_character_table ( charName ) {
  var table = document.createElement('table');
  table.setAttribute('border',1);
  table.style['border-collapse'] = 'collapse';
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  td.appendChild(document.createTextNode(charName));
  td.setAttribute('colspan','2')
  tr.appendChild(td);
  table.appendChild(tr);
  var tr = document.createElement('tr');
  tr.appendChild(create_td_from_text('レベル'));
  tr.appendChild(create_td_from_text(build_card[charName]['レベル']));
  table.appendChild(tr);
  var tr = document.createElement('tr');
  tr.appendChild(create_td_from_text('天賦'));
  var td = document.createElement('td');
  td.appendChild(create_skillLevel_table(build_card[charName]['天賦']));
  tr.appendChild(td);
  table.appendChild(tr);
  return table;
}

function create_totalScore_table ( totalScore ) {
  var table = document.createElement('table');
  var tr = document.createElement('tr');
  tr.appendChild(create_td_from_text('総合スコア'));
  tr.appendChild(create_td_from_text(totalScore));
  table.appendChild(tr);
  return table;
}

function build_card_table ( charName ) {
  var table = document.createElement('table');
  table.setAttribute('border',1);
  table.style['border-collapse'] = 'collapse';
  var subTable = document.createElement('table');
  //subTable.setAttribute('border',1);
  //subTable.style['border-collapse'] = 'collapse';
  { 
    var tr_bkp = tr;
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.appendChild(create_character_table(charName));
    tr.appendChild(td);
    var td = document.createElement('td');
    td.appendChild(create_single_prop_table(build_card[charName].prop));
    tr.appendChild(td);
    var subsubTable = document.createElement('table');
    subsubTable.setAttribute('border',1);
    subsubTable.style['border-collapse'] = 'collapse';
    {
      var tr_bkp = tr;
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.appendChild(create_single_weapon_table(build_card[charName]["武器"]));
      tr.appendChild(td);
      subsubTable.appendChild(tr);
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.appendChild(create_single_artifactSet_table(build_card[charName]["セット効果"]));
      tr.appendChild(td);
      subsubTable.appendChild(tr);
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.appendChild(create_totalScore_table(build_card[charName].totalScore));
      tr.appendChild(td);
      subsubTable.appendChild(tr);
      tr = tr_bkp;
    }
    var td = document.createElement('td');
    td.appendChild(subsubTable);
    tr.appendChild(td);
    subTable.appendChild(tr);
    tr = tr_bkp;
  }
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  td.appendChild(subTable);
  tr.appendChild(td);
  table.appendChild(tr);

  var tr = document.createElement('tr');
  var td = document.createElement('td');
  td.appendChild(create_all_artifacts_table(charName));
  tr.appendChild(td);
  table.appendChild(tr);
  return table;
}

//let uid = '851415193';
function onload_function () {
  load_store_json('loc.json');
  load_store_json('characters.json');
  if ( !_GET['uid'] ) {
    _GET['uid'] = window.prompt('UID',"")
    get2url ();
  }
  load_data(_GET['uid']);
}



