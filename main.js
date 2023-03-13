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
  //var url = './testdata/851415193.json';
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
  //var url = './testdata/' + fname;
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
async function parse_data ( data ) {
  let lang = 'ja';
  if ( !(store_json['characters.json'] && store_json['loc.json']) ) {
    if ( --timeout_counter !== 0 ) setTimeout(parse_data,timeout_ms,data);
    return;
  }
  let characters = store_json['characters.json'];
  let loc = store_json['loc.json'];
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
    //   parse skillMap
    build_card[charName]["天賦"] = {};
    build_card[charName]["天賦"]["通常"]   = 'Lv.' + avatarInfo.skillLevelMap[characters[id].SkillOrder[0]];
    build_card[charName]["天賦"]["スキル"] = 'Lv.' + avatarInfo.skillLevelMap[characters[id].SkillOrder[1]];
    build_card[charName]["天賦"]["爆発"]   = 'Lv.' + avatarInfo.skillLevelMap[characters[id].SkillOrder[2]];
    //   TODO parse Prop
    build_card[charName]["レベル"] = 'Lv.' + avatarInfo.propMap[4001].val;
    build_card[charName]["好感度"] = avatarInfo.fetterInfo.expLevel;
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
        var propval  = mainop.statValue + units[mainop.mainPropId];
        build_card[charName][typeName]["メイン"] = [ propname , propval ];
        for ( var subop of equip.flat['reliquarySubstats'] ) {
          var propname = loc_appendix[lang][subop.appendPropId];
          var propval  = subop.statValue + units[subop.appendPropId];
          build_card[charName][typeName]["サブ"].push( [ propname , propval ] );
          switch ( subop.appendPropId ) {
            case 'FIGHT_PROP_ATTACK_PERCENT' : score += subop.statValue;   break;
            case 'FIGHT_PROP_CRITICAL'       : score += subop.statValue*2; break;
            case 'FIGHT_PROP_CRITICAL_HURT'  : score += subop.statValue;   break;
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
          "レベル" : 'Lv.' + equip.weapon.level,
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
    var cvs = await create_build_card_canvas(key);
    document.getElementById('main').appendChild(cvs);
    document.getElementById('main').appendChild(document.createElement('hr'));
  }
}

function fillRoundRect(x, y, w, h, r) {
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.arc(x + w - r, y + r, r, Math.PI * (3/2), 0, false);
    this.lineTo(x + w, y + h - r);
    this.arc(x + w - r, y + h - r, r, 0, Math.PI * (1/2), false);
    this.lineTo(x + r, y + h);       
    this.arc(x + r, y + h - r, r, Math.PI * (1/2), Math.PI, false);
    this.lineTo(x, y + r);
    this.arc(x + r, y + r, r, Math.PI, Math.PI * (3/2), false);
    this.closePath();
    this.fill();
}

function create_single_artifact_canvas ( artifacts ) {
  let canvas = document.createElement('canvas');
  canvas.width  = 360;
  canvas.height = 415;
  canvas.style["width"]  = canvas.width;
  canvas.style["height"] = canvas.height;
  var context = canvas.getContext('2d');
  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + [ 0, 0, 0, 0.1] + ')';
  context.fillRoundRect = fillRoundRect;
  context.fillRoundRect(0,0,canvas.width, canvas.height, 10);
  context.fillStyle = fillStyleOrg;

  context.font = '100px serif';
  context.textAlign = 'left';
  context.fillText(artifacts["部位"],0,100)
  context.font = '16px serif';
  context.fillText(artifacts["名前"],0,130)

  context.font = '30px serif';
  context.textAlign = 'right';
  context.fillText(artifacts["メイン"][0],canvas.width-15,45);
  context.font = '40px serif';
  context.fillText(artifacts["メイン"][1],canvas.width-15,85);

  context.font = '25px serif';
  for ( var i=0; i< artifacts["サブ"].length; ++i )  {
    var sub = artifacts["サブ"][i];
    context.textAlign = 'left';
    context.fillText(sub[0],50,195+50*i);
    context.textAlign = 'right';
    context.fillText(sub[1],canvas.width-15,195+50*i);
  }

  context.font = '25px serif';
  context.textAlign = 'right';
  context.fillText('Score', canvas.width-90, canvas.height-10);
  context.font = '35px serif';
  context.fillText(artifacts["Score"], canvas.width-15, canvas.height-10);

  return canvas;
}

function create_weapon_canvas ( weapon ) {
  const keyHash = { "名前" : true, "レベル": true, "精錬ランク": true, "基礎攻撃力" : true, };
  let canvas = document.createElement('canvas');
  canvas.width  = 465;
  canvas.height = 180;
  canvas.style["width"]  = canvas.width;
  canvas.style["height"] = canvas.height;
  var context = canvas.getContext('2d');
  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + [ 0, 0, 0, 0.1] + ')';
  context.fillRoundRect = fillRoundRect;
  context.fillRoundRect(0,0,canvas.width, canvas.height, 10);
  context.fillStyle = fillStyleOrg;

  context.font = '25px serif';
  context.fillText('精錬ランク' + weapon["精錬ランク"],10,35)

  context.font = '30px serif';
  context.textAlign = 'left';
  context.fillText(weapon["名前"],160,50)
  context.fillText(weapon["レベル"],160,80)

  context.font = '25px serif';
  context.fillText('基礎攻撃力 ' + weapon["基礎攻撃力"],200,110)
  var i=0;
  for ( key in weapon ) {
    if ( keyHash[key] ) continue;
    context.fillText(key + ' ' + weapon[key],200,135+i*25)
    i++;
  }
  return canvas;
}

function create_prop_canvas ( prop ) {
  let canvas = document.createElement('canvas');
  canvas.width  = 630;
  canvas.height = 600;
  canvas.style["width"]  = canvas.width;
  canvas.style["height"] = canvas.height;
  var context = canvas.getContext('2d');
  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + [ 0, 0, 0, 0.1] + ')';
  context.fillRoundRect = fillRoundRect;
  context.fillRoundRect(0,0,canvas.width, canvas.height, 10);
  context.fillStyle = fillStyleOrg;

  var interval = (canvas.height - 25 * Object.keys(prop).length) / ( Object.keys(prop).length + 1) + 25;
  context.font = '25px serif';
  var i=1;
  for ( var key in prop ) {
    context.textAlign = 'left';
    context.fillText(key,80, interval*i )
    context.textAlign = 'right';
    context.fillText(prop[key],canvas.width-30, interval*i )
    i++;
  }
  return canvas;
}

function create_character_canvas(charName) {
  let canvas = document.createElement('canvas');
  canvas.width  = 750;
  canvas.height = 640;
  canvas.style["width"]  = canvas.width;
  canvas.style["height"] = canvas.height;
  var context = canvas.getContext('2d');
  context.font = '50px serif';
  context.fillText(charName,30,70)
  context.font = '25px serif';
  context.fillText(build_card[charName]["レベル"],30,105)
  context.fillText("好感度" + build_card[charName]["好感度"],105,105)

  context.font = '25px serif';
  context.fillText("通常",30,400)
  context.font = '20px serif';
  context.fillText(build_card[charName]["天賦"]["通常"],30,425)

  context.font = '25px serif';
  context.fillText("スキル",30,500)
  context.font = '20px serif';
  context.fillText(build_card[charName]["天賦"]["スキル"],30,525)

  context.font = '25px serif';
  context.fillText("爆発",30,600)
  context.font = '20px serif';
  context.fillText(build_card[charName]["天賦"]["爆発"],30,625)
  return canvas;
}

function create_artifactset_canvas ( artifactSet ) {
  let canvas = document.createElement('canvas');
  canvas.width  = 465;
  canvas.height = 110;
  canvas.style["width"]  = canvas.width;
  canvas.style["height"] = canvas.height;
  var context = canvas.getContext('2d');
  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + [ 0, 0, 0, 0.1] + ')';
  context.fillRoundRect = fillRoundRect;
  context.fillRoundRect(0,0,canvas.width, canvas.height, 10);
  context.fillStyle = fillStyleOrg;

  var set = {};
  for ( var key in artifactSet ) {
    if ( (artifactSet[key]-0) >= 2 ) {
      set[key] = artifactSet[key];
    }
  }
  var interval = (canvas.height - 25 * Object.keys(set).length) / ( Object.keys(set).length + 1) + 25;
  context.font = '25px serif';
  var i=1;
  for ( var key in set ) {
    context.textAlign = 'left';
    context.fillText(key,110, interval*i )
    context.textAlign = 'right';
    context.fillText(set[key],canvas.width-30, interval*i )
    i++;
  }
  return canvas;
}

function create_totalScore_canvas ( totalScore ) {
  let canvas = document.createElement('canvas');
  canvas.width  = 465;
  canvas.height = 290;
  canvas.style["width"]  = canvas.width;
  canvas.style["height"] = canvas.height;
  var context = canvas.getContext('2d');
  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + [ 0, 0, 0, 0.1] + ')';
  context.fillRoundRect = fillRoundRect;
  context.fillRoundRect(0,0,canvas.width, canvas.height, 10);
  context.fillStyle = fillStyleOrg;

  context.font = '40px serif';
  context.textAlign = 'left';
  context.fillText("総合スコア",10,40)
  context.font = '70px serif';
  context.textAlign = 'center';
  context.fillText(totalScore,canvas.width/2,canvas.height/2+35);
  context.font = '30px serif';
  context.textAlign = 'right';
  context.fillText('攻撃換算',canvas.width-15,canvas.height-15);
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
  var fillStyleOrg = context.fillStyle;
  context.fillStyle = 'rgba(' + [ 228, 228, 255, 1] + ')';
  context.fillRoundRect = fillRoundRect;
  context.fillRoundRect(0,0,canvas.width, canvas.height, 10);
  context.fillStyle = fillStyleOrg;

  var img = await getImageFromCanvas(create_character_canvas(charName));
  context.drawImage(img,0,0);
  var img = await getImageFromCanvas(create_prop_canvas(build_card[charName].prop));
  context.drawImage(img,760,30);
  var img = await getImageFromCanvas(create_weapon_canvas(build_card[charName]["武器"]));
  context.drawImage(img,1420,30);
  var img = await getImageFromCanvas(create_artifactset_canvas(build_card[charName]["セット効果"]));
  context.drawImage(img,1420,220);
  var img = await getImageFromCanvas(create_totalScore_canvas(build_card[charName].totalScore));
  context.drawImage(img,1420,340);
  var equipTypeList = ["花", "羽", "時計","杯","冠"] ;
  var interval = ( canvas.width - 360 * equipTypeList.length -70 ) / ( equipTypeList.length - 1 ) + 360;
  for ( var i=0; i<equipTypeList.length; ++i ) {
    var img = await getImageFromCanvas(create_single_artifact_canvas(build_card[charName][equipTypeList[i]]));
    context.drawImage(img,30+interval*i,645);
  }
  return canvas;
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



