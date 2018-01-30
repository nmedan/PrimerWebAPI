$(document).ready(function () {

    // podaci od interesa
    var host = window.location.host;
    var token = null;
    var headers = {};
    var newId = 0;
    // posto inicijalno nismo prijavljeni, sakrivamo odjavu
    $("body").on("click", "#btnEdit", editBook);
    $("body").on("click", "#btnDel", deleteBook);
    $("#odjava").css("display", "none");
    $("#add-edit-book").css("display", "none");
    // registracija korisnika
    $("#registracija").submit(function (e) {
        e.preventDefault();

        var email = $("#regEmail").val();
        var loz1 = $("#regLoz").val();
        var loz2 = $("#regLoz2").val();

        // objekat koji se salje
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
            $("#info").append("Uspešna registracija. Možete se prijaviti na sistem.");

        }).fail(function (data) {
            alert(data);
        });


    });


    // prijava korisnika
    $("#prijava").submit(function (e) {
        e.preventDefault();

        var email = $("#priEmail").val();
        var loz = $("#priLoz").val();

        // objekat koji se salje
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
            $("#info").empty().append("Prijavljen korisnik: " + data.userName);
            token = data.access_token;
            $("#prijava").css("display", "none");
            $("#registracija").css("display", "none");
            $("#odjava").css("display", "block");


        }).fail(function (data) {
            alert(data);
        });
    });

    // odjava korisnika sa sistema
    $("#odjavise").click(function () {
        token = null;
        headers = {};

        $("#prijava").css("display", "block");
        $("#registracija").css("display", "block");
        $("#odjava").css("display", "none");
        $("#info").empty();


    });

    // ucitavanje prvog proizvoda
    $("#books").click(function () {
        
    


      
        $.ajax({
            "type": "GET",
            "url": "http://" + host + "/api/authors",
            "headers" : headers
        }).done(function (data) {
            console.log(data);
            var sel = $("#search-author");

            sel.empty();

            for (i = 0; i < data.length; i++) {
                var stringId = data[i].Id.toString();
                var opt = "<option value=" + stringId + ">" + data[i].Name + " " + data[i].Surname + "</option>";
                sel.append(opt);
            }


        }).fail(function (data) {
            alert(data.status + ": " + data.statusText);
        });
        $.ajax({
            "type": "GET",
            "url": "http://" + host + "/api/books",
            

        }).done(function (data) {
            console.log(data);
         
            var table = $("#book-table");
            table.empty();
            var header = $("<tr><td>Id</td><td>Title</td><td>Date published</td><td>Price</td><td>Author</td><td>Delete</td></tr>");
            table.append(header);
            for (i = 0; i < data.length; i++) {
                // prikazujemo novi red u tabeli
                var row = "<tr>";
                // prikaz podataka
                var displayData = "<td>" + data[i].Id + "</td><td>" + data[i].Title + "</td><td>" + data[i].DatePublished + "</td><td>" + data[i].Cena + "</td><td>" + data[i].Author.Name + " " + data[i].Author.Surname + "</td>";
                // prikaz dugmadi za izmenu i brisanje
                var stringId = data[i].Id.toString();
               
                var displayDelete = "<td><button id=btnDel name=" + stringId + ">Delete</button></td>";
                var displayEdit = "<td><button id=btnEdit name=" + stringId + ">Edit</button></td>";
                row += displayData + displayEdit + displayDelete + "</tr>";
                table.append(row);
                newId = data[i].Id;
            }

           
            $("#search-author").css("display", "block");
           


        }).fail(function (data) {
            alert(data.status + ": " + data.statusText);
        });

     



        });



    $("#add-edit-book").submit(function (e) {
        // sprecavanje default akcije forme
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
                $("#books").trigger("click");
            }).fail(function (data) {
                alert("Desila se greska!");
            });
        }
        else
        {
            
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
                    $("#books").trigger("click");
                }).fail(function (data) {
                    alert("Desila se greska!");
                });
        }

    });


        $("#new-book").click(function () {
            // korisnik mora biti ulogovan
            
          
            if (token) {
                headers.Authorization = 'Bearer ' + token;
            }
           
            $("#add-edit-book").css("display", "block");
            $.ajax({
                "type": "GET",
                "url": "http://" + host + "/api/authors",
                "headers": headers
            }).done(function (data) {
                console.log(data);
                var sel = $("#book-author");

                sel.empty();

                for (i = 0; i < data.length; i++) {
                    var stringId = data[i].Id.toString();
                    var opt = "<option value=" + stringId + ">" + data[i].Name + " " + data[i].Surname+ "</option>";
                    sel.append(opt);
                }
                

            }).fail(function (data) {
                alert(data.status + ": " + data.statusText);
            });
    });


        function deleteBook() {
            // // izvlacimo {id}
            // // izvlacimo {id}
            if (token) {
                headers.Authorization = 'Bearer ' + token;
            }
            var deleteID = this.name;
            // saljemo zahtev 
            $.ajax({
                "url": "http://" + host + "/api/books/"  + deleteID.toString(),
                "type": "DELETE",
                "headers": headers
            })
                .done(function (data, status) {
                     $("#books").trigger("click");
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
                    $("#book-price").val(data.Price);
                    $("#book-date-published").val(data.DatePublished);
                    $("#book-author").val(data.Id);
                  
                   
                    
                })
                .fail(function (data, status) {
                    alert("Desila se greska!");
                });

        };

   
       
        $("#btnSearch").click(function () {



            if (token) {
                headers.Authorization = 'Bearer ' + token;
            }
            var pretraga = "?"+$("#search-author").attr("name")+"=" + $("#search-author").val();

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
                    // prikazujemo novi red u tabeli
                    var row = "<tr>";
                    // prikaz podataka
                    var displayData = "<td>" + data[i].Id + "</td><td>" + data[i].Title + "</td><td>" + data[i].DatePublished + "</td><td>" + data[i].Cena + "</td><td>" + data[i].Author.Name + " " + data[i].Author.Surname + "</td>";
                    // prikaz dugmadi za izmenu i brisanje
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

