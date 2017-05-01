
    var validation = function(form){

            $(form + ' button[type="submit"]').click(function (event) {
                event.preventDefault();
                var Email = $(form + ' input[type="email"]').val();
                var error = false;
                $(form +' .error-data').remove();
                // validazione dati
                errorI = checkRequiredInput('required');
                errorS =  checkRequiredSelect(form + ' select');
                error = errorI || errorS;
                //email validation
                var checkEmail = isEmail(Email);
                if (checkEmail == false) {
                    $("input[type='email']").after("<div class='error-data'>" + "inserire una email valida" + "</div>");
                }

                if (error == false && checkEmail == true) {
                    var utente = makeObj(form);
                    ajaxCall(utente);
                }
            });
    };


    function ajaxMess(stateClass,form,message){
      $("#success").html("<div class='alert alert-" + stateClass + "'>");
      $("#success > .alert-" + stateClass).html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append('</button>');
      $("#success > .alert-" + stateClass).append("<strong>"+message+"</strong>");
      $("#success > .alert-" + stateClass).append("</div>");
      $(form).trigger("reset");
    }
    var ajaxCall = function(obj){
          $.ajax({
                        url: 'php/AddUtente.php',
                        //async: false,
                        type: "POST",
                        data: {
                            utente: obj
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            ajaxMess('danger','#contactform','Sorry, ' + jqXHR + "-" + textStatus + "-" + errorThrown + ' Please try again later!');
                        },
                        success: function (data, textStatus, jqXHR) {
                            ajaxMess('success','#contactform','Yuor message has been sent.');
                            var jsonData = JSON.parse(data);
                            console.log(data);
                            if (jsonData.Code == 200) {
                                window.location.href = jsonData.Result.toString();
                            } else {
                                alert("Errore");
                            }
                        }
          });
    };

        function validateRequired(value) {
            if (value == "") return false;
            return true;
        }

        function addError(element, error) {
            element.after("<div class='error-data'>" + error + "</div>");
        }

        function checkRequiredInput(cla){
                var inputs = $('input');
                var isError = false;
                for (var i = 0; i < inputs.length; i++) {
                    var input = inputs[i];
                    if ($(input).hasClass(cla) && !validateRequired($(input).val())) {
                        addError($(input), "Campo obbligatorio");
                        isError = true;
                    }
                }
                return isError;
              }

         function checkRequiredSelect(el){
                var selects = $(el);
                var isError = false;
                for (var i = 0 ; i < selects.length; i++){
                  var select = $(selects[i]);
                  if (select.val() == "") {
                      addError($(select), "Campo obbligatorio");
                      isError = true;
                    }
                }
                return isError;
              }

        function makeObj(element){
                  var Obj = {};
                  var data = $.merge($(element + " input"),$(element + " select"));
                    for (var i = 0 ; i < data.length; i++){
                          el = $(data[i]);
                          var key = ""+el.attr('name');
                         Obj[key] = el.val().trim();
                    }
                    return Obj;
        }


        function isEmail(email) {
            var rules = new RegExp(/^[_a-z0-9A-Z]+(\.[_a-z0-9A-Z]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,4})$/);
            return rules.test(email);
        }

        // function gestisciElementi(el) {
        //     try {
        //         el.disabled = el.disabled ? false : true;
        //     } catch (E) { }
        //     if (el.childNodes && el.childNodes.length > 0) {
        //         for (var x = 0; x < el.childNodes.length; x++) {
        //             gestisciElementi(el.childNodes[x]);
        //         }
        //     }
        // }
        // function attivaOptions()
        // {
        //     var arraySelect = document.getElementById("SelectedProvinciaMittenteId");
        //
        //     for (var i = 0; i < arraySelect.length; i++) {
        //         arraySelect.options[i].disabled = false ;
        //     }
        // }
