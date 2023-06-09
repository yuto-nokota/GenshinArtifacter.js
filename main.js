// Copyright (c) 2023 yuto-nokota. All rights reserved.
let messages = null;
let font_common = 'serif';
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
  messages.innerHTML += 'Loading data...<br>';
  var xhr = new XMLHttpRequest();
  var url = 'https://enka.network/api/uid/' + uid;
  //var url = './testdata/851415193.json';
  xhr.responseType = "text"
  xhr.open('GET', url , true);
  xhr.onload = async function () {
    data_json = JSON.parse(xhr.responseText);
    if ( xhr.status == '200' ) {
      console.log('[INFO]'+' Success loading data. (' + xhr.status + ')' );
      console.log(data_json);
      await parse_data(data_json);
      print_build_card();
    } else {
      console.log('[INFO]'+ 'Failure loading data. (' + xhr.status + ')' );
    }
  }
  xhr.send();
}

let store_json = {};
function load_store_json ( fname ) {
  messages.innerHTML += 'Loading ' + fname + '...<br>';
  var xhr = new XMLHttpRequest();
  var url = 'https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/' + fname;
  //var url = './testdata/' + fname;
  xhr.responseType = "text"
  xhr.open('GET', url , true);
  xhr.onload = function () {
    store_json[fname] = JSON.parse(xhr.responseText);
    if ( xhr.status == '200' ) {
      console.log('[INFO]'+' Success loading ' + fname + '. (' + xhr.status + ')' );
    } else {
      console.log('[INFO]'+ 'Failure loading ' + fname + '. (' + xhr.status + ')' );
    }
  }
  xhr.send();
}

let units = {
  "FIGHT_PROP_BASE_ATTACK":'',
  "FIGHT_PROP_HP":'',
  "FIGHT_PROP_ATTACK":'',
  "FIGHT_PROP_DEFENSE":'',
  "FIGHT_PROP_HP_PERCENT":'%',
  "FIGHT_PROP_ATTACK_PERCENT":'%',
  "FIGHT_PROP_DEFENSE_PERCENT":'%',
  "FIGHT_PROP_CRITICAL":'%',
  "FIGHT_PROP_CRITICAL_HURT":'%',
  "FIGHT_PROP_CHARGE_EFFICIENCY":'%',
  "FIGHT_PROP_HEAL_ADD":'%',
  "FIGHT_PROP_ELEMENT_MASTERY":'',
  "FIGHT_PROP_PHYSICAL_ADD_HURT":'%',
  "FIGHT_PROP_FIRE_ADD_HURT":'%',
  "FIGHT_PROP_ELEC_ADD_HURT":'%',
  "FIGHT_PROP_WATER_ADD_HURT":'%',
  "FIGHT_PROP_WIND_ADD_HURT":'%',
  "FIGHT_PROP_ICE_ADD_HURT":'%',
  "FIGHT_PROP_ROCK_ADD_HURT":'%',
  "FIGHT_PROP_GRASS_ADD_HURT":'%',
}

let appendPropGains = {
  "FIGHT_PROP_HP": [209, 239, 269, 299],
  "FIGHT_PROP_ATTACK":[14, 16, 18, 19],
  "FIGHT_PROP_DEFENSE":[16, 19, 21, 23],
  "FIGHT_PROP_HP_PERCENT":[4.1, 4.7, 5.3, 5.8],
  "FIGHT_PROP_ATTACK_PERCENT":[4.1, 4.7, 5.3, 5.8],
  "FIGHT_PROP_DEFENSE_PERCENT":[5.1, 5.8, 6.6, 7.3],
  "FIGHT_PROP_CRITICAL":[2.7, 3.1, 3.5, 3.9],
  "FIGHT_PROP_CRITICAL_HURT": [5.4, 6.2, 7.0, 7.8],
  "FIGHT_PROP_CHARGE_EFFICIENCY":[4.5, 5.2, 5.8, 6.5],
  "FIGHT_PROP_ELEMENT_MASTERY":[16, 19, 21, 23],
}

let loc_appendix = {
  "ja" : {
    "FIGHT_PROP_BASE_ATTACK":'基礎攻撃力',
    "FIGHT_PROP_HP":'HP',
    "FIGHT_PROP_ATTACK":'攻撃力',
    "FIGHT_PROP_DEFENSE":'防御力',
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

const calcByList = ['攻撃換算', 'HP換算', '防御換算'];
function create_calcBySelectList ( charName ){
  messages.innerHTML += 'Creating CalcBy List of ' + charName + '...<br>';
  let select = document.createElement('select');
  select.id   = charName + '-calcBy';
  select.name = charName + '-calcBy';
  for ( var val of calcByList ) {
    var option = document.createElement('option');
    option.value     = val;
    option.innerHTML = val;
    select.appendChild(option);
  }
  if ( calcByHash[charName] ) {
    for ( var i=0; i<select.options.length; ++i ) {
      if ( select.options[i].value != calcByHash[charName] ) continue;
      select.options[i].selected = true;
      break;
    }
  } else {
    select.options[0].selected = true;
  }
  select.onchange = print_build_card;
  return select;
}

function change_font() {
  _GET['font'] = document.getElementById('font_common').value;
  font_common = _GET['font'];
  get2url();
  print_build_card();
}

function setUid () {
  _GET['uid'] = document.getElementById('uid').value;
  get2url();
  load_data(_GET['uid']);
}

let charNameHash = {};

let timeout_counter=5;
let timeout_ms = 1500;
let build_card = {};

let characters = null;
let loc = null;
let affixes = null;

async function parse_data ( data ) {
  messages.innerHTML += 'Parsing data...<br>';
  let lang = 'ja';
  if ( !(store_json['characters.json'] && store_json['loc.json'] && store_json['affixes.json']) ) {
    if ( --timeout_counter !== 0 ) setTimeout(parse_data,timeout_ms,data);
    console.log("timeout_counter = " + timeout_counter );
    return;
  }
  build_card = {};
  characters = store_json['characters.json'];
  loc = store_json['loc.json'];
  affixes = store_json['affixes.json'];
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
    charNameHash[charName] = id;
    build_card[charName] = { "prop" : {}, "totalScore" : {}, "セット効果":{} };
    for ( var val of calcByList ) {
      build_card[charName].totalScore[val] = 0;
    }
    // parse char data
    //   parse skillMap
    // proudSkillExtraLevelMap
    build_card[charName]["天賦"] = { "通常" : {}, "スキル" : {}, "爆発" : {}};
    build_card[charName]["天賦"]["通常"].base   = avatarInfo.skillLevelMap[characters[id].SkillOrder[0]];
    build_card[charName]["天賦"]["スキル"].base = avatarInfo.skillLevelMap[characters[id].SkillOrder[1]];
    build_card[charName]["天賦"]["爆発"].base   = avatarInfo.skillLevelMap[characters[id].SkillOrder[2]];
    function skillExtra ( i ) {
      if ( !avatarInfo.proudSkillExtraLevelMap ) return 0;
      if ( !avatarInfo.proudSkillExtraLevelMap[characters[id].ProudMap[characters[id].SkillOrder[i]]] ) return 0;
      return avatarInfo.proudSkillExtraLevelMap[characters[id].ProudMap[characters[id].SkillOrder[i]]];
    }
    build_card[charName]["天賦"]["通常"].extra   = skillExtra(0);
    build_card[charName]["天賦"]["スキル"].extra = skillExtra(1);
    build_card[charName]["天賦"]["爆発"].extra   = skillExtra(2);

    //   parse Prop
    build_card[charName]["レベル"] = 'Lv.' + avatarInfo.propMap[4001].val;
    build_card[charName]["好感度"] = avatarInfo.fetterInfo.expLevel;
    build_card[charName]["凸"] = (avatarInfo.talentIdList) ? (avatarInfo.talentIdList.length ) : 0;
    build_card[charName]["元素"] = characters[id].Element;
    build_card[charName].iconURL = characters[id].SideIconName
      .replace('UI_AvatarIcon_Side_','https://enka.network/ui/UI_Gacha_AvatarImg_') + '.png';
    // parse fight properties
    //   parse HP
    var MaxHP   = Math.floor( avatarInfo.fightPropMap[2000] + 0.5 );
    var BaseHP  = Math.floor( avatarInfo.fightPropMap[   1] + 0.5 );
    var AdditionalHP = Math.floor ( MaxHP - BaseHP );
    build_card[charName].prop['HP'] = {};
    build_card[charName].prop['HP'].value      = MaxHP;
    build_card[charName].prop['HP'].base       = BaseHP;
    build_card[charName].prop['HP'].additional = AdditionalHP;
    //   parse ATK
    var ATK     = Math.floor( avatarInfo.fightPropMap[2001] + 0.5 );
    var BaseATK = Math.floor( avatarInfo.fightPropMap[   4] + 0.5 );
    var AdditionalATK = Math.floor ( ATK - BaseATK );
    build_card[charName].prop['攻撃力'] = {};
    build_card[charName].prop['攻撃力'].value      = ATK;
    build_card[charName].prop['攻撃力'].base       = BaseATK;
    build_card[charName].prop['攻撃力'].additional = AdditionalATK;
    //   parse DF
    var DF     = Math.floor( avatarInfo.fightPropMap[2002] + 0.5 );
    var BaseDF = Math.floor( avatarInfo.fightPropMap[   7] + 0.5 );
    var AdditionalDF = Math.floor ( DF - BaseDF );
    build_card[charName].prop['防御力'] = {};
    build_card[charName].prop['防御力'].value      = DF;
    build_card[charName].prop['防御力'].base       = BaseDF;
    build_card[charName].prop['防御力'].additional = AdditionalDF;
    //   parse Elemental Mastery
    build_card[charName].prop['元素熟知'] = {};
    build_card[charName].prop['元素熟知'].value = Math.floor(avatarInfo.fightPropMap[28] + 0.5);
    //   parse Critical Rate
    build_card[charName].prop['会心率'] = {};
    build_card[charName].prop['会心率'].value = Math.floor(avatarInfo.fightPropMap[20] * 1000 + 0.5 ) / 10 + '%';
    //   parse Critical Damage
    build_card[charName].prop['会心ダメ'] = {};
    build_card[charName].prop['会心ダメ'].value = Math.floor(avatarInfo.fightPropMap[22] * 1000 + 0.5 ) / 10 + '%';
    //   parse Charge
    build_card[charName].prop['元素チャージ効率'] = {};
    build_card[charName].prop['元素チャージ効率'].value = Math.floor(avatarInfo.fightPropMap[23] * 1000 + 0.5 ) / 10 + '%';
    //   parse Elemental Damage Buff
    for ( var i of [ 30, 40, 41, 42, 43, 44, 45, 46] ) {
      if ( !avatarInfo.fightPropMap[i] ) continue;
      //if ( avatarInfo.fightPropMap[i] == 0 ) continue;
      build_card[charName].prop[loc_appendix[lang].FIGHT_PROP_ID_TABLE[i]] = {};
      build_card[charName].prop[loc_appendix[lang].FIGHT_PROP_ID_TABLE[i]].value = 
        Math.floor(avatarInfo.fightPropMap[i] * 1000 + 0.5 ) / 10 + '%';
    }
    //   parse Others
    for ( var i of [ 26, 27, ] ) {
      if ( !avatarInfo.fightPropMap[i] ) continue;
      //if ( avatarInfo.fightPropMap[i] == 0 ) continue;
      build_card[charName].prop[loc_appendix[lang].FIGHT_PROP_ID_TABLE[i]] = {};
      build_card[charName].prop[loc_appendix[lang].FIGHT_PROP_ID_TABLE[i]].value = 
        Math.floor(avatarInfo.fightPropMap[i] * 1000 + 0.5 ) / 10 + '%';
    }
    // parse artifacts and weapon
    for ( var equip of avatarInfo.equipList ) {
      var name = '';
      if ( equip['reliquary'] ) {
        // if equip is an artifact
        var score = { "common" : 0};
        for ( var val of calcByList ) {
          score[val] = 0;
        }
        equipName = loc[lang][equip.flat.setNameTextMapHash];
        if ( !build_card[charName]['セット効果'][equipName] ) build_card[charName]['セット効果'][equipName] = 0;
        build_card[charName]['セット効果'][equipName]++;
        typeName = loc_appendix[lang][equip.flat.equipType];
        level = equip.reliquary.level;
        build_card[charName][typeName] = {
          "部位" : typeName,
          "名前":equipName,
          "レベル" : level,
          "メイン":{},
          "サブ":{},
          "Score":{}
        };
        for ( var val of calcByList ) {
          build_card[charName][typeName].Score[val] = 0;
        }
        mainop = equip.flat['reliquaryMainstat'];
        var propname = loc_appendix[lang][mainop.mainPropId];
        var propval  = mainop.statValue + units[mainop.mainPropId];
        build_card[charName][typeName].iconURL = 'https://enka.network/ui/' + equip.flat.icon + '.png';
        build_card[charName][typeName]["レベル"] = '+' + ( level - 1 );
        build_card[charName][typeName]["メイン"][propname] = { "効果名": propname , "値": propval };
        if ( equip.flat.reliquarySubstats ) {
          for ( var subop of equip.flat['reliquarySubstats'] ) {
            var propname = loc_appendix[lang][subop.appendPropId];
            var propval  = subop.statValue + units[subop.appendPropId];
            build_card[charName][typeName]["サブ"][propname] ={ "効果名" : propname, "値" : propval, "上昇値":[] } ;
            switch ( subop.appendPropId ) {
              case 'FIGHT_PROP_ATTACK_PERCENT' : score[calcByList[0]] += subop.statValue;   break;
              case 'FIGHT_PROP_HP_PERCENT'     : score[calcByList[1]] += subop.statValue;   break;
              case 'FIGHT_PROP_DEFENSE_PERCENT': score[calcByList[2]] += subop.statValue;   break;
              case 'FIGHT_PROP_CRITICAL'       : score.common         += subop.statValue*2; break;
              case 'FIGHT_PROP_CRITICAL_HURT'  : score.common         += subop.statValue;   break;
            }
          }
          for ( var gain of equip.reliquary.appendPropIdList ) {
            var affix = affixes[gain];
            var propname = loc_appendix[lang][affix.propType];
            var propval  = appendPropGains[affix.propType][affix.position - 1];
            build_card[charName][typeName]["サブ"][propname]["上昇値"].push(propval);
          }
        }
        for ( var val of calcByList ) {
          score[val] += score.common;
          build_card[charName][typeName].Score[val] = roundScore(score[val]);
          build_card[charName].totalScore[val] += score[val];
        }
      } 
      if (equip['weapon'] ) {
        // if equip is a weapon
        equipName = loc[lang][equip.flat.nameTextMapHash];
        affixMap = equip.weapon.affixMap;
        affixRank = ( (affixMap) ? (affixMap[Object.keys(affixMap)[0]] + 1 ) : 1 );
        build_card[charName]["武器"] = { 
          "名前" : equipName,
          "レベル" : 'Lv.' + equip.weapon.level,
          "精錬ランク" : affixRank,
          "星" : equip.flat.rankLevel,
        };
        build_card[charName]["武器"].iconURL = 'https://enka.network/ui/' + equip.flat.icon + '.png';
        for ( var wStats of equip.flat.weaponStats ) {
          var propname = loc_appendix[lang][wStats.appendPropId];
          var propval  = wStats.statValue;
          build_card[charName]["武器"][propname] = propval + units[wStats.appendPropId];
        }
      }
    }
    for ( var val of calcByList ) {
      var totalScore = build_card[charName].totalScore[val];
      build_card[charName].totalScore[val] = roundScore(totalScore);
    }
  }
}

let calcByHash = {};

async function print_build_card () {
  messages.innerHTML += 'Printing build card...<br>';
  for ( var key in build_card ) {
    var e = document.getElementById(key+'-calcBy');
    if ( e ) calcByHash[key] = e.value;
  }
  document.getElementById('main').innerHTML = '';

  let keys = Object.keys(build_card);
  let cvs = [];
  var defaultCalcBy = create_calcBySelectList().value;
  for ( var i=0; i<keys.length; ++i ) {
    key = keys[i];
    if ( !calcByHash[key] ) calcByHash[key] = defaultCalcBy;
    cvs.push(create_build_card_canvas(key));
  }
  cvs = await Promise.all(cvs);
  for ( var i=0; i<keys.length; ++i ) {
    key = keys[i];
    await cvs[i];
    var c = cvs[i];
    document.getElementById('main').appendChild(document.createTextNode(key));
    document.getElementById('main').appendChild(create_calcBySelectList(key));
    document.getElementById('main').appendChild(document.createElement('hr'));
    document.getElementById('main').appendChild(c);
    document.getElementById('main').appendChild(document.createElement('hr'));
  }
}

function fillRoundRect(x, y, w, h, r) {
  for ( var i=r.length; i<4; ++i ) {
    r[i] = r[r.length-1];
  }
  this.beginPath();
  this.moveTo(x + r[0], y);
  this.lineTo(x + w - r[3], y);
  if ( r[3] > 0 ) this.arc(x + w - r[3], y + r[3], r[3], Math.PI * (3/2), 0, false);
  this.lineTo(x + w, y + h - r[2]);
  if ( r[2] > 0 ) this.arc(x + w - r[2], y + h - r[2], r[2], 0, Math.PI * (1/2), false);
  this.lineTo(x + r[1], y + h);       
  if ( r[1] > 0 ) this.arc(x + r[1], y + h - r[1], r[1], Math.PI * (1/2), Math.PI, false);
  this.lineTo(x, y + r[0]);
  if ( r[0] > 0 ) this.arc(x + r[0], y + r[0], r[0], Math.PI, Math.PI * (3/2), false);
  this.closePath();
  this.fill();
}

const forground = [ 255, 255, 255, 1.0];
const midground = [   0,   0,   0, 0.4];
const background =[   0,   0,   0, 1.0];
const elementColor = {
  "Ice"      : [   0, 192, 255, 0.5],
  "Wind"     : [   0, 255, 221, 0.5],
  "Electric" : [ 188, 103, 255, 0.5],
  "Water"    : [  77, 156, 255, 0.5],
  "Fire"     : [ 255, 110,  82, 0.5],
  "Rock"     : [ 255, 176,  51, 0.5],
  "Grass"    : [  64, 255,  70, 0.5],
  "None"     : [ 100, 100, 100, 0.5],
}

const tierColor = {
  "SS" : [ 254, 132, 200, 1.0],
  "S"  : [ 146, 255,  99, 1.0],
  "A"  : [ 255,  90,  90, 1.0],
  "B"  : [ 255, 227,  97, 1.0],
}

const tierTable = {
  "total": {
    "SS": 220,
    "S" : 200,
    "A" : 180,
    "B" :   0,
  },
  "花": {
    "SS": 50,
    "S" : 45,
    "A" : 40,
    "B" :  0,
  },
  "羽": {
    "SS": 50,
    "S" : 45,
    "A" : 40,
    "B" :  0,
  },
  "時計": {
    "SS": 45,
    "S" : 40,
    "A" : 35,
    "B" :  0,
  },
  "杯": {
    "SS": 45,
    "S" : 40,
    "A" : 37,
    "B" :  0,
  },
  "冠": {
    "SS": 40,
    "S" : 35,
    "A" : 30,
    "B" :  0,
  },
}

async function create_single_artifact_canvas ( artifacts, calcBy ) {
  messages.innerHTML += 'Creating artifact card of ' + ((artifacts)?(artifacts["部位"]):('null')) + '...<br>';
  let canvas = document.createElement('canvas');
  canvas.width  = 360;
  canvas.height = 415;
  canvas.style["width"]  = canvas.width;
  canvas.style["height"] = canvas.height;
  var context = canvas.getContext('2d');
  context.fillRoundRect = fillRoundRect;
  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + midground + ')';
  context.fillRoundRect(0,0,canvas.width, canvas.height, [10]);
  context.fillStyle = fillStyleOrg;
  context.fillStyle = 'rgba(' + forground + ')';

  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + midground + ')';
  context.fillRoundRect(0,canvas.height-45,canvas.width, 45, [0,10,10,0]);
  context.fillStyle = fillStyleOrg;

  if ( !artifacts ) return canvas;
  var img = await getImageFromURL( artifacts.iconURL);
  var r = Math.min ( 175 / ( img.width * 0.75 ),  200 / (img.height * 0.80 ) );
  context.drawImage(img,img.width*0.25,img.height*0.2,img.width*0.75,img.height*0.8, 0,0,r*img.width,r*img.height);

  context.font = '30px ' + font_common;
  context.textAlign = 'right';
  var mainpropname = Object.keys(artifacts["メイン"])[0];
  context.fillText(mainpropname,canvas.width-15,45);
  context.font = '40px ' + font_common;
  context.fillText(artifacts["メイン"][mainpropname]["値"],canvas.width-15,85);

  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + [0,0,0,0.3] + ')';
  context.fillRect(canvas.width-61,90,47,30); 
  context.fillStyle = fillStyleOrg;

  context.font = '25px ' + font_common;
  context.textAlign = 'right';
  context.fillText(artifacts["レベル"],canvas.width-15,115);

  var subpropnameList =  Object.keys(artifacts["サブ"]);
  for ( var i=0; i< subpropnameList.length; ++i )  {
    context.font = '25px ' + font_common;
    var sub = artifacts["サブ"][subpropnameList[i]];
    context.textAlign = 'left';
    context.fillText(sub["効果名"],50,195+50*i);
    context.textAlign = 'right';
    context.fillText(sub["値"],canvas.width-15,195+50*i);
    context.font = '15px ' + font_common;
    context.fillText(sub["上昇値"].join('+'),canvas.width-15,210+50*i);
  }

  if ( subpropnameList.length > 0 ) {
    context.font = '25px ' + font_common;
    context.textAlign = 'right';
    context.fillText('Score', canvas.width-110, canvas.height-10);
    context.font = '35px ' + font_common;
    context.fillText(artifacts["Score"][calcBy], canvas.width-15, canvas.height-10);

    context.font = 'italic bold 40px ' + font_common;
    context.textAlign = 'left';
    var fillStyleOrg = context.fillStyle;
    var strokeStyleOrg = context.strokeStyle;
    var lineWidthOrg = context.lineWidth;
    context.lineWidth = 2;
    for ( var tier of ["SS", "S", "A", "B" ] ) {
      if ( artifacts["Score"][calcBy] >= tierTable[artifacts["部位"]][tier] ) {
        const gradient = context.createLinearGradient(0,0,0,415);
        gradient.addColorStop(0.0, 'rgba(' + [255,255,255,1.0] + ')');
        gradient.addColorStop(375/415, 'rgba(' + [255,255,255,1.0] + ')');
        gradient.addColorStop(390/415, 'rgba(' + tierColor[tier] + ')');
        gradient.addColorStop(405/415, 'rgba(' + [255,255,255,1.0] + ')');
        gradient.addColorStop(1.0, 'rgba(' + [255,255,255,1.0] + ')');
        context.fillStyle = gradient;
        context.strokeStyle = 'rgba(' + tierColor[tier] + ')';
        context.beginPath();
        context.fillText(tier, 60, canvas.height-10);
        context.stroke();
        break;
      }
    }
    context.fillStyle = fillStyleOrg;
    context.strokeStyle = strokeStyleOrg;
    context.lineWidth = lineWidthOrg;
  }

  return canvas;
}

async function create_weapon_canvas ( weapon ) {
  messages.innerHTML += 'Creating weapon card of ' + ((weapon)?(weapon["名前"]):('null')) + '...<br>';
  const keyHash = { 
    "名前" : true, 
    "レベル": true, 
    "精錬ランク": true, 
    "基礎攻撃力" : true, 
    "iconURL" : true , 
    "星" : true
  };
  let canvas = document.createElement('canvas');
  canvas.width  = 465;
  canvas.height = 180;
  canvas.style["width"]  = canvas.width;
  canvas.style["height"] = canvas.height;
  var context = canvas.getContext('2d');
  context.fillRoundRect = fillRoundRect;
  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + midground + ')';
  context.fillRoundRect(0,0,canvas.width, canvas.height, [10]);
  context.fillStyle = fillStyleOrg;
  context.fillStyle = 'rgba(' + forground + ')';

  var img = await getImageFromURL( weapon.iconURL);
  var r = Math.min ( 160 / img.width ,  160 / img.height ) ;
  context.drawImage(img,00,20,r*img.width,r*img.height)

  var strokeStyleOrg = context.strokeStyle;
  var lineWidthOrg = context.lineWidth;

  context.strokeStyle = 'rgba(' + [77,113,129,1.0] + ')';
  context.lineWidth = '2';
  context.beginPath();
  context.moveTo(160,10);
  context.lineTo(160,canvas.height-10);
  context.stroke();

  context.strokeStyle = strokeStyleOrg;
  context.lineWidth = lineWidthOrg;

  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + [0,0,0,0.5] + ')';
  context.fillRect(9,9,35,27); 
  context.fillStyle = fillStyleOrg;

  context.font = '25px ' + font_common;
  context.fillText('R' + weapon["精錬ランク"],10,35)

  var fillStyleOrg = context.fillStyle;
  const gradient = context.createLinearGradient(0,0,0,180);
  gradient.addColorStop(0.0, 'rgba(' + [255,255,255,0.0] + ')');
  gradient.addColorStop(160/180, 'rgba(' + [110,55,184,0.0] + ')');
  gradient.addColorStop(165/180, 'rgba(' + [110,55,184,1.0] + ')');
  gradient.addColorStop(170/180, 'rgba(' + [110,55,184,0.0] + ')');
  gradient.addColorStop(1.0, 'rgba(' + [255,255,255,0.0] + ')');
  context.fillStyle = gradient;
  //context.fillRect(15,160,130,10);
  context.beginPath();
  context.ellipse(80,165,65,5,0,0,Math.PI*2,false);
  context.fill();
  context.fillStyle = fillStyleOrg;

  context.font = '25px serif';
  context.textAlign = 'center';
  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + [255,204,0,1.0] + ')';
  context.fillText('★'.repeat(weapon["星"]),80,canvas.height-10)
  context.fillStyle = fillStyleOrg;

  context.font = '30px ' + font_common;
  context.textAlign = 'left';
  context.fillText(weapon["名前"],170,40)

  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + [0,0,0,0.5] + ')';
  context.fillRect(170,44,70,32); 
  context.fillStyle = fillStyleOrg;

  context.font = '23px ' + font_common;
  context.fillText(weapon["レベル"],170,70)

  context.font = '23px ' + font_common;
  context.fillText('基礎攻撃力 ' + weapon["基礎攻撃力"],180,110)
  var i=0;
  for ( key in weapon ) {
    if ( keyHash[key] ) continue;
    context.fillText(key + ' ' + weapon[key],180,145+i*35)
    i++;
  }
  return canvas;
}

function create_prop_canvas ( prop ) {
  messages.innerHTML += 'Creating fight properties card...<br>'
  let canvas = document.createElement('canvas');
  canvas.width  = 630;
  canvas.height = 600;
  canvas.style["width"]  = canvas.width;
  canvas.style["height"] = canvas.height;
  var context = canvas.getContext('2d');
  context.fillRoundRect = fillRoundRect;
  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + midground + ')';
  context.fillRoundRect(0,0,canvas.width, canvas.height, [10]);
  context.fillStyle = fillStyleOrg;
  context.fillStyle = 'rgba(' + forground + ')';

  var interval = (canvas.height - 25 * Object.keys(prop).length) / ( Object.keys(prop).length + 1) + 25;
  var i=1;
  for ( var key in prop ) {
    context.font = '25px ' + font_common;
    context.textAlign = 'left';
    context.fillText(key,80, interval*i )
    context.textAlign = 'right';
    context.fillText(prop[key].value,canvas.width-30, interval*i );
    if ( prop[key].base && prop[key].additional ) {
      var fillStyleOrg = context.fillStyle;
      context.fillStyle = 'rgba(' + forground + ')';
      context.font = '15px ' + font_common;
      context.fillText(prop[key].base + '+' + prop[key].additional,canvas.width-30, interval*i+20 );
      context.fillStyle = 'rgba(' + [108,223,154,1.0]+ ')';
      context.fillText('+' + prop[key].additional,canvas.width-30, interval*i+20 );
      context.fillStyle = fillStyleOrg;
    }
    i++;
  }
  return canvas;
}

var cache = {};
//TODO setItem occared exceeded the quota.
async function getImageFromURL ( url ) {
  messages.innerHTML += 'Loading ' + url + '...<br>';
  //var date = localStorage.getItem('date');
  var date = cache['date'];
  var current = new Date().getTime();
  var spend = current - (date?date:0);
  //var src  = localStorage.getItem(url);
  var src  = cache[url];
  if ( src && ( spend < 3600000 )) {
    return __getImageFromURL(src);
  }
  //localStorage.setItem('date',current);
  cache['date'] = current;
  var img = await __getImageFromURL ( url );
  var canvas = document.createElement('canvas');
  canvas.width  = img.width;
  canvas.height = img.height;
  var context = canvas.getContext('2d');
  context.drawImage(img,0,0);
  //localStorage.setItem(url,canvas.toDataURL());
  cache[url] = canvas.toDataURL();
  return img;
}

// no cache function
function __getImageFromURL ( url ) {
  return new Promise ( ( resolve, reject ) => {
    const image = new Image();
    image.onload  = () => resolve(image);
    image.onerror = (e) => reject(e);
    image.src = url;
    image.crossOrigin = 'anonymous';
  })
  .catch ( () => {
    console.log( 'Failed to load ' + url );
    return new Image();
  });
}

async function create_character_canvas(charName) {
  messages.innerHTML += 'Creating character card of ' + charName + '...<br>';
  let canvas = document.createElement('canvas');
  canvas.width  = 750;
  canvas.height = 640;
  canvas.style["width"]  = canvas.width;
  canvas.style["height"] = canvas.height;
  var context = canvas.getContext('2d');

  var character = characters[charNameHash[charName]];

  // load images
  let img = [];
  for ( var i=0; i<3; i++ ) {
    img.push(getImageFromURL( 'https://enka.network/ui/' + character.Skills[character.SkillOrder[i]] + '.png' ) );
  }
  // TODO How can I get character URL ?
  img.push(getImageFromURL(build_card[charName].iconURL)); 
  for ( i=0; i<6; ++i ) {
    img.push(getImageFromURL( 'https://enka.network/ui/' + character.Consts[i] + '.png' ) );
  }
  img = await await Promise.all( img );

  var r = Math.min(img[3].width/canvas.width, img[3].height/canvas.height);
  context.drawImage(img[3], (img[3].width-r*canvas.width)/2, (img[3].height-r*canvas.height)/2, r*canvas.width, r*canvas.height, 0, 0, canvas.width, canvas.height);
  const gradient = context.createRadialGradient(0,-200,0,0,-200,1000);
  gradient.addColorStop(0.0, 'rgba(' + [0,0,0,1.0] + ')');
  gradient.addColorStop(0.20, 'rgba(' + [0,0,0,1.0] + ')');
  gradient.addColorStop(0.5, 'rgba(' + [0,0,0,0.0] + ')');
  gradient.addColorStop(1.0, 'rgba(' + [0,0,0,0.0] + ')');
  context.fillStyle = gradient;
  context.beginPath();
  context.fillRect(0,0,canvas.width, canvas.height);
  context.fill();

  context.fillStyle = 'rgba(' + forground + ')';
  context.font = '50px ' + font_common;
  context.fillText(charName,30,70)
  context.font = '25px ' + font_common;
  context.fillText(build_card[charName]["レベル"],30,105)
  context.fillText("好感度" + build_card[charName]["好感度"],105,105)

  context.textAlign = 'center';
  var kindlist = ["通常", "スキル", "爆発"];
  for ( var i=0; i<3; i++ ) {
    var fillStyleOrg = context.fillStyle;
    context.fillStyle = 'rgba(' + [0,0,0,1.0] + ')';
    context.beginPath();
    context.arc(55,375+105*i,34,0,Math.PI*2,false);
    context.fill();
    context.fillStyle = fillStyleOrg;
    context.drawImage(img[i],30,350+105*i,50,50);
    context.font = '20px bold ' + font_common;
    var fillStyleOrg = context.fillStyle;
    var skillLevel = build_card[charName]["天賦"][kindlist[i]].base
                   + build_card[charName]["天賦"][kindlist[i]].extra;
    if ( build_card[charName]["天賦"][kindlist[i]].base == 10 ) context.fillStyle = 'rgba(' + [37,241,248,1.0] + ')';
    context.fillText('Lv.' + skillLevel,55,415+105*i)
    context.fillStyle = fillStyleOrg;
  }
  context.textAlign = 'center';

  var ec = elementColor[build_card[charName]["元素"]];
  var strokeStyleOrg = context.strokeStyle;
  var lineWidthOrg = context.lineWidth;
  context.strokeStyle = 'rgba(' + ec + ')';
  context.lineWidth = '8';
  for ( i=0; i<build_card[charName]["凸"]; ++i ) {
    context.beginPath();
    context.arc(canvas.width-35,140+90*i,30,0,Math.PI*2,false);
    //context.fill();
    context.stroke();
  }
  context.strokeStyle = strokeStyleOrg;
  context.lineWidth = lineWidthOrg;

  for ( i=0; i<6; ++i ) {
    context.drawImage(img[i+4],canvas.width-65,110+90*i,60,60);
  }

  var fillStyleOrg = context.fillStyle;
  var strokeStyleOrg = context.strokeStyle;
  var lineWidthOrg = context.lineWidth;
  context.strokeStyle = 'rgba(' + [80,102,112,1.0] + ')';
  context.lineWidth = '8';
  context.font = 'bold 60px sans-serif';
  context.textAlign = 'center';
  for ( i=build_card[charName]["凸"]; i<6; ++i ) {
    context.fillStyle = 'rgba(' + [0,0,0,0.3] + ')';
    context.beginPath();
    context.arc(canvas.width-35,140+90*i,30,0,Math.PI*2,false);
    context.fill();
    context.stroke();
    context.fillStyle = 'rgba(' + [255,255,255,1.0] + ')';
    context.fillText("×" ,canvas.width-35,165+90*i);
  }
  context.textAlign = 'left';
  context.fillStyle = fillStyleOrg;
  context.strokeStyle = strokeStyleOrg;
  context.lineWidth = lineWidthOrg;

  return canvas;
}

function create_artifactset_canvas ( artifactSet ) {
  messages.innerHTML += 'Creating artifact set card...<br>';
  let canvas = document.createElement('canvas');
  canvas.width  = 465;
  canvas.height = 110;
  canvas.style["width"]  = canvas.width;
  canvas.style["height"] = canvas.height;
  var context = canvas.getContext('2d');
  context.fillRoundRect = fillRoundRect;
  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + midground + ')';
  context.fillRoundRect(0,0,canvas.width, canvas.height, [10]);
  context.fillStyle = fillStyleOrg;
  context.fillStyle = 'rgba(' + forground + ')';

  var set = {};
  for ( var key in artifactSet ) {
    if ( (artifactSet[key]-0) >= 2 ) {
      set[key] = artifactSet[key];
    }
  }
  var interval = (canvas.height - 25 * Object.keys(set).length) / ( Object.keys(set).length + 1) + 25;
  context.font = '25px ' + font_common;
  var i=1;
  for ( var key in set ) {
    var fillStyleOrg = context.fillStyle;
    context.fillStyle = 'rgba(' + [9,253,0,1.0] + ')';
    context.textAlign = 'left';
    context.fillText(key,110, interval*i )
    context.fillStyle = 'rgba(' + [0,0,0,0.5] + ')';
    context.fillRect(canvas.width-60,interval*i-24,50,27); 
    context.fillStyle = fillStyleOrg;
    context.textAlign = 'right';
    context.fillText(set[key],canvas.width-30, interval*i )
    i++;
  }
  return canvas;
}

function create_totalScore_canvas ( totalScore , calcBy) {
  messages.innerHTML += 'Creating total score...<br>';
  let canvas = document.createElement('canvas');
  canvas.width  = 465;
  canvas.height = 290;
  canvas.style["width"]  = canvas.width;
  canvas.style["height"] = canvas.height;
  var context = canvas.getContext('2d');
  context.fillRoundRect = fillRoundRect;
  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + [255,255,255,0.2] + ')';
  context.fillRoundRect(0,0,canvas.width, canvas.height-55, [10,0,0,10]);
  context.fillStyle = fillStyleOrg;
  context.fillStyle = 'rgba(' + forground + ')';

  context.font = '40px ' + font_common;
  context.textAlign = 'left';
  context.fillText("総合スコア",10,40)
  context.font = '70px ' + font_common;
  context.textAlign = 'center';
  context.fillText(totalScore[calcBy],canvas.width/2,(canvas.height-55)/2+35);

  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + midground + ')';
  context.fillRoundRect(0,canvas.height-55,canvas.width, 55, [0,10,10,0]);
  context.fillStyle = fillStyleOrg;

  context.font = '30px ' + font_common;
  context.textAlign = 'right';
  context.fillText(calcBy,canvas.width-15,canvas.height-15);

  context.textAlign = 'left';
  context.font = '10px ' + font_common;
  context.fillText("Powered by",30,200)
  context.font = '20px ' + font_common;
  context.fillText("Enka.Network",30,220)

  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + [77,199,200,1.0] + ')';
  context.font = '25px ' + font_common;
  context.fillText("Artifacter",15,270)
  context.fillStyle = fillStyleOrg;

  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + midground + ')';
  context.fillRoundRect(canvas.width-100,0,100,70, [0,10,0,10]);
  context.fillStyle = fillStyleOrg;

  context.textAlign = 'center';
  context.font = 'italic bold 50px ' + font_common;
  var fillStyleOrg = context.fillStyle;
  var strokeStyleOrg = context.strokeStyle;
  var lineWidthOrg = context.lineWidth;
  context.lineWidth = 2;
  for ( var tier of ["SS", "S", "A", "B" ] ) {
    if ( totalScore[calcBy] >= tierTable["total"][tier] ) {
      const gradient = context.createLinearGradient(0,0,0,290);
      gradient.addColorStop(0.0, 'rgba(' + [255,255,255,1.0] + ')');
      gradient.addColorStop(20/290, 'rgba(' + [255,255,255,1.0] + ')');
      gradient.addColorStop(40/290, 'rgba(' + tierColor[tier] + ')');
      gradient.addColorStop(55/290, 'rgba(' + [255,255,255,1.0] + ')');
      gradient.addColorStop(1.0, 'rgba(' + [255,255,255,1.0] + ')');
      context.fillStyle = gradient;
      context.strokeStyle = 'rgba(' + tierColor[tier] + ')';
      //context.fillStyle = 'rgba(' + tierColor[tier] + ')';
      context.fillText(tier, canvas.width-50, 55);
      break;
    }
  }
  context.fillStyle = fillStyleOrg;
  context.strokeStyle = strokeStyleOrg;
  context.lineWidth = lineWidthOrg;

  return canvas;
}

function getImageFromCanvas ( canvas ) {
  return new Promise ( ( resolve, reject ) => {
    const image = new Image();
    const context = canvas.getContext('2d');
    image.onload  = () => resolve(image);
    image.onerror = (e) => reject(e);
    image.src = context.canvas.toDataURL();
  });
}

async function create_build_card_canvas ( charName ) {
  messages.innerHTML += 'Creating build card of ' + charName + '...<br>';
  let canvas = document.createElement('canvas');
  canvas.id = charName;
  canvas.onclick = (e) => {
    let link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = charName + '.png';
    link.click();
  }
  canvas.width  = 1920;
  canvas.height = 1080;
  canvas.style["width"]  = canvas.width;
  canvas.style["height"] = canvas.height;
  var context = canvas.getContext('2d');
  context.fillRoundRect = fillRoundRect;
  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + background + ')';
  context.fillRoundRect(0,0,canvas.width, canvas.height, [10]);
  context.fillStyle = fillStyleOrg;

  var equipTypeList = ["花", "羽", "時計","杯","冠"] ;

  // load images
  let img = []; 
  img.push(getImageFromURL('https://enka.network/img/overlay.jpg')); // 0
  img.push(getImageFromURL('https://enka.network/svg/Shade.svg'));  // 1
  img.push(getImageFromCanvas(await create_character_canvas(charName))); //2
  img.push(getImageFromCanvas(create_prop_canvas(build_card[charName].prop))); // 3
  img.push(getImageFromCanvas(await create_weapon_canvas(build_card[charName]["武器"]))); //4
  img.push(getImageFromCanvas(create_artifactset_canvas(build_card[charName]["セット効果"]))); //5
  img.push(getImageFromCanvas(create_totalScore_canvas(build_card[charName].totalScore,calcByHash[charName]))); //6
  for ( var i=0; i<equipTypeList.length; ++i ) {
    img.push(getImageFromCanvas(await create_single_artifact_canvas(build_card[charName][equipTypeList[i]],calcByHash[charName]))); // 7 - 11
  }
  img = await Promise.all( img );

  var r = Math.min(img[0].width/canvas.width, img[0].height/canvas.height);
  context.drawImage(img[0], (img[0].width-r*canvas.width)/2, (img[0].height-r*canvas.height)/2, r*canvas.width, r*canvas.height, 0, 0, canvas.width, canvas.height);


  var ec = elementColor[build_card[charName]["元素"]];
  context.fillStyle = 'rgba(' + ( (ec) ? (ec) : [255,255,255,0.5]) + ')';
  context.fillRoundRect(0,0,canvas.width, canvas.height, [10]);
  context.fillStyle = fillStyleOrg;

  var r = Math.min(img[1].width/canvas.width, img[1].height/canvas.height);
  context.drawImage(img[1], 0, 0, img[1].width * canvas.height / img[1].height, canvas.height);

  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + [255,255,255,0.15] + ')';
  context.fillRect(0,0,canvas.width, canvas.height);
  context.fillStyle = fillStyleOrg;

  context.fillStyle = 'rgba(' + forground + ')';

  context.drawImage(img[2],0,0);
  context.drawImage(img[3],760,30);
  context.drawImage(img[4],1420,30);
  context.drawImage(img[5],1420,220);
  context.drawImage(img[6],1420,340);
  var interval = ( canvas.width - 360 * equipTypeList.length -70 ) / ( equipTypeList.length - 1 ) + 360;
  for ( var i=0; i<equipTypeList.length; ++i ) {
    context.drawImage(img[7+i],30+interval*i,645);
  }
  return canvas;
}

//let uid = '851415193';
function onload_function () {
  messages = document.getElementById('messages');
  load_store_json('loc.json');
  load_store_json('characters.json');
  load_store_json('affixes.json');
  if ( _GET['font'] ) font_common = _GET['font'];
  console.log(font_common);
  if ( !_GET['uid'] ) {
    _GET['uid'] = window.prompt('UID',"")
    get2url ();
  }
  if ( _GET['uid'] ) {
    document.getElementById('uid').value = _GET['uid'];
    load_data(_GET['uid']);
  }
}

