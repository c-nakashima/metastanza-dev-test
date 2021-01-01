// リスト表示用（今回name_jpしか使ってません...）
// const menu = [
//     { "id": 1, "name_jp": "コーヒー", "name_en": "coffee" },
//     { "id": 2, "name_jp": "エスプレッソ", "name_en": "espresso" },
//     { "id": 3, "name_jp": "カプチーノ", "name_en": "cappuccino" },
//     { "id": 4, "name_jp": "カフェモカ", "name_en": "mocha" },
//     { "id": 5, "name_jp": "ティー", "name_en": "tea" },
//     { "id": 6, "name_jp": "サンドイッチ", "name_en": "sandwich" },
//     { "id": 7, "name_jp": "ホットドック", "name_en": "hotdog" },
//     { "id": 8, "name_jp": "オムレツ", "name_en": "omelette" },
//     { "id": 9, "name_jp": "サラダ", "name_en": "salad" },
//     { "id": 10, "name_jp": "カレー", "name_en": "curry" },
//     { "id": 11, "name_jp": "ショートケーキ", "name_en": "shortcake" },
//     { "id": 12, "name_jp": "チョコレートケーキ", "name_en": "chocolatecake" },
//     { "id": 13, "name_jp": "チーズケーキ", "name_en": "cheesecake" },
//     { "id": 14, "name_jp": "アップルパイ", "name_en": "applepie" },
//     { "id": 15, "name_jp": "プリン", "name_en": "pudding" },
//     { "id": 16, "name_jp": "パフェ", "name_en": "pudding" }
// ]


// ページング機能
const pagination = () => {
    // 初期値設定
    let page = 1; // 現在のページ（何ページ目か）
    const step = 5; // ステップ数（1ページに表示する項目数）

    fetch("https://sparql-support.dbcls.jp/rest/api/metastanza_table_example")
        .then(responce => {
            // responce.json()をreturnすることで、次のthenに
            // APIで取得できるデータをオブジェクト形式で渡すことができる
            return responce.json();
        })
        .then(data => {
            // responce.json()で受け取った中身を確認
            // 実際にはここでdataの中身を利用して様々な処理をする
            // console.log(data.body);
            let menu = data.body;
            console.log(menu);
            console.log(menu.length);

    // 現在のページ/全ページ を表示
    // <p class="count"></p> の中身を書き換え
    const count = (page, step) => {
        const p = document.querySelector('.count');

        // 全ページ数 menuリストの総数/ステップ数の余りの有無で場合分け
        const total = (menu.length % step == 0) ? (menu.length / step) : (Math.floor(menu.length / step) + 1);
        p.innerText = page + "/" + total + "ページ";

        //現在のページをハイライト
        const currentPage = document.querySelector(".pagination").children[page];
        const previousPage = document.querySelector(".pagination").children[page - 1];
        const nextPage = document.querySelector(".pagination").children[page + 1];
        currentPage.style.color = "red";
        previousPage.style.color = "black";
        nextPage.style.color = "black";
    }

    // ページを表示
    // <ul class="menu_list"></ul> の中身を書き換え
    const show = (page, step) => {
        const ul = document.querySelector('.menu_list');
        // 一度リストを空にする
        while (ul.lastChild) {
            ul.removeChild(ul.lastChild);
        }
        const first = (page - 1) * step + 1;
        const last = page * step;
        menu.forEach((item, i) => {
            if (i < first - 1 || i > last - 1) return;
            let li = document.createElement('li');
            li.innerText = item.id.value;
            ul.appendChild(li);
        });
        count(page, step);
    }

    // 最初に1ページ目を表示
    show(page, step);

    // 前ページ遷移トリガー
    document.getElementById("prev").addEventListener('click', () => {
        if (page <= 1) return;
        page = page - 1;
        show(page, step);
    });

    // 次ページ遷移トリガー
    document.getElementById('next').addEventListener('click', () => {
        if (page >= menu.length / step) return;
        page = page + 1;
        show(page, step);
    });
})
    
}

window.onload = () => {
    pagination();
}