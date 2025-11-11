'use strict';

window.addEventListener('load', function() {
    const password = prompt("パスワードを入力してください。\nパスワードはポートフォリオサイトのこのページのリンク下にあります。\n※既存のゲームのため、ポートフォリオを確認される方以外、利用できないようにしています。");

    // 正しいパスワードを設定
    const correctPassword = "cca4a";

    if (password === correctPassword) {
        alert("認証成功！");
        // パスワードが合っていたらページを表示
        document.body.style.display = 'block';
    } else {
        alert("パスワードが違います。");
        // 間違っていたらページを隠す or 別ページへ移動
        document.body.innerHTML = "<h2>ポートフォリオページから正しいパスワードを確認してください</h2>";
    }
});


// 必要な宣言====================
let allCard = []; //全カードが入った配列
let dealArray; //カード配る用 createCard()の後にコピーしたものを代入
let player1Hand = []; //プレイヤーの手札
let player2Hand = [];
let player3Hand = [];
let player4Hand = [];
let player5Hand = [];
let lineA; //カード（img）挿入用
let lineB;
let lineC;
let lineD;
let linePutCardAll = {lineA: [], lineB: [], lineC: [], lineD: []};
let nowLineUp = {A: [], B: [], C: [], D: []}; //場に置かれたカード確認用
let playerPutField;
function reGetLine() {
    lineA = ``;
    lineB = ``;
    lineC = ``;
    lineD = ``;
    let lineGetA = document.querySelectorAll('#lineA li'); //カードを置く行のliタグを取得
    let lineGetB = document.querySelectorAll('#lineB li');
    let lineGetC = document.querySelectorAll('#lineC li');
    let lineGetD = document.querySelectorAll('#lineD li');
    lineA = Array.from(lineGetA); //配列に変換して行の変数に代入
    lineB = Array.from(lineGetB);
    lineC = Array.from(lineGetC);
    lineD = Array.from(lineGetD);
    //---lineをオブジェクトにする
    linePutCardAll.lineA = lineA;
    linePutCardAll.lineB = lineB;
    linePutCardAll.lineC = lineC;
    linePutCardAll.lineD = lineD;
    //---
    let putField = document.querySelectorAll('.choiceCard');
    playerPutField = Array.from(putField);
}
window.addEventListener('DOMContentLoaded', function() {
    reGetLine();
});
let openCard = []; //出されたカードを収納する変数
let playTurn = true; //手札操作を許可されているかどうか
let pickUpCard; //処理の中で今選択されているカード
let targetLine = '';
let nextProcess = '';
let turn = 1;
let playerPoints = [];
let lineDamageAll = [];

const messageWindow = document.querySelector('.messageWindow');
const messageEl = document.getElementById('message');

function pointsConfirm() {
    playerPoints = [
        document.getElementById('player1Point').textContent,
        document.getElementById('player2Point').textContent,
        document.getElementById('player3Point').textContent,
        document.getElementById('player4Point').textContent,
        document.getElementById('player5Point').textContent
    ];
}

// ====================
// デバッグ用ボタン====================
// function debugButton(buttonId) {
//     return new Promise(resolve => {
//         document.getElementById(buttonId).addEventListener('click', () => {
//             resolve();
//         }, { once: true });
//     });
// }


// ====================
// ラウンド進行時のリセット====================
function roundReset() {
    console.log('ラウンドリセットを行います');
    dealArray = [...allCard];
    player1Hand = [];
    player2Hand = [];
    player3Hand = [];
    player4Hand = [];
    player5Hand = [];
    lineA = '';
    lineB = '';
    lineC = '';
    lineD = '';
    linePutCardAll = {lineA: [], lineB: [], lineC: [], lineD: []};
    nowLineUp = {A: [], B: [], C: [], D: []};
    playerPutField = '';
    openCard = [];
    playTurn = true;//これはどうするべきか？
    pickUpCard = '';
    targetLine = '';
    nextProcess = '';
    turn = 1;

    // li要素を削除して新たに追加
    // lineのliタグ削除
    ['A', 'B', 'C', 'D'].forEach(lineName => {
        let list = document.querySelectorAll(`#line${lineName} li`);
        list.forEach(el => el.remove());
    });
    // 追加
    ['A', 'B', 'C', 'D'].forEach(lineName => {
        let line = document.querySelector(`#line${lineName}`);
        for(let i = 0; i < 6; i++) {
            const newLi = document.createElement('li');
            line.appendChild(newLi);
        }
    });

    let lineGetA = document.querySelectorAll('#lineA li'); //カードを置く行のliタグを取得
    let lineGetB = document.querySelectorAll('#lineB li');
    let lineGetC = document.querySelectorAll('#lineC li');
    let lineGetD = document.querySelectorAll('#lineD li');
    lineA = Array.from(lineGetA); //配列に変換して行の変数に代入
    lineB = Array.from(lineGetB);
    lineC = Array.from(lineGetC);
    lineD = Array.from(lineGetD);

    // 手札の削除
    const handElements = document.querySelectorAll('.myHand ul li');
    handElements.forEach(el => el.remove());
}


// ====================
// 処理待機用====================
    //〇秒待つ
function waitProgram(time) {
    return new Promise((resolve, reject) => {
        // 例: 2秒後に完了
        setTimeout(() => {
            resolve(); // アクション完了
        }, time);
    });
}

    //!次の処理が許可されるまで待つ　デバッグ用？
// async function stopProgram() {
//     while(nextProcess !== 'yes') {
//         await wait(500);
//     }
// }






// ====================
// カードの配列を用意する====================
function createCard() {
    let i = 1;
    let k; //判定した失点数を代入する場所
    while(i <= 104) {
        let j = i % 10; //1桁目の数字を抽出
        let l = i.toString(); //文字列に変換
        if(i === 55) {
            k = 7;
        } else if(l.length >= 2 && l.split('').every(num => num === l[0])) { //2桁以上の時に、splitで1文字ずつ分離して配列に。配列メソッドのeveryで全ての要素が条件を満たせばtrueを返す（numが配列lのインデックス1と同じかどうか）
            k = 5;
        } else {
            switch(j) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 6:
                case 7:
                case 8:
                case 9:
                    k = 1;
                    break;
                case 5:
                    k = 2;
                    break;
                case 0:
                    k = 3;
                    break;
            }
        }
        allCard.push({number: i, point: k});
        i++;
    }
}
createCard();
dealArray = [...allCard];

// ====================
//* 引取り場所を選ぶための処理====================
async function choiceTakeLine(cardObj) {
    lineDamageCalc();
    if(cardObj.whoseCard !== 'player1') {
        choiceTakeLineNPC(cardObj);
    } else {
        nextProcess = 'no'; //配置処理のループを止める
        // メッセージを表示
        messageEl.textContent = '回収する列を選択してください';
        messageWindow.classList.add('show');

        // ボタン表示
        const selectBtn = document.querySelectorAll('.selectBtns button');
        const lineName = ['列A', '列B', '列C', '列D']
        selectBtn.forEach(function(btn, index) {
            btn.textContent = lineName[index] + '(-' + lineDamageAll[index] + ')';
        });

        const selectBtns = document.querySelector('.selectBtns');
        selectBtns.classList.add('show');
        async function waitForAnyButtonClick(buttonIds) { //ボタンが押されるまで処理を待機する
            return new Promise((resolve) => {
                function handleClick(event) {
                    // クリックイベントが起きたら全てのリスナーを解除
                    buttonIds.forEach(id => {
                        document.getElementById(id).removeEventListener('click', handleClick);
                    });
                    resolve(event.target.id); // 押されたボタンのIDを返す
                }

                buttonIds.forEach(id => {
                    const btn = document.getElementById(id);
                    if (btn) {
                        btn.addEventListener('click', handleClick);
                    }
                });
            });
        }

        async function main() {
            const clickedId = await waitForAnyButtonClick(['btnA', 'btnB', 'btnC', 'btnD']);
            let selectLine = '';
            switch(clickedId) {
                case 'btnA':
                    targetLine = 'lineA';
                    selectLine = lineA;
                    break;
                case 'btnB':
                    targetLine = 'lineB';
                    selectLine = lineB;
                    break;
                case 'btnC':
                    targetLine = 'lineC';
                    selectLine = lineC;
                    break;
                case 'btnD':
                    targetLine = 'lineD';
                    selectLine = lineD;
                    break;
            }
            putToLine(selectLine, cardObj, 'yes');/* takeLineするかどうかのyes */
        }
        await main();
        
        messageEl.textContent = '';
        selectBtns.classList.remove('show');
        messageWindow.classList.remove('show');
        nextProcess = 'yes'; //配置処理のループを再開
    }
}


// ====================
//* 行の引取り処理====================
function takeLine(receiveLine, receiveObj) {
    reGetLine();
    let checkCard = [];
    receiveLine.forEach(function(item) {
        if(item.children[0] !== undefined) {
            checkCard.push(item.children[0].id);
        }
    });
    let checkCardObj = [];
    checkCard.forEach(function(num) {
        checkCardObj.push(allCard[num - 1]);
    });
    // console.log(checkCardObj);
    let lostPt = 0;
    let i = 0;
    let k = checkCardObj.length - 1;
    while(i < k) {
        let j = checkCardObj[i];
        lostPt -= j['point'];
        i++;
    }
    //↑で引き取り枚数分ポイント処理をしたら、↓でまとめて枚数分列消して同じだけ列追加する
    let getTargetLine = document.querySelectorAll(`#${targetLine} li`);
    let targetArray = Array.from(getTargetLine);
    for(let i = 0; i < k; i++) {
        targetArray[i].remove();
        //ここで行の内部データも消去する
        linePutCardAll[targetLine].shift();
    }
    let parent = targetArray[k].parentElement;
    for(let i = 0; i < k; i++) {
        const newLi = document.createElement('li');
        parent.appendChild(newLi);
    }
    reGetLine();

    let damagePlayer = receiveObj['whoseCard'];
    let PlayerElement = document.getElementById(`${damagePlayer}Point`);
    let PlayerPoint = Number(PlayerElement.textContent);
    // console.log('現在の持ち点:' + PlayerPoint);
    PlayerElement.textContent = Number(PlayerPoint + lostPt); 
}

// ====================
// カードがどこに置かれるかの処理====================
    //現在の行に何が置かれているか確認してnowLineUpを更新
function nowLineUpConfirm(n) {//!
    nowLineUp[n] = [];
    let el = document.querySelectorAll(`#line${n} li img`);
    let elArray = Array.from(el);
    elArray.forEach(function(i) {
        nowLineUp[n].push(Number(i.id));
        // console.log('行に置かれているカード：' + nowLineUp[n]);
    });
}

function nowLineUpConfirm4time() {
    nowLineUpConfirm('A');
    nowLineUpConfirm('B');
    nowLineUpConfirm('C');
    nowLineUpConfirm('D');
}

function lineLastCardCheck() {
    let lineLastCard = //各行の最後のカード（最大値）を取得して配列に
        [
            Math.max(...nowLineUp['A']),
            Math.max(...nowLineUp['B']),
            Math.max(...nowLineUp['C']),
            Math.max(...nowLineUp['D'])
        ];
    return lineLastCard;
}

    //どこの行に置かれるかの判定
async function putLineJudge(putCard) { //処理するカードを引数として取得
    nowLineUpConfirm4time(); //行の状況を確認
    let lineLastCard = lineLastCardCheck();
    // console.log('-----putCard');
    // console.log('置くカード：' + putCard.number);
    const rangeA = putCard.number - lineLastCard[0]; //行Aと出したカードの数字の差
    const rangeB = putCard.number - lineLastCard[1]; //＋なら後ろに置ける
    const rangeC = putCard.number - lineLastCard[2];
    const rangeD = putCard.number - lineLastCard[3];
    // console.log('各行の現在の行末は:' + lineLastCard);
    // console.log('行Aと選択したカードの差(rangeAの値)は:' + rangeA);
    function judgeFunc() { //算出した差から正数かつ一番近い数字（行）を判定
        let aliveValue = Infinity;
        let judgeResult;
        judgeResult = 'judgeFalse';
        if(rangeA > 0 && rangeA < aliveValue) {
            aliveValue = rangeA;
            judgeResult = lineA;
            targetLine = 'lineA';
        }
        if(rangeB > 0 && rangeB < aliveValue) {
            aliveValue = rangeB;
            judgeResult = lineB;
            targetLine = 'lineB';
        }
        if(rangeC > 0 && rangeC < aliveValue) {
            aliveValue = rangeC;
            judgeResult = lineC;
            targetLine = 'lineC';
        }
        if(rangeD > 0 && rangeD < aliveValue) {
            aliveValue = rangeD;
            judgeResult = lineD;
            targetLine = 'lineD';
        }
        return judgeResult;
    }
    let lineJudgeResult = judgeFunc();
    if(lineJudgeResult === 'judgeFalse') {
        await choiceTakeLine(putCard);
    } else {
        putToLine(lineJudgeResult, putCard); //!
    }
}


    // 行にカードを置く関数====================
function tagGenerate(target) { //目標のタグを受け取ってimgを挿入
    const img = document.createElement('img'); // img要素を作成
    img.src = `images/${pickUpCard.number}.png`; //imgのsrc属性に追加
    img.id = pickUpCard.number;
    // console.log('処理中のカード' + pickUpCard.number);
    target.appendChild(img); // liにimgを追加
}
    //カードを置く位置（列）を判定。 目標の行を引数として受け取る
function putToLine(line, cardObj, isTake) { /* isTake　ラインを引き取るかどうか */
    reGetLine();
    if(line === 'judgeFalse') { //もし数字が小さくてどこにも置けなければ
        choiceTakeLine(cardObj);
    } else if(!line[0].querySelector('img')) { //その列にカードがあるか？
        tagGenerate(line[0]); //1列目にカードがない時
    } else if(!line[1].querySelector('img')) {
        tagGenerate(line[1]);
    } else if(!line[2].querySelector('img')) {
        tagGenerate(line[2]);
    } else if(!line[3].querySelector('img')) {
        tagGenerate(line[3]);
    } else if(!line[4].querySelector('img')) {
        tagGenerate(line[4]);
    } else if(!line[5].querySelector('img')) { //6枚目に配置される時
        tagGenerate(line[5]);
        isTake = 'yes';
        // console.log('6枚目に配置されました。引取り処理を行います。');
    } else {
        window.alert('エラーが発生しました。既にその行には6枚のカードが置かれています。');
    }
    if(isTake === 'yes') {
        takeLine(line, cardObj); //カードの引取り処理
    }
}


// ====================
// カード選択～配置の処理====================
async function turnProcess() { //NPCの出すカードを出力する
    //※自分が選んだカードは既に手札から削除しopenCardに追加済み。
    openCard.push(npcChoice(player2Hand)); //手札配列を関数に渡して返ってきたオブジェクトを配列に追加
    openCard.push(npcChoice(player3Hand));
    openCard.push(npcChoice(player4Hand));
    openCard.push(npcChoice(player5Hand));

    function putPlayerField() { //カードを自分の前に出す
        openCard.forEach(function(openItem) {
            pickUpCard = openItem; //tagGenerate用にカードのオブジェクトを設定
            let where; //どこに置くかのインデックス番号を収納
            switch(openItem['whoseCard']) { //誰が出したかでwhereを設定
                case 'player1': where = 0; break;
                case 'player2': where = 1; break;
                case 'player3': where = 2; break;
                case 'player4': where = 3; break;
                case 'player5': where = 4; break;
            }
            tagGenerate(playerPutField[where]); //指定の場所にカードを配置
        });
    }
    putPlayerField(); //直上の関数呼び出し
    openCard.sort((a, b) => a.number - b.number); //出されたカードをソート

    await waitProgram(1000);

        //出されたカードを処理する（〇秒毎に）
    async function waitingProcess() {
        for(const openCardItem of openCard) {
            pickUpCard = openCardItem; //!
            let processingCard = document.getElementById(`${pickUpCard.number}`); //処理するカードの要素を取得
            processingCard.classList.add('imgBig'); //処理中のカードを拡大
            await waitProgram(750);

            await putLineJudge(openCardItem);
            processingCard.remove(); //カード置き場から処理中のカードを削除
            await waitProgram(1000); // ここで完了を待つ
        }
    }
    await waitingProcess();
    console.log('ターン終了');

    // ラウンド終了処理
    if(turn >= 10) { //カードを10枚出し切って処理が終わったら
        // console.log('ラウンド終了処理を開始');
        let isGameEnd = 'no';
        pointsConfirm();
        // console.log(playerPoints);
        playerPoints.forEach(function(point){
            if(point <= 0) { //0点以下なら
                isGameEnd = 'yes';
            }
        });
        if(isGameEnd === 'yes') {
            //ゲーム終了処理
            gameEnd();

        } else { //誰も0点以下がいなければ
            //次のラウンドへ (リセット処理)
            console.log('次のラウンドへ移行します');
            roundReset();
            dealCard();
            addCardEvent();
        }
    } else { //まだ10枚出し切っていなければ
        turn++; //ターンのカウントを増やす
        playTurn = true;
    }

}




// ====================
// NPC関係の処理====================

// ランダムじゃないカード選択用
// function npcChoiceAI() {
//     // reGetLine();
//     // lineLastCardCheck();


//     // ↓これを手直し
//     const validCards = [];
//     // チェック処理
//     field.forEach(fieldCard => {
//         hand.forEach(handCard => {
//             if (handCard === fieldCard + 1 || handCard === fieldCard + 2) {
//                 validCards.push({
//                     field: fieldCard,
//                     hand: handCard
//                 });
//             }
//         });
//     });
//     // 結果表示
//     if (validCards.length > 0) {
//         console.log("場札より1または2大きい手札があります:");
//         validCards.forEach(pair => {
//             console.log(`場札 ${pair.field} → 手札 ${pair.hand}`);
//         });
//     } else {
//         console.log("条件を満たす手札はありません");
//     }

// }

function npcChoice(player) { //NPCの出すカードをランダム選択　NPCの手札配列が引数で渡される
    let num = Math.floor(Math.random() * player.length);
    let choiceCard = player[num]; //選ばれたカードのオブジェクトを代入
    let handIndex = player.indexOf(choiceCard); //手札配列の何番目のカードが選ばれたか
    player.splice(handIndex, 1); //手札配列から該当カードを削除
    return choiceCard; //選ばれたカードのオブジェクトを返す
}

    // NPCがどのラインを取るか選ぶ
function choiceTakeLineNPC(cardObj) {
    // let randomChoice = Math.floor(Math.random() * 4);
    let line = '';
    let countImg = '';
    let count = 0;
    let choiceLine = '';

    const minPoint = Math.min(...lineDamageAll);
    const minPtIndexes = lineDamageAll.map((v, i) => v === minPoint ? i : -1).filter(i => i !== -1);
    if(minPtIndexes.length >= 2) {
        let randomChoice = Math.floor(Math.random() * minPtIndexes.length)
        choiceLine = minPtIndexes[randomChoice];
    } else {
        choiceLine = minPtIndexes[0];
    }
    switch(choiceLine) {
        case 0:
            line = lineA;
            targetLine = 'lineA';
            countImg = document.querySelectorAll('#lineA li img');
            count = countImg.length;
            tagGenerate(lineA[count]);
            break;
        case 1:
            line = lineB;
            targetLine = 'lineB';
            countImg = document.querySelectorAll('#lineB li img');
            count = countImg.length;
            tagGenerate(lineB[count]);
            break;
        case 2:
            line = lineC;
            targetLine = 'lineC';
            countImg = document.querySelectorAll('#lineC li img');
            count = countImg.length;
            tagGenerate(lineC[count]);
            break;
        case 3:
            line = lineD;
            targetLine = 'lineD';
            countImg = document.querySelectorAll('#lineD li img');
            count = countImg.length;
            tagGenerate(lineD[count]);
            break;
    }
    takeLine(line, cardObj);
}




// ====================
function lineDamageCalc() {
    lineDamageAll = [];
    let getLineDamage = [[], [], [], []];
    let i = 0;
    reGetLine();
    for(const key in linePutCardAll) { //lineA...を取り出す
        const keyArray = linePutCardAll[key];
        keyArray.forEach(function(liElement, index) { //lineA...のli要素を取り出す
            if (index === keyArray.length - 1) return;
            const cardNum = liElement.children[0];
            // console.log(liElement);
            if(cardNum) { //lineA...liの子要素（img）が空でなければ
                let getCardId = Number(cardNum.id);
                let getCardData = allCard[getCardId - 1];
                getLineDamage[i].push(getCardData['point']); //カードのpointを入れる
            }
        });
        i++;
    }
    // console.log(getLineDamage);
    getLineDamage.forEach(function(lineDamage) { //それぞれの行でポイントを合計
        lineDamageAll.push(lineDamage.reduce((acc, current) => acc + current, 0));
    });
}


// ====================
// ゲームを開始する====================
    //カードを配る関数
function dealRandom(playerName) {
    let randomSelect = Math.floor(Math.random() * dealArray.length);
    pickUpCard = dealArray[randomSelect]; //{number: 1, point: 1}この形で代入される
    dealArray.splice(randomSelect, 1); //splice(目的のindex番号, 消す個数)を宣言し、選択されたカードを配列から消す。
    pickUpCard['whoseCard'] = playerName; //誰のカードなのか、カードのオブジェクトに追記する
    return pickUpCard;
}
function dealCard() {
    // console.log('dealCardが実行されました');
    let i = 1;
    while(i <= 50) {
        player1Hand.push(dealRandom('player1'));
        player2Hand.push(dealRandom('player2'));
        player3Hand.push(dealRandom('player3'));
        player4Hand.push(dealRandom('player4'));
        player5Hand.push(dealRandom('player5'));
        i += 5;
    }
    player1Hand.sort((a, b) => a.number - b.number); //配られたカードをソート
    player2Hand.sort((a, b) => a.number - b.number);
    player3Hand.sort((a, b) => a.number - b.number);
    player4Hand.sort((a, b) => a.number - b.number);
    player5Hand.sort((a, b) => a.number - b.number);

    player1Hand.forEach(function(object) { //配られたカードを手札に表示する。　エフェクト用CSSクラスも追加。
        document.querySelector('.myHand ul').insertAdjacentHTML('beforeend', `<li class="dealEffect"><img id="${object.number}" src="images/${object.number}.png"></li>`)
    });

    dealRandom('openingCardA'); //初期場札を配置
    putToLine(lineA);
    dealRandom('openingCardA');
    putToLine(lineB);
    dealRandom('openingCardA');
    putToLine(lineC);
    dealRandom('openingCardA');
    putToLine(lineD);
}

function addCardEvent() {
    let handGet = document.querySelectorAll('.myHand ul li img');
    let handGetArray = Array.from(handGet);
    handGetArray.forEach(function(el) {
        el.addEventListener('click',function() {
            if(playTurn === true) { /* 自分のターンかどうか判定 */
                pickUpCard = allCard[this.id - 1]; //クリックされたカードのidを-1して配列と照合、オブジェクトを代入。
                let removeCard = document.getElementById(`${this.id}`); //手札から選択したカードを代入
                removeCard.remove(); //手札からカードを削除
                let handIndex = player1Hand.indexOf(pickUpCard); //手札配列の何番目のカードが選ばれたか
                openCard = [];
                openCard.push(player1Hand[handIndex]) //出されたカード配列に選択したカードオブジェクトを追加
                player1Hand.splice(handIndex, 1); //手札配列から該当カードを削除
                playTurn = false;
                turnProcess();
            } /* ターンじゃなければクリック反応しない */
        });
    });
}

    //スタートボタンにイベントを設定
const startBtn = document.getElementById('startBtn');
window.addEventListener('DOMContentLoaded',function() {
    startBtn.addEventListener('click', function() {
        startBtn.disabled = true;
        dealCard(); //カードを配る
        addCardEvent(); //配ったカードにクリックイベントを設定
    });
});


function gameEnd() {
    // リザルトモーダル表示
    const resultModal = document.getElementById('modal');
    resultModal.classList.add('show');
    const modalClose = document.querySelector('.modalClose');
    modalClose.addEventListener('click', function() {
        resultModal.classList.remove('show');
    });

    // ランキング処理
    const rankingElement = document.getElementById('ranking');
    rankingElement.innerHTML = ''; // 前回の結果を消去

    const players = ['player1', 'player2', 'player3', 'player4', 'player5'];
    const playerAndPoints = new Map();

    players.forEach((name, i) => {
        playerAndPoints.set(name, Number(playerPoints[i])); // 数値として扱う
    });

    // ポイントの降順でソート
    const sorted = [...playerAndPoints.entries()].sort((a, b) => b[1] - a[1]);

    // 同点を考慮した順位計算
    let rank = 1;
    let prevPoint = null;
    let sameCount = 0; // 同点数
    sorted.forEach(([name, point], index) => {
        if (point === prevPoint) {
            sameCount++; // 同点の場合
        } else {
            // 異なる点数の場合は順位を更新（前回の順位 + 同点数）
            rank = index + 1;
            sameCount = 1;
        }
        prevPoint = point;

        const li = document.createElement('li');
        li.textContent = `${rank}位：${name} ★${point}`;
        rankingElement.appendChild(li);
    });

    startBtn.disabled = false;
}


// ゲームリセット
const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', function() {
    if(playTurn === true) {
        if(confirm('本当にリセットしますか？')) {
            roundReset();
            startBtn.disabled = false;
        }
    }
});



// ルールモーダル
const ruleOpen = document.getElementById('ruleOpen');
const ruleModal = document.querySelector('.ruleOverlay');
ruleOpen.addEventListener('click', function() {
    ruleModal.classList.add('show');
});
const ruleClose = document.querySelectorAll('.ruleClose');
const modalContent = document.getElementById('rule');
modalContent.addEventListener('click', function(event) {
    event.stopPropagation();
});
ruleClose.forEach(function(element) {
    element.addEventListener('click', function() {
        ruleModal.classList.remove('show');
    });
});












