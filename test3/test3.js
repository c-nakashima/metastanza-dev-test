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
            let dataHead = data.head;
            let dataBody = data.body;


            function Pagination() {
                const prevButton = document.getElementById('button_prev');
                const nextButton = document.getElementById('button_next');
                const firstButton = document.getElementById('button_first');
                const lastButton = document.getElementById('button_last');
                // setTimeout(
                //     function(){
                //         const sortButton = document.getElementById('button_sort');
                //         console.log(sortButton);
                //     }, 100
                // );
                const clickPageNumber = document.querySelectorAll('.clickPageNumber');

                let current_page = 1;
                let records_per_page = 5;
                let total_records = dataBody.length;
                
                //orderを定義（負の値があったときは排除して新たに定義し、それ以外の場合はカラムの数だけorderを定義する）
                let order = [];
                if(dataHead.order){
                    for(let i = 0; i < dataHead.order.length; i++){
                        if(parseInt(dataHead.order[i]) >= 0){
                            order[parseInt(dataHead.order[i])] = i;
                        }
                    }
                }else{
                    order = [...Array(dataHead.vars.length).keys()];
                }

                let tableKey = Object.keys(dataBody[0]); //th・tdに格納されるデータのキーを配列で取得してtableKeyに代入
                let columns_per_row = tableKey.length; //tableKeyで取得したキーの配列の数（＝列の数）を取得してcolumns_per_rowに代入
                
                
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
                    firstButton.addEventListener('click', firstPage);
                    lastButton.addEventListener('click', lastPage);
                    let sortButtons = document.getElementsByClassName('button_sort');
                    for( var i=0,l=sortButtons.length; l>i; i++ ) {
                        let sortButton = sortButtons[i] ;
                        console.log(sortButton);
                        sortButton.addEventListener('click', sortColumn);
                    }
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
                    if (page < 1) {
                        page = 1;
                    }
                    if (page > (numPages() - 1)) {
                        page = numPages();
                    }

                    //▼theadの描画
                    let thead = document.getElementById('theadID');
                    thead.innerHTML = "";
                    thead.innerHTML = "<tr id='theadRowID'></tr>";
                    //▽trおよびthの描画
                    for(let i of order){
                        let tr = document.getElementById('theadRowID');
                        let th = document.createElement("th");
                        let span_filter = document.createElement("span");
                        let span_sort = document.createElement("span");
                        let label = dataHead.vars[i];
                        if(dataHead.labels){
                            label = dataHead.labels[i];
                        }
                        th.innerHTML = label;
                        span_filter.classList.add("icon", "filtericon");
                        span_sort.setAttribute("data-type", dataHead.vars[i]);
                        span_sort.classList.add("icon", "sorticon", "button_sort");

                        th.appendChild(span_filter);
                        th.appendChild(span_sort);
                        tr.appendChild(th);
                    }

                    //▼tbodyの描画
                    let tbody = document.getElementById('tbodyID');
                    tbody.innerHTML = "";
                    
                    // //▽trおよびtdの描画
                    for(var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < dataBody.length; i++){
                        let tr = document.createElement("tr");
                        for(let j of order){
                            let td = document.createElement("td");
                            // let tdValue = Object.values(dataBody[i]);
                            if (dataHead.href[j]) {
                                let a = document.createElement("a");
                                a.setAttribute("href", dataBody[i][dataHead.href[j]].value);
                                a.innerHTML = dataBody[i][dataHead.vars[j]].value;
                                td.appendChild(a);
                            } else {
                                td.innerHTML = dataBody[i][dataHead.vars[j]].value;
                            }
                            tbody.appendChild(tr);
                            tr.appendChild(td);
                        }
                    }

                    checkButtonOpacity();
                    selectedPage();
                    showingRecordsNumber(current_page);
                    // const sortButton = document.getElementsByClassName('button_sort');
                    // sortButton.addEventListener('click', sortColumn);
                }
                

                // //クリックしたらソートする（メモ）
                // let span_sort = document.getElementsByClassName("button_sort");
                // console.log(span_sort);
                // span_sort.addEventListener('click',function(e){
                //     let offsetY = e.offsetY;
                //     if(offsetY >= 8){
                //         span_sort.className = "icon sorticon-asc";
                //         const key = e.path[0].getAttribute('data-type');
                //         const sortArray = dataBody.sort((a,b) => a[key].value.toLowerCase() < b[key].value.toLowerCase() ? -1 : 1);
                //         tbody.innerHTML = "";
                //         for(var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < sortArray.length; i++){
                //             let tr = document.createElement("tr");
                //             for(let j of order){
                //                 let td = document.createElement("td");
                //                 // let tdValue = Object.values(dataBody[i]);
                //                 if (dataHead.href[j]) {
                //                     let a = document.createElement("a");
                //                     a.setAttribute("href", sortArray[i][dataHead.href[j]].value);
                //                     a.innerHTML = sortArray[i][dataHead.vars[j]].value;
                //                     td.appendChild(a);
                //                 } else {
                //                     td.innerHTML = sortArray[i][dataHead.vars[j]].value;
                //                 }
                //                 tbody.appendChild(tr);
                //                 tr.appendChild(td);
                //             }
                //         }
                //     } else {
                //         span_sort.className = "icon sorticon-des";
                //         const key = e.path[0].getAttribute('data-type');
                //         const sortArray = dataBody.sort((a,b) => b[key].value.toLowerCase() < a[key].value.toLowerCase() ? -1 : 1);
                //         tbody.innerHTML = "";
                //         for(var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < sortArray.length; i++){
                //             let tr = document.createElement("tr");
                //             for(let j of order){
                //                 let td = document.createElement("td");
                //                 // let tdValue = Object.values(dataBody[i]);
                //                 if (dataHead.href[j]) {
                //                     let a = document.createElement("a");
                //                     a.setAttribute("href", sortArray[i][dataHead.href[j]].value);
                //                     a.innerHTML = sortArray[i][dataHead.vars[j]].value;
                //                     td.appendChild(a);
                //                 } else {
                //                     td.innerHTML = sortArray[i][dataHead.vars[j]].value;
                //                 }
                //                 tbody.appendChild(tr);
                //                 tr.appendChild(td);
                //             }
                //         }
                //     }
                // })


                let sortColumn = function (e){
                    let page = current_page;
                    // let span_sort = document.getElementsByClassName("sorticon");
                    let tbody = document.getElementById('tbodyID');
                    let span_sort = document.getElementsByClassName('button_sort');
                    let offsetY = e.offsetY; // =>要素左上からのy座標
                    if(offsetY >= 8){
                        span_sort.className = "icon sorticon-asc";
                        const key = e.path[0].getAttribute('data-type');
                        const sortArray = dataBody.sort((a,b) => a[key].value.toLowerCase() < b[key].value.toLowerCase() ? -1 : 1);
                        tbody.innerHTML = "";
                        for(var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < sortArray.length; i++){
                            let tr = document.createElement("tr");
                            for(let j of order){
                                let td = document.createElement("td");
                                // let tdValue = Object.values(dataBody[i]);
                                if (dataHead.href[j]) {
                                    let a = document.createElement("a");
                                    a.setAttribute("href", sortArray[i][dataHead.href[j]].value);
                                    a.innerHTML = sortArray[i][dataHead.vars[j]].value;
                                    td.appendChild(a);
                                } else {
                                    td.innerHTML = sortArray[i][dataHead.vars[j]].value;
                                }
                                tbody.appendChild(tr);
                                tr.appendChild(td)
                            }
                        }
                    } else {
                        span_sort.className = "icon sorticon-des";
                        const key = e.path[0].getAttribute('data-type');
                        const sortArray = dataBody.sort((a,b) => b[key].value.toLowerCase() < a[key].value.toLowerCase() ? -1 : 1);
                        tbody.innerHTML = "";
                        for(var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < sortArray.length; i++){
                            let tr = document.createElement("tr");
                            for(let j of order){
                                let td = document.createElement("td");
                                // let tdValue = Object.values(dataBody[i]);
                                if (dataHead.href[j]) {
                                    let a = document.createElement("a");
                                    a.setAttribute("href", sortArray[i][dataHead.href[j]].value);
                                    a.innerHTML = sortArray[i][dataHead.vars[j]].value;
                                    td.appendChild(a);
                                } else {
                                    td.innerHTML = sortArray[i][dataHead.vars[j]].value;
                                }
                                tbody.appendChild(tr);
                                tr.appendChild(td);
                            }
                        }
                    }
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
                    return Math.ceil(dataBody.length / records_per_page);
                }
            }
            let pagination = new Pagination();
            pagination.init();

        })

})();
