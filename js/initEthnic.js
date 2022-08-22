// Copyright (c) 2012  Patrick Wilkes
// Date Created: 10/04/12

var ethnicDropInstruction = new Object();
var ethnicDrop = new Object();
var ethnicCategoryArray= new Array();
var ethnicCategoryName= new Array();
var ethnicAccordionMenu;


function ethnicLoadXML(){

	//add support message for interactives on mobile
	if(!$('.AIsupport').length){
		$('#div_content').prepend('<div class="IAsupport">The Ethnic Map is not available on mobile devices.</div>');
	}

		 var dragTarget;
     var dragTargetX;
		 var x_initial_drag=400;
		 var y_initial_drag=200;
		 var x_initial_dragRight=510;
		 var file="xml/co_" + projCode + "_ethnicHTML5.xml";
		 //load XML
	     var xmlObj = new load_XML(file);
		  	 //parse vaules
			 var ethnicDropObj = xmlObj.tagNameElement("data_xml");
			 ethnicDrop.title= ethnicDropObj[0].getAttribute('title');

			 ethnicDrop.subtitle= ethnicDropObj[0].getAttribute('subtitle');
			 ethnicDrop.backgroundImage= ethnicDropObj[0].getAttribute('backgroundImage');
			 ethnicDrop.overlayTextImage= ethnicDropObj[0].getAttribute('overlayTextImage');

		     var intr = xmlObj.tagNameElement("instructions");
		     var content = xmlObj.tagNameElement("content", intr[0]);
			 ethnicDropInstruction.title= intr[0].getAttribute('title');
		     ethnicDropInstruction.content= content[0].firstChild.nodeValue;


				 var categoryArr = xmlObj.tagNameElement("category");

			 	 for(var f = 0; f < categoryArr.length; f++){
					 		//retrieve the title of each category
							var categoryOBJ = new Object();
			 	 			categoryOBJ.title = categoryArr[f].getAttribute('title');

							var itemArray = xmlObj.tagNameElement("item", categoryArr[f]);
							var items = new Array();
							for(var i = 0; i < itemArray.length; i++){
								 var obj = new Object();

								 obj.title = itemArray[i].getAttribute('title');
								 obj.x = itemArray[i].getAttribute('X');
								 obj.y = itemArray[i].getAttribute('Y');
								 obj.dropBox_X= itemArray[i].getAttribute('dropBox_X');
								 obj.dropBox_Y = itemArray[i].getAttribute('dropBox_Y');
								  obj.overlay = itemArray[i].getAttribute('overlay');
								    obj.overlay_X = itemArray[i].getAttribute('overlay_X');
								 obj.overlay_Y = itemArray[i].getAttribute('overlay_Y');
								 obj.dropBoxWidth = itemArray[i].getAttribute('dropBoxWidth');
								 obj.dropBoxHeight = itemArray[i].getAttribute('dropBoxHeight');
								 obj.lineDegree = itemArray[i].getAttribute('lineDegree');
				 				 obj.lineWidth = itemArray[i].getAttribute('lineWidth');
								 obj.image = itemArray[i].getAttribute('image');
								 obj.copyright = itemArray[i].getAttribute('copyright');
                 obj.copyMarginRight = itemArray[i].getAttribute('copyMarginRight');
								 var itemChilds = itemArray[i].childNodes;
									 for(var j=0; j< itemChilds.length; j++){
										 var xmlNode = itemChilds[j];
										 switch (xmlNode.nodeName){
													case 'content':
															 obj.content = parseInlineNodes(xmlNode).innerHTML;
													break;
													case 'hint':
															 obj.hint = parseInlineNodes(xmlNode).innerHTML;
													break;
										 }//end switch
									 }//end for
									items[i]=obj;
									var text = obj.title.replace(/[^a-zA-Z 0-9]+/g,'');
									ethnicCategoryName[text]=obj;
							 }//end for
							 categoryOBJ.items= items;
                         ethnicCategoryArray[f] = categoryOBJ;
				 }//end for

}

function loadEthnic_HTML5() {

				//load XML
				ethnicLoadXML();

				//main div
				var ethnicDropHTML5 = ce('div');
	            ethnicDropHTML5.setAttribute('id', "ethnicDropHTML5");
				document.getElementById('HTML5').appendChild(ethnicDropHTML5);

				//map BG
				var box = ce('div');
				box.setAttribute('id', "map");
				var string= "url(\'images/ethnic/"+ ethnicDrop.backgroundImage + "\')";
				box.style.backgroundImage = string;
				document.getElementById('ethnicDropHTML5').appendChild(box);

				//header
				var ethnicHeader = ce('div');
	      ethnicHeader.setAttribute('id', "ethnicHeader");
      	ethnicHeader.innerHTML = "<div class=mainTitle>" + ethnicDrop.title + " | </div> <div id=ethnicSubHeader>Ethnic Groups</div>";
      	document.getElementById('ethnicDropHTML5').appendChild(ethnicHeader);

				var popUpImage = ce('div');
	            popUpImage.id= "popUpImage";
				document.getElementById('ethnicDropHTML5').appendChild(popUpImage);

				//right menu
				box = ce('div');
	                box.setAttribute('id', "ethnicDropRightMenu");
					document.getElementById('map').appendChild(box);

				//build accordion
				box = ce('div');
	                box.setAttribute('id', "accordion");
					document.getElementById('ethnicDropRightMenu').appendChild(box);

				//alert(ethnicCategoryArray[0].children[1].getAttribute('title'));
				//buttonHeader divs
				for (i=0; i < ethnicCategoryArray.length; i++){
					//header
					box = ce('div');
					var category = ethnicCategoryArray[i].title;

					box.setAttribute('id', category);
					box.className = 'buttonHeader';
					box.innerHTML = category;
					document.getElementById('accordion').appendChild(box);

					//holder
					box = ce('div');
	                box.setAttribute('id', "buttonHolder"+[i]);
					box.className = 'buttonHolder';
					var headerName = category;
					document.getElementById('accordion').appendChild(box);

						//drags and drops
						for (j=0; j < ethnicCategoryArray[i].items.length; j++){
							var button = ce('div');
							var text = ethnicCategoryArray[i].items[j].title;

								button.innerHTML = text;
								text = text.replace(/[^a-zA-Z 0-9]+/g,'');

							button.setAttribute('id', text);
							button.className = 'drag';

							document.getElementById('buttonHolder'+[i]).appendChild(button);

									var imgOverlayID = ethnicCategoryArray[i].items[j].overlay;
									var imgOverlayLeft = ethnicCategoryArray[i].items[j].overlay_X;
									var imgOverlayTop = ethnicCategoryArray[i].items[j].overlay_Y;
									var imgPath = "url(\'images/ethnic/"+ imgOverlayID + "\')";

									var box = ce('div');
									overlayId = text.replace(' ', '_');
									box.setAttribute('id', overlayId+"_overlay");
										box.className = 'imgOverlay';
										box.style.left=imgOverlayLeft+"px"
										box.style.top=imgOverlayTop+"px"
										box.style.opacity="1"
										box.style.backgroundImage = imgPath;
										document.getElementById('map').appendChild(box);
										box.style.display = "none";

									var dropAreaID = text+"_drop"
									var dropX = ethnicCategoryArray[i].items[j].dropBox_X;
									var dropY = ethnicCategoryArray[i].items[j].dropBox_Y;
									var dropW = 110; // should always be 110
									var dropH = 16; //should always be 16
									var circleID = text+"_circle"
									var circleX = ethnicCategoryArray[i].items[j].x;
									var circleY = ethnicCategoryArray[i].items[j].y;

									dropAreaID=dropAreaID.replace(/[" "]/g, "_");

									var ethnicDropOutsideBox = ce('div');
										ethnicDropOutsideBox.setAttribute('id', text+"_outsideBox");
										ethnicDropOutsideBox.className = 'ethnicDropOutsideBox';
										document.getElementById('map').appendChild(ethnicDropOutsideBox);


									circleID=circleID.replace(/[" "]/g, "_");
									 var circleImg = ce('div');
										circleImg.className = 'circleImg';
										circleImg.setAttribute('id', circleID);
										circleImg.style.left=circleX+"px";
										circleImg.style.top=circleY+"px";
										ethnicDropOutsideBox.appendChild(circleImg);

									var dropArea = ce('div');
										dropArea.setAttribute('id', dropAreaID);
										dropArea.className = 'drop';
										dropArea.style.left=dropX+"px";
										dropArea.style.top=dropY+"px";
										dropArea.style.width=dropW+"px";
										dropArea.style.height=dropH+"px";
										ethnicDropOutsideBox.appendChild(dropArea);

                    //instead of loading 10,000 lines of jsPmub code just to make connectors, let's just write this simple function ourselves
                    if(Number(circleX) <= Number(dropX)){
                      var pathEndX = Number(dropX) + 2;
                    } else {
                      var pathEndX = Number(dropX) + 110;
                    }

                    if(Number(circleY) <= Number(dropY)){
                      var pathEndY = Number(dropY);
                    } else {
                      var pathEndY = Number(dropY) + 19;
                    }

                    $(ethnicDropOutsideBox).append('<svg style="position:absolute;left:0;top:0" width="650" height="360" pointer-events="none" position="absolute" version="1.1" xmlns="http://www.w3.org/1999/xhtml"><path d="M '+ (Number(circleX)+3) +' '+ (Number(circleY)+3) +' L '+ pathEndX +' '+ pathEndY +'" pointer-events="all" version="1.1" xmlns="http://www.w3.org/1999/xhtml" style="" fill="none" stroke="white" stroke-width="1"></path></svg>');

									ethnicDropOutsideBox.style.display = "none";

						}

				}

				//instrutions
				box = ce('div');
	            box.setAttribute('id', "ethnicDropWelcomeBox");
				document.getElementById('map').appendChild(box);

				//hint
				box = ce('div');
	            box.setAttribute('id', "ethnicDropHintBox");
				document.getElementById('ethnicDropHTML5').appendChild(box);
				document.getElementById('ethnicDropHintBox').style.display="none";

				//help button
				box = ce('div');
	            box.setAttribute('id', "InstrImg");
				document.getElementById('map').appendChild(box);
				document.getElementById('InstrImg').innerHTML='?';

				//show help box
				document.getElementById('InstrImg').onclick=function(){
          if($('#ethnicDropWelcomeBox').is(':visible')){
            $('#ethnicDropWelcomeBox').fadeOut('fast');
          } else {
            $('#ethnicDropWelcomeBox').fadeIn('fast');
          }
				}
				ethnicDropWelcomeIntr(ethnicDropInstruction.content)

		//run jquery accordion, drag and drop
		$(function() {
				//accordion UI
				/*$( "#accordion" ).accordion({
					collapsible: true,
					active: false,
					autoHeight: false,
					header: 'div.buttonHeader'
					}); */

				 //header button clicks
				// $(".buttonHeader").click(function() {
					 //hide instructions
							//document.getElementById('ethnicDropWelcomeBox').style.display="none";
					//var name = $( this ).attr( "id" );
					var name = $(".buttonHeader").attr( "id" );

					for (i=0; i < ethnicCategoryArray.length; i++){
						var title = ethnicCategoryArray[i].title;

						if(name==title){

							for (j=0; j < ethnicCategoryArray[i].items.length; j++){
								var text= ethnicCategoryArray[i].items[j].title;
								text = text.replace(/[^a-zA-Z 0-9]+/g,'');
								var showDrop = text+"_outsideBox";
								document.getElementById(showDrop).style.display="block";
							}
						}else{
							for (j=0; j < ethnicCategoryArray[i].items.length; j++){
									var text= ethnicCategoryArray[i].items[j].title
								text = text.replace(/[^a-zA-Z 0-9]+/g,'');
								var hideDrop = text+"_outsideBox";
								document.getElementById(hideDrop).style.display="none";
							}
						}

					}

				// });

				//drag functionality
				$( ".drag" ).draggable({
					revert: true,
					start: function(event, ui) {
							//hide instructions
							document.getElementById('ethnicDropWelcomeBox').style.display="none";

								//show hint on drag
								var name = $( this ).attr( "id" );
								document.getElementById('ethnicDropHintBox').innerHTML="";
		 						document.getElementById('ethnicDropHintBox').style.display="block";
		 						var string = ethnicCategoryName[name].hint;
								document.getElementById('ethnicDropHintBox').innerHTML= string;
							}
				});

				//drop functionality
				$( ".drop" ).droppable({
          hoverClass: "targetHover",
					over: function(event, ui){
		        var name = $( this ).attr( "id" );
		        name = name.replace("_drop", "");
		        $('#'+ name + '_overlay').show();
		      },
		      out: function(event, ui){
		        $('.imgOverlay').hide();
		      },
								drop: function( event, ui ) {
									$('.imgOverlay').hide();
								document.getElementById('ethnicDropHintBox').style.display="none";
								var imgID = $(ui.draggable).attr( "id" );
								var dropTargetID= $( this ).attr( "id" );
								dragTargetID = imgID.replace(/[" "]/g, "_");
								dropTargetID = dropTargetID.replace("_drop", "");

								if(dragTargetID==dropTargetID){
                  $(this).addClass('clickable');
									$(ui.draggable).css('display', 'none');
									$(this).css('height', 'auto');
									$(this).css('background-color', '#2d2d2d');
									$(this).css('border-color:', '#2d2d2d');
									$(this).css('color', '#fcfcc8'); //DO NOT MODIFY
									$(this).css('padding', '2px 2px 5px 3px'); //DO NOT MODIFY
									$(this).html("<b>"+ethnicCategoryName[imgID].title+"</b>");

									//hideethnicAccordionMenu();

									var copyright = ethnicCategoryName[imgID].copyright;
                  copyright = copyright.replace(/©/gm,"");
                  var copyMarginRight = ethnicCategoryName[imgID].copyMarginRight;

									//show image and region description popup
									var imageName = ethnicCategoryName[imgID].image;
									//imageName=imageName.replace(/[" "]/g, "_");

									//var imgSM = "images/ethnic/Drop/thumbs/" + imageName;
									var imgLG = "images/ethnic/" + imageName;
									var string = imgID+" | "+ethnicCategoryName[imgID].content;

									showPicture(string, imgLG, copyright, copyMarginRight);
								}//end if
						}//end drop
				});//end droppable

				$(".drop").mouseenter(function() {
						var name = $( this ).attr( "id" );
						name = name.replace("_drop", "");
						//name = name.replace(/["_"]/g, " ");


						var showOverlay = name+"_overlay";
						//alert (showOverlay);
						document.getElementById(showOverlay).style.display = "block";
				});

				$(".drop").mouseleave(function() {
						var name = $( this ).attr( "id" );
						name = name.replace("_drop", "");
						$('#'+ name +"_overlay").hide();

				});

				$(".drop").click(function() {
						var name = $( this ).attr( "id" );
						name = name.replace("_drop", "");
						name = name.replace(/["_"]/g, " ");
						var color = $( this ).css("color");

						//alert(name)
						//convert color RGB to hex for comparison
						var parts = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
						delete (parts[0]);
						for (var i = 1; i <= 3; ++i) {
							parts[i] = parseInt(parts[i]).toString(16);
							if (parts[i].length == 1) parts[i] = '0' + parts[i];
						}
						var hexString ='#'+parts.join('').toUpperCase();

							//check to see if the button has been dropped on yet
							if (hexString=='#FCFCC8'){
								//check to see if the accordion is already open
								if(ethnicAccordionMenu==true){
									hideethnicAccordionMenu();
								}
								var copyright = ethnicCategoryName[name].copyright;
                var copyMarginRight = ethnicCategoryName[name].copyMarginRight;

								//show image and region description popup
								var imageName = ethnicCategoryName[name].image;
								//var imgSM = "images/geoDrop/thumbs/" + imageName;
								var imgLG = "images/ethnic/" + imageName;
								var string = name+" | "+ethnicCategoryName[name].content;

								showPicture(string, imgLG, copyright, copyMarginRight);
							}

					 });
			});

		}

function parseInlineNodes(xmlNode){
		 var inlPart = ce('span');
			for(var i=0; i<xmlNode.childNodes.length; i++){
				var hPart;
				var xPart = xmlNode.childNodes[i];
					if(xPart.nodeName == '#text'){
							hPart = ce('span');
							hPart.appendChild(ctn(xPart.data));

					}  else {
							hPart = ce(xPart.nodeName); //html tags (b, u, i etc.)
							if(xPart.firstChild)
									hPart.appendChild(ctn(xPart.firstChild.data));
					}
					inlPart.appendChild(hPart);
			}
			return inlPart;;
	}


function ce(name){
		var dn = document.createElement(name);
		return dn;
	}
function ctn(from){
		 var tn = document.createTextNode(from);
			return tn;
	}
function isMobile(){
	//if (mobileTest)
			//var mobile = (/safari|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
	//else
			var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
    if (mobile)
	  		return true;
	 else
	  		return false;

}

function ethnicDropWelcomeIntr(content)
{
  var string = '<div class="ethnicDropInstrTitle">Instructions</div><div id="ethnicDropCloseX" class="close">X</div> <div id="ethnicDropWelcomeContent">'+content+'</div>';

   document.getElementById('ethnicDropWelcomeBox').innerHTML=string;

  document.getElementById('ethnicDropCloseX').onclick= function () {
      $('#ethnicDropWelcomeBox').fadeOut('fast');
  }
}

function showPicture(text, url, copyRight, copyMarginRight)
{
	document.getElementById('popUpImage').style.display="block";
	document.getElementById('popUpImage').innerHTML="";
	var popUpImage = document.getElementById('popUpImage');
	var popUpTop = ce('div');
	      popUpTop.id= "popUpTop";
				popUpImage.appendChild(popUpTop);
				var closer = ce('span');
	      closer.id= "closeBtn";
        closer.className = "close";
        closer.innerHTML = 'X';
				closer.onclick = function (event) {
          document.getElementById('popUpImage').style.display="none";  event.stopPropagation();
        };
				popUpImage.appendChild(closer);

				var pictureImage = ce('img');
	            pictureImage.id= "pictureImage";
				pictureImage.setAttribute("src", url);
				popUpImage.appendChild(pictureImage);

				var textPopUp = ce('div');
	            textPopUp.id= "textPopUp";
				textPopUp.innerHTML=text;
				popUpImage.appendChild(textPopUp);
			    var textHeight = document.getElementById('textPopUp').offsetHeight;
				document.getElementById('textPopUp').style.height = textHeight + "px";
				document.getElementById('textPopUp').style.top= (376 - (textHeight +10)) + "px";
				document.getElementById('textPopUp').style.padding= "5px 5px 10px 10px";
				//document.getElementById('pictureImage').style.height = (376 - ((textHeight +10)+30)) + "px";
			//copyright
				var copyrightDiv = ce('div');
				copyrightDiv.setAttribute('id', "copyrightDiv");
				copyrightDiv.innerHTML=copyRight;
				popUpImage.appendChild(copyrightDiv);
				 var copyRightHeight = document.getElementById('copyrightDiv').offsetHeight;
				 var copyRightWidth = document.getElementById('copyrightDiv').offsetWidth;

				 document.getElementById('copyrightDiv').style.height = copyRightHeight + "px";
				copyrightDiv.style.top = (372 - ((textHeight +12)+copyRightHeight)) + "px";
				if(copyMarginRight){
          copyrightDiv.style.right = copyMarginRight + "px";
        } else {
          copyrightDiv.style.right = "5px";
        }

}
