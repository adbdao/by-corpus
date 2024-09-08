// 筆錄檔，最好只作2層資料夾：一個主資料夾「本因法師講戒筆錄」，裡面放一個個的子資料夾「菩薩戒」「沙彌戒」…。子資料夾裡面，就不要再放資料夾了，雖然依然能轉換出筆錄檔內容，但子資料夾的名稱無法對應到內容，會跑到最前面，需要人工處理！

// 導入模組
var fs = require('fs')
var path = require('path')
// 可改寫副檔名及編碼
var x = '.srt'
var ru = 'utf16le'
var wu = 'utf16le'
// 完成後的副檔名
var afterName = ''
// 裝載運算結果的物件
var okfile = ''
var z
// XML的檔頭宣告
// 檔頭需要一個「﻿」字元，Accelon3的indexer.exe才可以讀取，不知何因？
var head = '﻿<檔 n="by.xml">\n<集 c="hidden" l="序,分,跋,會,其他,附文,經,other,xu,科判,卷,冊,編,書,章,節,類,篇,項,文,年,詩,著者,詞,人名,問,答,字,頁碼,偏右字,小字,原出處,參考書,期,編目資訊,原書分頁,相應部,藥,方,症,品,細,部畫,本文,標,頁,作者,專欄,問答,部,講,作,史,典,編輯,版本,英標,副標,英,X,圖片,拼音,斜英,面,版,表,大,日期,名,_名,甲,乙,丙,丁,戊,己,庚,辛,壬,癸,子,丑,寅,卯,辰,巳,午,未,申,酉,戌,亥,天,地,玄,黃,宇,宙,洪,荒,日,月,盈,昃,晨,宿,列,張,寒,來,暑,往,秋,收,冬,藏,閏,餘,成,歲,律,呂,調,陽,雲,騰,致,雨,露,結,為,霜,金,生,麗,水,玉,出,崑,崗,劍,號,巨,闕,珠,稱,夜,光,果,珍,李,柰,菜,重,芥,薑,海,鹹,河,淡,鱗,潛,羽,翔,龍,師,火,帝,鳥,官,人,皇,始,制,文,字,乃,服,衣,裳,推,位,讓,國,有,虞,陶,唐.">本因法師講戒筆錄</集>\n<頁 id="00"/>\n<英文名></英文名>\n\n<隱><樹 s="*" t="書,章,節,類,項,文,篇.">樹狀目錄</樹></隱>\n<隱><樹 s="*書">分書頻次檢索</樹></隱>\n<隱><樹 s="$書">書名檢索</樹></隱>\n<隱><樹 s="*" t="書,問.">問答</樹></隱>\n<隱><樹 s="~00602000">西文英文梵文或巴利</樹></隱>\n<隱><樹 t="嵌圖">嵌圖</樹></隱>\n<隱><引>《$集;\\$書;\\$章;》：「$_;」</引><摘要頭>$書;\\$章;</摘要頭></隱><參考資料 n="ency,yinshun,taixu,newest article,vinaya2np,vinaya2,ts lin,ShinMing,yugasidi,yugasidi1,wiki,verse,TXJW,ttctk,thonzu-s,thonzu,Sutanta,sila,panna,paauk,osed,lt,library,lbss,kt,gaya,dic4v33np,dic4v33,dic5v33,dic-china,color,cbeta2011,age,lbm,gh,ght,aodbs,土觀宗派源流(轉為繁體),卡耐基口才學,印度佛教史(上冊)(平川彰著),和尚與哲學家_佛教與西方思想的對話,松下幸之助用人之道,法音叢書,空海大師傳,空海大師傳(轉為繁體),達摩易筋經,藏傳佛教概說(洛本仁波切),ziyu,pcd,滅苦之道,朱邦復文選,中藥小常識,minlun,chm,尊者阿迦曼傳,念住呼吸,法苑談叢,史念原始佛法,禪話禪畫,中國佛教,土觀宗派源流,弘法大師——空海,五明佛學院淨土,combdict,中華佛學學報,中華佛學研究,藏族英雄格薩爾大王,當代南傳佛教大師,TextProV6使用說明,瑜伽師地論(福嚴授課講義),攝阿毗達摩義論,清淨道論及涅槃的北二高,大史—斯里蘭卡佛教史,菩提道次第書畾,道證法師全集,南傳課誦本性恩編,bhd,cpi,ced,scdt,scd,other,上座部現代譯著,水野弘元著作選集,漢藏佛法百科光碟第二版文摘,戒律書畾,劉墉文選,tzuchi_monthly,taisho,wxzj,yulinpo,miuking,tibetan,ebst,rdg2011"/>\n'

// 建立函數，以便回呼使用
function XmlAddMypb(go) {
    // 規範化檔案路徑
    var h = path.normalize(go)
    // 取得本檔檔名，以本檔檔名作參數，在當前目錄下：若有相同名的副檔名的檔案，就進行轉換
    // 取得當前目錄下所有檔案及資料夾
    var d = fs.readdirSync(h)
    // 循環目錄
    for (var k of d) {
        // 取得絕對路徑，並規範化路徑
        var n = path.normalize(h + '/' + k)
        // 取得檔案資訊
        var c = fs.statSync(n)
        // 判斷是否為資料夾，如果是：回呼函數，來執行下一層目錄
        // 跳過.git && .vscode ，還有其它多餘的目錄
        if (c.isDirectory() && n != '.git' && n != '.vscode' && n != 'node_modules' && n != 'ksana-corpus-lib' && n != '檔案完成') {
            // 加上書目、類別，以資料夾名稱當作書目、類別
            okfile += '\n\n<書>' + k + '</書>'
            // 若只執行當前目錄，則註釋此行，並啟動返回通知
            XmlAddMypb(n)
            // console.log('Stop read Directory:' + n)

            // 判斷是否為所要轉換的副檔名的檔案
        } else if (path.extname(n) == x) {
            // 用絕對路徑讀入檔案，使用node的readFileSync同步函數
            // 先處理一些內文
            var a = fs.readFileSync(n, ru).replace(/ --> /g, '').replace(/\d:|,\d/g, '').replace(/<\/?.>/g, '').replace(/\r/g, '').replace(/﻿/g, '')
            // 導入陣列
            var b = a.split('\n')
            var c = []
            for (var i = 0; i < b.length; i++) {
                b[i] = b[i].replace(/^\d+ $/g, '')
                // 截取有筆錄的行
                if (/\W/.test(b[i])) {
                    c.push(b[i])
                }
            }
            // 導入物件內
            // 加入Accelon3的樹狀目錄的章節標記
            okfile += '\n<章>' + k.replace('.srt', '') + '</章>\n' + c.join('\n')

            // 完成時返回通知
            console.log('by is OK: ' + n + afterName)
        }
    }

    // ===============================================
    // 轉換成Accelon2017的.cor
    // 因為整合寫入一個檔內，所以等全部寫入後再上頁碼
    z = okfile.split('\n')
    // 加上批次冊碼頁碼
    // 預設變量，才能累加冊碼頁碼
    var s0 = 0
    var s1 = 0
    var s2 = 1
    var sfn = 1
    var sa = 1

    // 先轉換Accelon3的標記
    for (var i = 0; i < z.length; i++) {
        z[i] = z[i].replace(/<書/g, '<article')
            .replace(/書>/g, 'article>')
            .replace(/章>/g, 'h1>')
            .replace(/節>/g, 'h2>')
            .replace(/類>/g, 'h3>')
            .replace(/項>/g, 'h4>')
            .replace(/文>/g, 'h5>')
            .replace(/篇>/g, 'h6>')
            .replace(/《/g, '<bf>《')
            .replace(/》/g, '》</bf>')
            .replace(/〈/g, '<by>〈')
            .replace(/〉/g, '〉</by>')
            .replace(/〔/g, '<bz>〔')
            .replace(/〕/g, '〕</bz>')
    }

    // 再轉換頁碼
    // 第1行不好轉換，會出現亂碼，所以從第2行開始
    for (var i = 1; i < z.length; i++) {
        // 刪除行首空白
        // z[i] = z[i].replace(/^ +/g, '')
        // 加上冊碼頁碼
        // 多個檔案的時候，不好算出冊碼，就省去冊碼
        if (/<article/.test(z[i]) || i == 1 || s2 > 1023) {
            s2 = 1
            // s1++
            // z[i] = '<pb n="' + s1 + '.' + s2 + '"/>\n' + z[i]
            z[i] = '<pb n="' + s2 + '"/>\n' + z[i]
            s0 = i + 30
        }
        if (i == s0) {
            s2++
            // z[i] = '<pb n="' + s1 + '.' + s2 + '"/>\n' + z[i]
            z[i] = '<pb n="' + s2 + '"/>\n' + z[i]
            s0 = i + 30
        }
    }
    // 記得修訂多餘的<pb n="1"/>，以及超過"1024"的，要補上<article>
}

// 配合timeEnd()成對出現。 打印出代碼執行的時間
console.time('共耗費了')

// 啟用函數
XmlAddMypb('./')
// 用絕對路徑寫入檔案
// 為了Accelon3的檔末呈現的問題，所以檔末多加幾個\n
fs.writeFileSync('./檔案完成/by.xml', head + okfile + '\n\n\n\n</檔>', wu)
// 另存一個純文字檔
fs.writeFileSync('./檔案完成/本因法師講戒筆錄(全部).txt', '﻿《本因法師講戒筆錄(全部)》' + okfile.replace(/<[^>]+>/g, ''), wu)
// 為了新手可能不熟悉Accelon3的indexer.exe，所以順便產生lst檔，讓新手開啟indexer.exe時，就可以轉換xml。
fs.writeFileSync('./檔案完成/by.lst', '﻿by.xml', wu)
// 完成時返回通知
console.log('by.lst is OK')
console.log('by.bat is OK 轉換完成。請開啟：indexer.exe  進行Accelon3的轉換')

// 轉換成Accelon2017的.cor
fs.writeFileSync('by.txt', '<file>\n' + z.join('\n') + '\n</file>', 'utf8')
console.log('by.txt for Accelon2017 is OK')

// timeEnd()小括號中的名字要和time()中的名字保持一致
console.timeEnd('共耗費了')