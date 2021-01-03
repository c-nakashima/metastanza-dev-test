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
                const firstButton = document.getElementById('button_first');
                const lastButton = document.getElementById('button_last');
                const clickPageNumber = document.querySelectorAll('.clickPageNumber');

                let current_page = 1;
                let records_per_page = 5;
                let total_records = objJson.length;

                this.init = function () {
                    changePage(1);
                    pageNumbers();
                    selectedPage();
                    clickPage();
                    addEventListeners();
                    // showingRecordsNumber(current_page);
                }

                let addEventListeners = function () {
                    prevButton.addEventListener('click', prevPage);
                    nextButton.addEventListener('click', nextPage);
                    firstButton.addEventListener('click', firstPage);
                    lastButton.addEventListener('click', lastPage);
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

                let showingRecordsNumber = function (page){
                    // if (page < 1) {
                    //     page = 1;
                    // }
                    // if (page > (numPages() - 1)) {
                    //     page = numPages();
                    // }

                    const showing_records_number = document.getElementById("showing_records_number");

                    let firstrecord_per_page = ((page - 1) * records_per_page) + 1;
                    let lastrecord_per_page = page * records_per_page;

                    if(total_records == records_per_page * numPages()){
                        lastrecord_per_page = page * records_per_page;
                    } else {
                        lastrecord_per_page = ((page - 1) * records_per_page) + (total_records % records_per_page);
                    }
                    showing_records_number.innerHTML = "<p>Showing" + firstrecord_per_page + "to" + lastrecord_per_page + "of" + total_records + "entres</p>";
                }

                let changePage = function (page) {
                    
                    // if (page < 1) {
                    //     page = 1;
                    // }
                    // if (page > (numPages() - 1)) {
                    //     page = numPages();
                    // }

                    var tableKey = Object.keys(objJson[0]); //th・tdに格納されるデータのキーを配列で取得してtableKeyに代入
                    var columns_per_row = tableKey.length; //tableKeyで取得したキーの配列の数（＝列の数）を取得してcolumns_per_rowに代入

                    //▼theadの描画
                    const thead = document.getElementById('theadID');
                    thead.innerHTML = "";
                    thead.innerHTML = "<tr id='theadRowID'></tr>";
                        //▽trおよびthの描画
                    for(var j = 0; j< columns_per_row; j++){
                        var th = document.createElement("th");
                        th.innerHTML = tableKey[j] + "<span class='icon filtericon'></span><span class='icon sorticon'></span>";
                        var tr = document.getElementById('theadRowID');
                        tr.appendChild(th);            
                    }
                    
                    //▼tbodyの描画
                    const tbody = document.getElementById('tbodyID');
                    tbody.innerHTML = "";

                    //▽trおよびtdの描画
                    for (var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < objJson.length; i++) {
                        var tr = document.createElement("tr");
                        //それぞれのtrごとにtdを追加し、そのtdに対応する列のデータを格納する
                        //ゆえに、ループする数はcolumns_per_row（＝列の数）回（ループ数=tdの数=列の数）
                        for(var j = 0; j< columns_per_row; j++){
                            var td = document.createElement("td");
                            var tdValue = Object.values(objJson[i]);
                            td.innerHTML = tdValue[j].value;
                            tr.appendChild(td);
                        }
                        tbody.appendChild(tr);
                    }
                    checkButtonOpacity();
                    selectedPage();
                    showingRecordsNumber(current_page);
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

                let firstPage = function () {
                    if (current_page != 1) {
                        current_page = 1;
                        changePage(current_page);
                    }
                }

                let lastPage = function () {
                    if (current_page != numPages()) {
                        current_page = numPages();
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
