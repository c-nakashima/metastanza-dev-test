// if you have any suggestion of questions, pleasse feel free to send me an email to chiholiu10@gmail.com

(function () {
    "use strict";

    fetch("http://togostanza.org/sparqlist/api/metastanza_table?taxonomy=9606&limit=50&offset=0&count=")
        .then(responce => {
            // responce.json()をreturnすることで、次のthenに
            // APIで取得できるデータをオブジェクト形式で渡すことができる
            return responce.json();
        })
        .then(data => {
            // responce.json()で受け取った中身を確認
            // 実際にはここでdataの中身を利用して様々な処理をする
            // console.log(data.body);
            let objJson = data.body;
            console.log(objJson);


            function Pagination() {
                const prevButton = document.getElementById('button_prev');
                const nextButton = document.getElementById('button_next');
                const clickPageNumber = document.querySelectorAll('.clickPageNumber');

                let current_page = 1;
                let records_per_page = 5;

                this.init = function () {
                    changePage(1);
                    pageNumbers();
                    selectedPage();
                    clickPage();
                    addEventListeners();
                }

                let addEventListeners = function () {
                    prevButton.addEventListener('click', prevPage);
                    nextButton.addEventListener('click', nextPage);
                }

                let selectedPage = function () {
                    let page_number = document.getElementById('page_number').getElementsByClassName('clickPageNumber');
                    for (let i = 0; i < page_number.length; i++) {
                        if (i == current_page - 1) {
                            page_number[i].style.opacity = "1.0";
                        }
                        else {
                            page_number[i].style.opacity = "0.5";
                        }
                    }
                }

                let checkButtonOpacity = function () {
                    current_page == 1 ? prevButton.classList.add('opacity') : prevButton.classList.remove('opacity');
                    current_page == numPages() ? nextButton.classList.add('opacity') : nextButton.classList.remove('opacity');
                }

                // let changePage = function (page) {
                //     const listingTable = document.getElementById('listingTable');

                //     if (page < 1) {
                //         page = 1;
                //     }
                //     if (page > (numPages() - 1)) {
                //         page = numPages();
                //     }

                //     // listingTable.innerHTML = "";

                //     //tbodyのIDを取得(この中で処理します)
                //     var tbody = document.getElementById('tbodyID');

                //     for (var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < objJson.length; i++) {
                //         //tr エレメントを新規作成(ただ生成するだけ)
                //         var tr = document.createElement('tr');
                //         //列(td)用のループ
                //         for (j = 0; j < 5; j++){
                //             //tdエレメントをを生成
                //             var td = document.createElement('td');
                //             //tdの中に入れたいモノをセット
                //             td.innerHTML = 'こんにちは' + j;
                //             //生成したtdをtrにセット
                //             tr.appendChild(td);
                //         }//列用のループ閉じ
                //         //tr エレメントをtbody内に追加(ここではじめて表示される)
                //         tbody.appendChild(tr);
                //     }

                    // var rows = [];
                    // var table = document.createElement("table");

                    // // 表に2次元配列の要素を格納
                    // for(i = 0; i < objJson.length; i++){
                    //     rows.push(table.insertRow(-1));  // 行の追加
                    //     for(var j = 0; j < objJson[0].length; j++){
                    //         cell=rows[i].insertCell(-1);
                    //         cell.appendChild(document.createTextNode(objJson[i][j].value));
                    //         // 背景色の設定
                    //         if(i==0){
                    //             cell.style.backgroundColor = "#bbb"; // ヘッダ行
                    //         }else{
                    //             cell.style.backgroundColor = "#ddd"; // ヘッダ行以外
                    //         }
                    //     }
                    // }
                    // // 指定したdiv要素に表を加える
                    // document.getElementById("listingTable").appendChild(table);

                    // checkButtonOpacity();
                    // selectedPage();
                // }
                let changePage = function (page) {
                    const listingTable = document.getElementById('listingTable');

                    if (page < 1) {
                        page = 1;
                    }
                    if (page > (numPages() - 1)) {
                        page = numPages();
                    }

                    // listingTable.innerHTML = "";
                    
                    listingTable.innerHTML += "<tbody id='tbodyID'></tbody>";
                    const tbody = document.getElementById('tbodyID');

                    for (var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < objJson.length; i++) {
                        var tr = document.createElement("tr");
                        for(var j = 0; j< 5; j++){
                            var td = document.createElement("td");
                            // console.log(Object.keys(objJson[i]));
                            // var tdKey = Object.keys(objJson[i]);
                            var tdValue = Object.values(objJson[i]);
                            td.innerHTML = tdValue[j].value;
                            // console.log(tdKey[j]);
                            console.log(tdValue[j].value);
                            tr.appendChild(td);
                        }
                        tbody.appendChild(tr);

                        // tbody.innerHTML += "<tr class=><tr>" ;
                        // const 
                        // listingTable.innerHTML += "<div class='objectBlock'>" + objJson[i].id.value + "</div>";
                    }
                    checkButtonOpacity();
                    selectedPage();
                }

                let prevPage = function () {
                    if (current_page > 1) {
                        current_page--;
                        changePage(current_page);
                    }
                }

                let nextPage = function () {
                    if (current_page < numPages()) {
                        current_page++;
                        changePage(current_page);
                    }
                }

                let clickPage = function () {
                    document.addEventListener('click', function (e) {
                        if (e.target.nodeName == "SPAN" && e.target.classList.contains("clickPageNumber")) {
                            current_page = e.target.textContent;
                            changePage(current_page);
                        }
                    });
                }

                let pageNumbers = function () {
                    let pageNumber = document.getElementById('page_number');
                    pageNumber.innerHTML = "";

                    for (let i = 1; i < numPages() + 1; i++) {
                        pageNumber.innerHTML += "<span class='clickPageNumber'>" + i + "</span>";
                    }
                }

                let numPages = function () {
                    return Math.ceil(objJson.length / records_per_page);
                }
            }
            let pagination = new Pagination();
            pagination.init();

        })

})();
