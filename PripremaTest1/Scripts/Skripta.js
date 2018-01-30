$(document).ready(function () {

    // podaci od interesa
    var host = window.location.host;
    var token = null;
    var headers = {};
    var newId = 0;

    $("body").on("click", "#btnEdit", editBook);
    $("body").on("click", "#btnDel", deleteBook);
    $("#odjava").css("display", "none");
    $("#btnSearch").css("display", "none");
    $("#search-author").css("display", "none");
    $("#registracija").css("display", "none");
    
    $("#registrovanje").click(function (e) {
        e.preventDefault();
        $("#registracija").css("display", "block");
        $("#prijava").css("display", "none");
    });
    showTable();


    $("#registracija").submit(function (e) {
        e.preventDefault();

        var email = $("#regEmail").val();
        var loz1 = $("#regLoz").val();
        var loz2 = $("#regLoz2").val();


        var sendData = {
            "Email": email,
            "Password": loz1,
            "ConfirmPassword": loz2
        };


        $.ajax({
            type: "POST",
            url: 'http://' + host + "/api/Account/Register",
            data: sendData

        }).done(function (data) {
            $("#prijava").css("display", "block");
            $("#registracija").css("display", "none");
        }).fail(function (data) {
            alert(data.status + ": " + data.statusText);
        });


    });



    $("#prijava").submit(function (e) {
        e.preventDefault();

        var email = $("#priEmail").val();
        var loz = $("#priLoz").val();


        var sendData = {
            "grant_type": "password",
            "username": email,
            "password": loz
        };

        $.ajax({
            "type": "POST",
            "url": 'http://' + host + "/Token",
            "data": sendData

        }).done(function (data) {
            console.log(data);
            $("#login-info").html("Prijavljen korisnik: " + data.userName);
            token = data.access_token;
            $("#prijava").css("display", "none");
            $("#registracija").css("display", "none");
            $("#odjava").css("display", "block");
            $.ajax({
                "type": "GET",
                "url": "http://" + host + "/api/authors",
                "headers": headers
            }).done(function (data) {
                console.log(data);
                var sel = $("#search-author");

                sel.empty();

                for (i = 0; i < data.length; i++) {
                    var stringId = data[i].Id.toString();
                    var opt = "<option value=" + stringId + ">" + data[i].Name + " " + data[i].Surname + "</option>";
                    sel.append(opt);
                }


            });
            $.ajax({
                "type": "GET",
                "url": "http://" + host + "/api/books",
                "headers": headers


            }).done(function (data) {
                console.log(data);

                var table = $("#book-table");
                table.empty();
                var header = $("<tr ><td><b>Id</b></td><td><b>Title</b></td><td><b>Date published</b></td><td><b>Price</></td><td><b>Author</b></td><td colspan=2><b>Action</b></td></tr>");
                table.append(header);
                for (i = 0; i < data.length; i++) {
                    // prikazujemo novi red u tabeli
                    var row = "<tr>";
                    // prikaz podataka
                    var displayData = "<td>" + data[i].Id + "</td><td>" + data[i].Title + "</td><td>" + data[i].DatePublished + "</td><td>" + data[i].Cena + "</td><td>" + data[i].Author.Name + " " + data[i].Author.Surname + "</td>";
                    // prikaz dugmadi za izmenu i brisanje
                    var stringId = data[i].Id.toString();
                    var displayEdit = "<td><button id=btnEdit name=" + stringId + ">Edit</button></td>";
                    var displayDelete = "<td><button id=btnDel name=" + stringId + ">Delete</button></td>";
                    row += displayData + displayEdit + displayDelete + "</tr>";
                    table.append(row);
                    newId = data[i].Id;
                }
            }).fail(function (data) {
                alert(data.status + ": " + data.statusText);
            });


        }).fail(function (data) {
            alert(data.status + ": " + data.statusText);
        });

    });

    // odjava korisnika sa sistema
    $("#odjavise").click(function () {
        token = null;
        headers = {};

        $("#prijava").css("display", "block");
        $("#registracija").css("display", "none");
        $("#odjava").css("display", "none");
        $("#login-info").html("");
        $("#regEmail").val("");
        $("#regLoz").val("");
        $("#regLoz2").val("");
        $("#priEmail").val("");
        $("#priLoz").val("");
        $("#add-edit-book").css("display", "none");
        $("#search-author").css("display", "none");
        $("#book-title").val("");
        $("#book-price").val("");
        $("#book-date-published").val("");
        $("#book-author").val("");
        $("#add-edit-book").css("display", "none");
        $("#search-author").css("display", "none");
        $("#btnSearch").css("display", "none");
       
        showTable();
    });


    $("#add-edit-book").submit(function (e) {

       

        e.preventDefault();
        var bookTitle = $("#book-title").val();
        var bookPrice = $("#book-price").val();
        var bookDatePublished = $("#book-date-published").val();
        var bookAuthorId = $("#book-author").val();
        if ($("#btnBook").text() != "Edit") {
            var sendId = newId + 1;
            var sendData = {

                "Id": sendId,
                "Title": bookTitle,
                "Cena": bookPrice,
                "DatePublished": bookDatePublished,
                "AuthorId": bookAuthorId

            };



            $.ajax({
                "type": "POST",
                "url": "http://" + host + "/api/books",
                "data": sendData,
                "headers": headers
            }).done(function (data) {
                $("#prijava").trigger("submit");
            }).fail(function (data) {
                alert(data.status + ": " + data.statusText);
            });
        }
        else {

            var sendId = $("#bookId").val();
            var sendData = {

                "Id": sendId,
                "Title": bookTitle,
                "Cena": bookPrice,
                "DatePublished": bookDatePublished,
                "AuthorId": bookAuthorId

            };



            $.ajax({
                "type": "PUT",
                "url": "http://" + host + "/api/books/" + sendId,
                "data": sendData,
                "headers": headers
            }).done(function (data) {
                $("#prijava").trigger("submit");

            }).fail(function (data) {
                alert(data.status + ": " + data.statusText);
            });
        }


        $("#book-title").val("");
        $("#book-price").val("");
        $("#book-date-published").val("");
        $("#book-author").val("");
        $("#add-edit-book").css("display", "none");
    });


    $("#new-book").click(function () {

        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        $.ajax({
            "type": "GET",
            "url": "http://" + host + "/api/authors",
            "headers": headers
        }).done(function (data) {
            console.log(data);
          
            $("#add-edit-book").css("display", "block");
            var sel = $("#book-author");

            sel.empty();

            for (i = 0; i < data.length; i++) {
                var stringId = data[i].Id.toString();
                var opt = "<option value=" + stringId + ">" + data[i].Name + " " + data[i].Surname + "</option>";
                sel.append(opt);
            }


        }).fail(function (data) {
            alert(data.status + ": " + data.statusText);
        });
    });

    function showTable() {
       
        $.ajax({
            "type": "GET",
            "url": "http://" + host + "/api/books",


        }).done(function (data) {
            console.log(data);
            var table = $("#book-table");
            table.empty();
            var header = $("<tr style=background-color:lightblue><td><b>Id</b></td><td><b>Title</b></td><td><b>Date published</b></td><td><b>Price</></td><td><b>Author</b></td></tr>");
            table.append(header);
            for (i = 0; i < data.length; i++) {
                // prikazujemo novi red u tabeli
                var row = "<tr>";
                // prikaz podataka
                var displayData = "<td>" + data[i].Id + "</td><td>" + data[i].Title + "</td><td>" + data[i].DatePublished + "</td><td>" + data[i].Cena + "</td><td>" + data[i].Author.Name + " " + data[i].Author.Surname + "</td>";
                // prikaz dugmadi za izmenu i brisanje
                var stringId = data[i].Id.toString();
                row += displayData;
                table.append(row);
                newId = data[i].Id;
            }

        }).fail(function (data) {
            alert(data.status + ": " + data.statusText);
        });
    }

    function deleteBook() {
        
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var deleteID = this.name;
        // saljemo zahtev 
        $.ajax({
            "url": "http://" + host + "/api/books/" + deleteID.toString(),
            "type": "DELETE",
            "headers": headers
        })
            .done(function (data, status) {
                $("#prijava").trigger("submit");
            })
            .fail(function (data, status) {
                alert("Desila se greska!");
            });

    };

    function editBook() {
        // // izvlacimo {id}
        // // izvlacimo {id}
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var editID = this.name;
        // saljemo zahtev 
        $.ajax({
            "url": "http://" + host + "/api/books/" + editID.toString(),
            "type": "GET",
            "headers": headers
        })
            .done(function (data, status) {
                $("#new-book").trigger("click");
                $("#btnBook").text("Edit");
                $("#bookId").val(data.Id);
                $("#book-title").val(data.Title);
                $("#book-price").val(data.Cena);
                $("#book-date-published").val(data.DatePublished);
                $("#book-author").val(data.Id);



            })
            .fail(function (data, status) {
                alert(data.status + ": " + data.statusText);
            });

    };



    $("#btnSearch").click(function () {



        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var pretraga = "?" + $("#search-author").attr("name") + "=" + $("#search-author").val();

        $.ajax({
            "type": "GET",
            "url": "http://" + host + "/api/books/" + pretraga,
            "headers": headers

        }).done(function (data) {
            console.log(data);

            var table = $("#book-table");
            table.empty();
            var header = $("<tr><td>Id</td><td>Title</td><td>Date published</td><td>Price</td><td>Author</td><td>Delete</td></tr>");
            table.append(header);
            for (i = 0; i < data.length; i++) {
                var row = "<tr>";
                var displayData = "<td>" + data[i].Id + "</td><td>" + data[i].Title + "</td><td>" + data[i].DatePublished + "</td><td>" + data[i].Cena + "</td><td>" + data[i].Author.Name + " " + data[i].Author.Surname + "</td>";
                var stringId = data[i].Id.toString();

                var displayDelete = "<td><button id=btnDel name=" + stringId + ">Delete</button></td>";
                var displayEdit = "<td><button id=btnEdit name=" + stringId + ">Delete</button></td>";
                row += displayData + displayEdit + displayDelete + "</tr>";
                table.append(row);
                newId = data[i].Id;
            }

            $("#search-author").css("display", "block");



        }).fail(function (data) {
            alert(data.status + ": " + data.statusText);
        });





    });
});

