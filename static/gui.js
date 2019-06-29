var cameraPosition;
var yaw_plate_current;
var pitch_camera_current;
var llight1 = 0;
var llight2 = 0;
var llight3 = 0;
var llight4 = 0;
var toplight = 0;
var bottomlight = 0;
var pan_right;
var pan_left;
var tilt_right;
var tilt_left;
var step_light = 5;
var snapIntervalId;
var intervalWait;
var sessionStarted=0;
var plate_moving;
var stepPlateInterval;
var plateDirection = 0;
var plateMoving;
var plateMovingInterval;
var cameraMoving;
var cameraMovingInterval;
var checkSliderInterval;
var selectedLight;
var intervalPreview;
var session_name;
var session_url;
var cameraResetInterval;

function cameraPositionValue(value){

    cameraPosition = value;

}

//resetta slider e grafica
function resetValue(){

    $("#slider").slider('value',0);
    $("#slider_right").slider('value',0);
    $( "#custom-handle" ).text("0");
    $( "#handle_right" ).text("0");

}

//cancella configurazione corrente
function deleteCurrentConf(){

    var nameConf = document.getElementById('conf_list').value;
    $.ajax({
                    type: "GET",
					url: "/delete_conf",
					dataType: "json",
					data: {name : nameConf},
					success: function(data){


					   alert("Configuration deleted!")
					   document.getElementById("removeConfButton").style.display = 'none';
					   checkConf();
                       resetValue();


					},
					error: function(data) {console.error("Error delete configuration");}
			});



}

//salvo configurazione preview
function saveConf(){

  var conf_name = document.getElementById("conf_name").value;
  if(conf_name!=""){
      //get camera position slider value
      var cameraPosCurr = $( "#slider" ).slider("value");
      //get plate position slider value
      var platePosCurr = $( "#slider_right" ).slider("value");
      //get on/off state lights
      var lightOne;
      if(document.getElementById("light_one").checked){
           lightOne = "On";
      }
      else{
           lightOne = "Off";
      }
      var lightTwo;
      if(document.getElementById("light_two").checked){
           lightTwo = "On";
      }
      else{
           lightTwo = "Off";
      }




      $.ajax({
                    type: "GET",
					url: "/save_xml",
					dataType: "json",
					data: {confName: conf_name,cameraPos : cameraPosCurr, platePos : platePosCurr, lightOne: lightOne, lightTwo: lightTwo,
					llight1 : llight1, llight2: llight2, llight3: llight3, llight4: llight4, toplight: toplight, bottomlight: bottomlight,
					pan_right: pan_right, pan_left: pan_left, tilt_right: tilt_right, tilt_left: tilt_left
					},
					success: function(data){


					   alert("Configuration save! Now click on PREVIEW")
					   document.getElementById("conf_name").value = null;
					   //aggiorno lista configurazioni
					   checkConf();


					},
					error: function(data) {console.error("Error save xml");}
			});

      }
      else{

          alert("Missing configuration name")
      }



}

//gestione configurazioni
function configurationChoice(){

     //mostro bottone elimina
     document.getElementById("removeConfButton").style.display = 'block';
     var xmlName = document.getElementById('conf_list').value;
     var a = document.getElementById('linkDownload');
     a.setAttribute("href", "/static/configurations/"+xmlName+".xml");
     a.setAttribute("download", xmlName+".xml");

     //carico dati xml

        $.ajax({
                    type: "GET",
					url: "/read_xml",
					dataType: "json",
					data: {xmlName : xmlName},
					success: function(data){


					   loadConf(data);

					   alert("Configuration loaded!")



					},
					error: function(data) {console.error("Error load configuration");}
			});

}

//modifica gui con dati caricati
function loadConf(data){

   var camerapos = data.cameraPos;

   $("#slider").slider('value',camerapos);
   $( "#custom-handle" ).text(camerapos+"°");
   pitch_camera_current = camerapos;
    $.ajax({
                    type: "GET",
					url: "/camera_mov",
					dataType: "json",
					data: {position : camerapos},
					success: function(data){

					},
					error: function(data) {console.error("Error load camera pos");}
			});
   $("#slider_right").slider('value',data.platePos);
   $( "#custom-handle_right" ).text(data.platePos+"°");
   yaw_plate_current = data.platePos;
   $.ajax({
                    type: "GET",
					url: "/plate_mov",
					dataType: "json",
					data: {yaw : data.platePos},
					success: function(data){

					},
					error: function(data) {console.error("Error load plate pos");}
			});
   if(data.light_one == "On"){

       document.getElementById("light_one").checked = true;
       $('#label_first').html("&nbsp;On");
       $.ajax({
					type: "GET",
					url: "/left_bright",
					dataType: "json",
					data: {bright: 1},
					success: function(data){

            		},
					error: function(data) {console.error("Error left bright");}
			});
   }
   else{

      $.ajax({
					type: "GET",
					url: "/left_bright",
					dataType: "json",
					data: {bright: 0},
					success: function(data){

            		},
					error: function(data) {console.error("Error left bright");}
			});

   }
   if(data.light_two == "On"){

      document.getElementById("light_two").checked = true;
      $('#label_second').html("&nbsp;On");
      $.ajax({
					type: "GET",
					url: "/right_bright",
					dataType: "json",
					data: {bright: 1},
					success: function(data){

            		},
					error: function(data) {console.error("Error right bright");}
			});
   }
   else{

       $.ajax({
					type: "GET",
					url: "/right_bright",
					dataType: "json",
					data: {bright: 0},
					success: function(data){

            		},
					error: function(data) {console.error("Error right bright");}
			});
   }

   llight1 = data.lateral_one;
   llight2 = data.lateral_two;
   llight3 = data.lateral_three;
   llight4 = data.lateral_four;
   bottomlight = data.bottom_light;
   toplight = data.top_light;

   fromConfSetLight();

   //pan tilt fari
    $.ajax({
					type: "GET",
					url: "/right_mov",
					dataType: "json",
					data: {pan: data.pan_right, tilt: data.tilt_right},
					success: function(){




            		},
					error: function(data) {console.error("Error right mov");}
			});


            $.ajax({
                                type: "GET",
                                url: "/left_mov",
                                dataType: "json",
                                data: {pan: data.pan_left, tilt: data.tilt_left},
                                success: function(data){

                                },
                                error: function(data) {console.error("Error left mov");}
                        });


}

//dalla configurazione salvata imposta luci
function fromConfSetLight(){

   $.ajax({
					type: "GET",
					url: "/light_intens",
					dataType: "json",
					data: {id: 1, value: llight1},
					success: function(data){



            		},
					error: function(data) {console.error("Error update light intensity");}
			});

	$.ajax({
					type: "GET",
					url: "/light_intens",
					dataType: "json",
					data: {id: 2, value: llight2},
					success: function(data){



            		},
					error: function(data) {console.error("Error update light intensity");}
			});

	$.ajax({
					type: "GET",
					url: "/light_intens",
					dataType: "json",
					data: {id: 3, value: llight3},
					success: function(data){



            		},
					error: function(data) {console.error("Error update light intensity");}
			});

	$.ajax({
					type: "GET",
					url: "/light_intens",
					dataType: "json",
					data: {id: 4, value: llight4},
					success: function(data){



            		},
					error: function(data) {console.error("Error update light intensity");}
			});


	$.ajax({
					type: "GET",
					url: "/light_intens",
					dataType: "json",
					data: {id: 5, value: toplight},
					success: function(data){



            		},
					error: function(data) {console.error("Error update light intensity");}
			});

	$.ajax({
					type: "GET",
					url: "/light_intens",
					dataType: "json",
					data: {id: 6, value: bottomlight},
					success: function(data){



            		},
					error: function(data) {console.error("Error update light intensity");}
			});

}

//slider luci rgb
function showSlider(id){

   selectedLight = id;
   $( "#slider-vertical" ).slider('enable');
   document.getElementById("slider-vertical").style.display = "block";
   var text_sl;
   switch(id){

      case '1': text_sl = "Lateral Light 1";
             $("#slider-vertical").slider('value',Math.ceil(llight1));
             $( "#custom-handle_vertical" ).text(llight1);
         break;
      case '2': text_sl = "Lateral Light 2";
             $("#slider-vertical").slider('value',Math.ceil(llight2));
             $( "#custom-handle_vertical" ).text(llight2);
         break;
      case '3': text_sl = "Lateral Light 3";
             $("#slider-vertical").slider('value',Math.ceil(llight3));
             $( "#custom-handle_vertical" ).text(llight3);
         break;
      case '4': text_sl = "Lateral Light 4";
             $("#slider-vertical").slider('value',Math.ceil(llight4));
            $( "#custom-handle_vertical" ).text(llight4);
         break;
      case '5': text_sl = "Top Light";
             $("#slider-vertical").slider('value',Math.ceil(toplight));
             $( "#custom-handle_vertical" ).text(toplight);
         break;
      case '6': text_sl = "Bottom Light";
             $("#slider-vertical").slider('value',Math.ceil(bottomlight));
             $( "#custom-handle_vertical" ).text(bottomlight);
         break;


   }

    $("#light_name").val(text_sl);
    document.getElementById("save_rgb").style.display = 'block';



}

//salvo stato luce rgb
function saveRGB(){

   //che luce sto considerando?
   switch($("#light_name").val()){

        case "Lateral Light 1":
               llight1 = $( "#slider-vertical" ).slider("value");
               break;
        case "Lateral Light 2":
              llight2 = $( "#slider-vertical" ).slider("value");
               break;
        case "Lateral Light 3":
              llight3 = $( "#slider-vertical" ).slider("value");
               break;
        case "Lateral Light 4":
               llight4 = $( "#slider-vertical" ).slider("value");
               break;
        case "Bottom Light":
               bottomlight = $( "#slider-vertical" ).slider("value");
               break;
        case "Top Light":
               toplight = $( "#slider-vertical" ).slider("value");
               break;

   }

   alert("Light value saved");


}

//check stato del sistema
function checkState(){

   $.ajax({
					type: "GET",
					url: "/get_state",
					dataType: "json",
					success: function(data){

                       var state = data.state;
                       switch(state){

                          case 'running': $("#text_system_state").text(" Running...");
                                          document.getElementById('system_image').src='/static/images/green_state.png'

                          break;
                          case 'init': $("#text_system_state").text(" Initialization...");
                                       document.getElementById('system_image').src='/static/images/init_state.png'
                          break;
                          case 'stopped': $("#text_system_state").text(" Stopped");
                                          document.getElementById('system_image').src='/static/images/red_state.png'
                          break;

                       }



					},
					error: function(data) {console.error("Error getting state");}
			});



}

function checkSlider(){

//controllo stato fari
	$.ajax({
					type: "GET",
					url: "/pt_right_state",
					dataType: "json",
					success: function(data){

                          if(data.bright>0){
                             document.getElementById("light_two").checked = true;
                             $("#label_second").text(" On");
                          }

                          pan_right = data.pan;
                          tilt_right = data.tilt;



					},
					error: function(data) {console.error("Error getting light state");}
			});

    $.ajax({
					type: "GET",
					url: "/pt_left_state",
					dataType: "json",
					success: function(data){

                          if(data.bright>0){
                             document.getElementById("light_one").checked = true;
                             $("#label_first").text(" On");
                          }
                          pan_left = data.pan;
                          tilt_left = data.tilt;


					},
					error: function(data) {console.error("Error getting light state");}
			});

	//controllo pitch camera
	$.ajax({
					type: "GET",
					url: "/camera_state",
					dataType: "json",
					success: function(data){

                          if(data.position>0){
                             $("#slider").slider('value',Math.ceil(data.position));
                             $( "#custom-handle" ).text(Math.ceil(data.position)+"°");

                          }
                          else{
                             $("#slider").slider('value',Math.ceil(data.position));
                             $( "#custom-handle" ).text(Math.ceil(data.position)+"°");
                          }
                          pitch_camera_current = data.position;



					},
					error: function(data) {console.error("Error getting camera state");}
			});

	//controllo yaw piatto
	$.ajax({
					type: "GET",
					url: "/plate_state",
					dataType: "json",
					success: function(data){

                          if(data.position>0){
                             $("#slider_right").slider('value',Math.ceil(data.position));
                             $( "#custom-handle_right" ).text(Math.ceil(data.position)+"°");

                          }
                          else{
                             $("#slider_right").slider('value',Math.floor(data.position));
                             $( "#custom-handle_right" ).text(Math.floor(data.position)+"°");
                          }
                          yaw_plate_current = data.position;
                          plate_moving = data.moving;


					},
					error: function(data) {console.error("Error getting camera state");}
			});

}

//funzione lista configurazioni
function checkConf(){


       removeOptions(document.getElementById("conf_list"));

        $.ajax({
					type: "GET",
					url: "/conf_files",
					dataType: "json",
					success: function(data){
					//creo menu tendina configuration
                        for (var key in data) {

                            for (var i=0; i< data[key].length; i++){

                                if (data.hasOwnProperty(key)) {
                                     //aggiungo elemento alla select
                                     var x = document.getElementById("conf_list");
                                     var option = document.createElement("option");
                                     option.text = data[key][i];
                                     option.value = data[key][i];
                                     x.appendChild(option);
                                  }
                            }

                        }
            		},
					error: function(data) {console.error("Error getting conf");}
			});

}

//all'avvio ottengo intensità attuale luci
function checkLightIntens(){

   $.ajax({
					type: "GET",
					url: "/light_state",
					dataType: "json",
					success: function(data){

                          llight1 = Math.ceil(data.light[0]);
                          llight2 = Math.ceil(data.light[1]);
                          llight3 = Math.ceil(data.light[2]);
                          llight4 = Math.ceil(data.light[3]);
                          toplight = Math.ceil(data.light[4]);
                          bottomlight = Math.ceil(data.light[5]);


					},
					error: function(data) {console.error("Error getting light intens state");}
			});

}

//pulisco select
function removeOptions(selectbox)
{
    var i;
    for(i = selectbox.options.length - 1 ; i > 0 ; i--)
    {
        selectbox.remove(i);
    }
}

//movimento faretti
function lrightup(){

        $.ajax({
					type: "GET",
					url: "/right_mov",
					dataType: "json",
					data: {pan: pan_right, tilt: tilt_right+step_light},
					success: function(data){

                        tilt_right = tilt_right +step_light;

            		},
					error: function(data) {console.error("Error move light");}
			});

}

function lrightdown(){

        $.ajax({
					type: "GET",
					url: "/right_mov",
					dataType: "json",
					data: {pan: pan_right, tilt: tilt_right- step_light},
					success: function(data){

                        tilt_right = tilt_right -step_light;

            		},
					error: function(data) {console.error("Error move light");}
			});

}
function lrightleft(){

        $.ajax({
					type: "GET",
					url: "/right_mov",
					dataType: "json",
					data: {pan: pan_right - step_light, tilt: tilt_right},
					success: function(data){

                        pan_right = pan_right -step_light;

            		},
					error: function(data) {console.error("Error move light");}
			});

}

function lrightright(){

        $.ajax({
					type: "GET",
					url: "/right_mov",
					dataType: "json",
					data: {pan: pan_right + step_light, tilt: tilt_right},
					success: function(data){

                        pan_right = pan_right +step_light;

            		},
					error: function(data) {console.error("Error move light");}
			});

}

//SX

function lleftup(){

        $.ajax({
					type: "GET",
					url: "/left_mov",
					dataType: "json",
					data: {pan: pan_left, tilt: tilt_left+step_light},
					success: function(data){

                        tilt_left = tilt_left +step_light;

            		},
					error: function(data) {console.error("Error move light");}
			});

}

function lleftdown(){

        $.ajax({
					type: "GET",
					url: "/left_mov",
					dataType: "json",
					data: {pan: pan_left, tilt: tilt_left- step_light},
					success: function(data){

                        tilt_left = tilt_left -step_light;

            		},
					error: function(data) {console.error("Error move light");}
			});

}
function lleftleft(){

        $.ajax({
					type: "GET",
					url: "/left_mov",
					dataType: "json",
					data: {pan: pan_left - step_light, tilt: tilt_left},
					success: function(data){

                        pan_left = pan_left -step_light;

            		},
					error: function(data) {console.error("Error move light");}
			});

}

function lleftright(){

        $.ajax({
					type: "GET",
					url: "/left_mov",
					dataType: "json",
					data: {pan: pan_left + step_light, tilt: tilt_left},
					success: function(data){

                        pan_left = pan_left +step_light;

            		},
					error: function(data) {console.error("Error move light");}
			});

}



//checkbox fari
function ck_first(){


            var checkboxvar = document.getElementById("light_one");
            var labelvar = document.getElementById("label_first");
            if (checkboxvar.checked == false){
                 $.ajax({
					type: "GET",
					url: "/left_bright",
					dataType: "json",
					data: {bright: 0},
					success: function(data){

                            $('#label_first').html("&nbsp;Off");

            		},
					error: function(data) {console.error("Error left bright");}
			});

            }
            else{
              $.ajax({
					type: "GET",
					url: "/left_bright",
					dataType: "json",
					data: {bright: 1},
					success: function(data){

                        $('#label_first').html("&nbsp;On");
            		},
					error: function(data) {console.error("Error left bright");}
			});


            }
}

function ck_second(){
            var checkboxvar = document.getElementById("light_two");
            var labelvar = document.getElementById("label_second");
            if (checkboxvar.checked == false){

            $.ajax({
					type: "GET",
					url: "/right_bright",
					dataType: "json",
					data: {bright: 0},
					success: function(data){

                        $('#label_second').html("&nbsp;Off");

            		},
					error: function(data) {console.error("Error right bright");}
			});


            }
            else{
              $.ajax({
					type: "GET",
					url: "/right_bright",
					dataType: "json",
					data: {bright: 1},
					success: function(data){

                             $('#label_second').html("&nbsp;On");

            		},
					error: function(data) {console.error("Error right bright");}
			});

            }
}

//pulire campi
function clearFields(){

     document.getElementById("weight").value=null;
     document.getElementById("desc").value=null;
     document.getElementById("obj_x").value=null;
     document.getElementById("obj_y").value=null;
     document.getElementById("obj_z").value=null;
     document.getElementById("obj_w").value=null;
     document.getElementById("prod_name").value=null;
     document.getElementById("rec_name").value=null;
     var element = document.getElementById('shape');
    element.value = "Bottle";


}

//funzione per scattare veramente la foto
function snapReal(sid,pitch,yaw){

        $.ajax({
					type: "GET",
					url: "/session_snap",
					dataType: "json",
					data: {sid : sid, cmd: "snap", pitch: pitch, yaw: yaw},
                    async: false,
					success: function(data){





					},
					error: function(data) {console.error("Error getting photo session");return 0;}
			});

}

//parte serie di foto
function startSnaps(){

   var step_angle;
   var camera_angle;
   session_name = document.getElementById("rec_name").value;
   document.getElementById("statusText").innerHTML = "Session in progress...";
   checkSliderInterval = setInterval(function(){checkSlider()}, 1000);


   saveService(session_name);
   if(session_name!=""){

      sessionStarted=1;
      $.ajax({
                    type: "GET",
					url: "/camera_mov",
					dataType: "json",
					data: {position : 90},
					success: function(data){

					$.ajax({
                    type: "GET",
					url: "/plate_mov",
					dataType: "json",
					data: {yaw : 0},
					success: function(data){




                          pitch_camera_current = 90;
                          yaw_plate_current = 0;
					      var e = document.getElementById("plate_angle");
                          plate_angle = parseInt(e.options[e.selectedIndex].value);
                          var f = document.getElementById("camera_angle");
                          camera_angle = parseInt(f.options[f.selectedIndex].value);
                          console.error("AAP"+pitch_camera_current);
                          plateMovingInterval = setInterval(function(){plateIsMoving(plateDirection,camera_angle,plate_angle)}, 1500);




					},
					error: function(data) {console.error("Error load plate pos");}
			});



					},
					error: function(data) {console.error("Error load camera pos");}
			});






   }
   else{

      alert("Missing session name field")
   }



}

//controllo quando si ferma il piatto
function plateIsMoving(plateDirection,camera_angle,plate_angle){

   $.ajax({
					type: "GET",
					url: "/plate_state",
					dataType: "json",
					success: function(data){

                          plateMoving = data.moving;
                          if(plateMoving==false){
                             clearInterval(plateMovingInterval);
                             cameraResetInterval = setInterval(function(){cameraResetIsMoving(plateDirection,camera_angle,plate_angle)}, 1500);

                          }



					},
					error: function(data) {console.error("Error getting camera state");return 0;}
			});

}

//la camera si mette nella posizione iniziale
function cameraResetIsMoving(plateDirection,camera_angle,plate_angle){


           $.ajax({
					type: "GET",
					url: "/camera_state",
					dataType: "json",
					success: function(data){


                          if(data.moving==false){
                             clearInterval(cameraResetInterval);
                             waitAndStart(plateDirection,camera_angle,plate_angle);

                          }



					},
					error: function(data) {console.error("Error getting camera state");}
			});


}

//faccio la prima foto in alto e abbasso la camera
function waitAndStart(plateDirection,camera_angle,plate_angle){

   console.error("Foto 90°");
   clearInterval(intervalWait);
   snapReal(session_name,pitch_camera_current,yaw_plate_current);
   //comincio a scendere
   $.ajax({
					type: "GET",
					url: "/camera_mov",
					dataType: "json",
					data: {position: 90-camera_angle},
					success: function(data){

                          pitch_camera_current = 90-camera_angle;
                          cameraMovingInterval = setInterval(function(){cameraIsMoving(plateDirection,camera_angle,plate_angle)}, 1000);


            		},
					error: function(data) {console.error("Error update pitch camera");}
			});


}

//controllo quando si ferma il movimento della camera
function cameraIsMoving(plateDirection,camera_angle,plate_angle){

    $.ajax({
					type: "GET",
					url: "/camera_state",
					dataType: "json",
					success: function(data){


                          if(data.moving==false){
                             clearInterval(cameraMovingInterval);
                             snapReal(session_name,pitch_camera_current,yaw_plate_current);
                             //comincio a girare il piatto
                             sendCommandToSnap(plateDirection,plate_angle, camera_angle);
                          }



					},
					error: function(data) {console.error("Error getting camera state");}
			});

}

//muovo piatto e camera incrementale
function sendCommandToSnap(plateDirection,plate_angle,camera_angle){

        clearInterval(snapIntervalId);
        if(pitch_camera_current<=-88 && sessionStarted==1){

           //foto
           console.error("Foto -90°")
           snapReal(session_name,pitch_camera_current,yaw_plate_current);
           stopSnaps();


        }
        else{

             stepPlate(plateDirection, plate_angle, camera_angle);


        }



}

//controllo quando il piatto smette di girare
function checkPlateMovement(plateDirection,camera_angle,plate_angle){

   $.ajax({
					type: "GET",
					url: "/plate_state",
					dataType: "json",
					success: function(data){

                          plateMoving = data.moving;
                          if(plateMoving==false){
                             clearInterval(plateMovingInterval);
                             snapReal(session_name,pitch_camera_current,yaw_plate_current);
                             stepPlate(plateDirection, plate_angle, camera_angle);
                          }



					},
					error: function(data) {console.error("Error getting camera state");return 0;}
			});

}



//muovo il piatto
function stepPlate(plateDirection, plate_angle, camera_angle){


  if(plateDirection==0){
    // da 0° a 360°

    if(yaw_plate_current<=358){


        yaw_plate_current = yaw_plate_current + plate_angle;
        updatePlatePos(yaw_plate_current);
        plateMovingInterval = setInterval(function(){checkPlateMovement(plateDirection,camera_angle,plate_angle)}, 1500);

   }
   else{

        //cambio modo di girare del piatto
        plateDirection=1;
        clearInterval(stepPlateInterval);
        //muovo la camera
        pitch_camera_current = pitch_camera_current - camera_angle;
        updatePitchCamera(pitch_camera_current);
        cameraMovingInterval = setInterval(function(){cameraIsMoving(plateDirection,camera_angle,plate_angle)}, 1000);
   }

  }
  else{
    // da 360° a 0°
    if(yaw_plate_current!=0){

        yaw_plate_current = yaw_plate_current - plate_angle;
        updatePlatePos(yaw_plate_current);
        plateMovingInterval = setInterval(function(){checkPlateMovement(plateDirection,camera_angle,plate_angle)}, 1500);

   }
   else{

        plateDirection=0;
        clearInterval(stepPlateInterval);
        pitch_camera_current = pitch_camera_current - camera_angle;
        updatePitchCamera(pitch_camera_current);
        cameraMovingInterval = setInterval(function(){cameraIsMoving(plateDirection,camera_angle,plate_angle)}, 1000);
   }

  }

}

//fermo la sessione
function stopSnaps(){

   sessionStarted=0;
   //resetto tutti i timer per sicurezza
   clearInterval(checkSliderInterval);
   clearInterval(snapIntervalId);
   clearInterval(intervalWait);
   clearInterval(stepPlateInterval);
   clearInterval(cameraMovingInterval);
   clearInterval(plateMovingInterval);
   clearInterval(cameraResetInterval);
   alert("Session stopped");
   document.getElementById("statusText").innerHTML = "Waiting...";

   document.getElementById("downloadZip").style.display = 'block';
   document.getElementById("downloadSessionD").style.display = 'block';

   document.getElementById("statusText").innerHTML = "";

}

//funzione download zip foto sessione
function downloadZip(){


    $.ajax({
					type: "GET",
					url: "/download_zip",
					dataType: "json",
					data: {sid: session_name},
					success: function(data){

                         var a = document.getElementById('linkDwSession');
                         a.setAttribute("href", data.url);
                         var link = document.getElementById('linkDownloadData');
                         link.setAttribute("href", "/static/sessions/session_"+session_url+".xml");
                         link.setAttribute("download", "session_"+session_url+".xml");



					},
					error: function(data) {console.error("Error set link zip");return 0;}
			});


}

//prendo la posizione attuale del piatto
function getPlatePosition(){

       var current;
       $.ajax({
					type: "GET",
					url: "/plate_state",
					dataType: "json",
					success: function(data){

                          current = data.position;
                          return current;


					},
					error: function(data) {console.error("Error getting camera state");return 0;}
			});


}

//muovo camera e piatto in tempo reale
function updatePitchCamera(value){

    pitch_camera_current = value;
    $.ajax({
					type: "GET",
					url: "/camera_mov",
					dataType: "json",
					data: {position: value},
					success: function(data){



            		},
					error: function(data) {console.error("Error update pitch camera");}
			});


}

function updatePlatePos(value){

     yaw_plate_current = value;
     $.ajax({
					type: "GET",
					url: "/plate_mov",
					dataType: "json",
					data: {yaw: value},
					success: function(data){



            		},
					error: function(data) {console.error("Error update pitch camera");}
			});

}

//gestioni luci bianche
function changeRGBLight(value){


     changeIntens(selectedLight,value);



}

//cambio intensità luce selezionata
function changeIntens(id,value){



      $.ajax({
					type: "GET",
					url: "/light_intens",
					dataType: "json",
					data: {id: id, value: value},
					success: function(data){

                         checkLightIntens();

            		},
					error: function(data) {console.error("Error update light intensity");}
			});

}

//foto preview
function snapshotStart(){

    $.ajax({
					type: "GET",
					url: "/preview_snap",
					dataType: "json",
					success: function(data){



                         intervalPreview = setInterval(function(){checkPreview()}, 1000);




            		},
					error: function(data) {console.error("Error snap preview");}
			});


}

//funzione che controlla se foto scattata
function checkPreview(){


    $.get('/static/preview/preview.jpeg')
    .done(function() {
        // Do something now you know the image exists.
        document.getElementById('snapshot').src = '/static/preview/preview.jpeg';
        document.getElementById('big_snap').src = '/static/preview/preview.jpeg';

        clearInterval(intervalPreview);

    }).fail(function() {
        // Image doesn't exist - do something else.

    })



}

//salvo dati sessione
function saveService(session_name){


   var weight = document.getElementById("weight").value;
   var desc = document.getElementById("desc").value;
   var obj_x = document.getElementById("obj_x").value;
   var obj_y = document.getElementById("obj_y").value;
   var obj_z = document.getElementById("obj_z").value;
   var obj_w = document.getElementById("obj_w").value;
   var prod_name = document.getElementById("prod_name").value;

   var e = document.getElementById("shape");
   var shape = e.options[e.selectedIndex].value;
   e = document.getElementById("plate_angle");
   var plate_angle = e.options[e.selectedIndex].value;
   e = document.getElementById("camera_angle");
   var camera_angle = e.options[e.selectedIndex].value;

   $.ajax({
					type: "GET",
					url: "/save_session",
					dataType: "json",
					data: {session_name: session_name,prod_name : prod_name, desc : desc, shape: shape, obj_x: obj_x,
					obj_y : obj_y, obj_z: obj_z, obj_w: obj_w, weight: weight, plate_angle: plate_angle, camera_angle: camera_angle
					},
					success: function(data){

					   session_url = data.url;
					   downloadZip();

            		},
					error: function(data) {console.error("Error save session");}
			});



}

//funzione per riavviare il sistema
function restartSystem(){


             checkState();

              $.ajax({
					type: "GET",
					url: "/restart",
					dataType: "json",
					success: function(data){

                            checkState();


            		},
					error: function(data) {console.error("Error restart system");}
			});

}




$( function() {
   var $lightbox = $('#lightbox');
  /* slider camera position */
    var handle = $( "#custom-handle" );
    $( "#slider" ).slider({
    min: -90,
    max: 90,
      create: function() {
        handle.text( $( this ).slider( "value" ) + "°" );
      },
      slide: function( event, ui ) {
        handle.text( ui.value + "°");
        cameraPositionValue( ui.value );
        updatePitchCamera(ui.value);
      }
    });

    var handle_right = $( "#custom-handle_right" );

    $( "#slider_right" ).slider({
    min: 0,
    max: 360,
      create: function() {
        handle_right.text( $( this ).slider( "value" ) + "°" );
      },
      slide: function( event, ui ) {
        handle_right.text( ui.value + "°");
        updatePlatePos(ui.value);
      }
    });

    var handle_diaf = $( "#custom-handle_diaf" );

    $( "#slider_diaf" ).slider({
      create: function() {
        handle_diaf.text( $( this ).slider( "value" ) );
      },
      slide: function( event, ui ) {
        handle_diaf.text( ui.value );
      }
    });

    var handle_time = $( "#custom-handle_time" );

    $( "#slider_time" ).slider({
      create: function() {
        handle_time.text( $( this ).slider( "value" ) );
      },
      slide: function( event, ui ) {
        handle_time.text( ui.value );
      }
    });

    var handle_iso = $( "#custom-handle_iso" );

    $( "#slider_iso" ).slider({
      create: function() {
        handle_iso.text( $( this ).slider( "value" ) );
      },
      slide: function( event, ui ) {
        handle_iso.text( ui.value );
      }
    });

    var handle_wbal = $( "#custom-handle_wbal" );

    $( "#slider_wbal" ).slider({
      create: function() {
        handle_wbal.text( $( this ).slider( "value" ) );
      },
      slide: function( event, ui ) {
        handle_wbal.text( ui.value );
      }
    });

    var handle_vertical = $( "#custom-handle_vertical" );

    $( "#slider-vertical" ).slider({
      create: function() {
        handle_vertical.text( $( this ).slider( "value" ) );
      },
      slide: function( event, ui ) {
        handle_vertical.text( ui.value );
        changeRGBLight(ui.value);
      }
    });
    $( "#slider-vertical" ).slider('disable');




    $('[data-target="#lightbox"]').on('click', function(event) {
        var $img = $(this).find('img'),
            src = $img.attr('src'),
            alt = $img.attr('alt'),
            css = {
                'maxWidth': $(window).width() - 100,
                'maxHeight': $(window).height() - 100
            };

        $lightbox.find('.close').addClass('hidden');
        $lightbox.find('img').attr('src', src);
        $lightbox.find('img').attr('alt', alt);
        $lightbox.find('img').css(css);
    });

    $lightbox.on('shown.bs.modal', function (e) {
        var $img = $lightbox.find('img');

        $lightbox.find('.modal-dialog').css({'width': $img.width()});
        $lightbox.find('.close').removeClass('hidden');
    });

    //controllo stato del sistema ogni 10 secondi
    setInterval(function(){checkState()}, 5000);
    checkState();
    checkSlider();
    checkLightIntens();
    //controllo lista configurazioni
    checkConf();



  } );