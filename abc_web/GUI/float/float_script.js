// GUI_chat
var element = $('.floating-chat');

setTimeout(function() {
    element.addClass('enter');
}, 100);

element.click(openElement);

function openElement() {
  document.getElementById("myForm").style.display="block";
}

function dong() {
  document.getElementById("myForm").style.display="none";
}
var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

$(window).load(function() {
  $messages.mCustomScrollbar();
  setTimeout(function() {
    fakeMessage();
  }, 1500);
});


function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate(){
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    $('<div class="checkmark-sent-delivered" style="color:blue;">&check;</div>').appendTo($('.message:last'));
    $('<div class="checkmark-read">&check;</div>').appendTo($('.message:last'));
  }
}
var note;
function insertMessage() {
  var msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  note = msg;
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  updateScrollbar();
  setTimeout(function() {
    fakeMessage();
  }, 2000 );
}

$('.message-submit').click(function() {
  insertMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
})

var Fake = [
  'Hi! A/c muốn xuất báo cáo?',

]
var dataJson;
function fakeMessage() {
  if ($('.message-input').val() != '') {
    return false;
  }
  if(i == 0){
  $('<div class="message loading new"><figure class="avatar"><img src="./float/images.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();
  setTimeout(function() {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="./float/images.png" /></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
    i++;
  }, 2000);
  }else{
    $('<div class="message loading new"><figure class="avatar"><img src="./float/images.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
    updateScrollbar();
    var content_reponse_GUI ;
    $.post("http://localhost:5005/webhooks/rest/webhook", JSON.stringify( { "message": note} )).done(function(data){
      var jsonSocket = JSON.stringify(data);
      var length_json = jsonSocket.length;
      if (length_json< 1000) {
        $.each (data, function (key, item){
            var content_request=  item['text'];
            content_reponse_GUI =  content_request;
          });
      }
      else{ 
        dataJson = data[0]['custom'];
        var dataToTable = dataJson['data'];
        buildTable(dataToTable);
        content_reponse_GUI = "Vui lòng đợi kết quả!";
       
      }
        
    });
    setTimeout(function() {
      $('.message.loading').remove();
      $('<div class="message new"><figure class="avatar"><img src="./float/images.png" /></figure>' + content_reponse_GUI + '</div>').appendTo($('.mCSB_container')).addClass('new');
      setDate();
      updateScrollbar();
     
      i++;
    }, 4000);
  }
}

$('.button').click(function(){
  $('.menu .items span').toggleClass('active');
   $('.menu .button').toggleClass('active');
});

// Table
function buildTable(data){
  
    var tem_h = document.getElementById('temp_head');
    var tem_b = document.getElementById('tem_body');
    var tem_c = document.getElementById('temp_content');
    tem_h.innerHTML = '';
    tem_b.innerHTML = '';
    tem_c.innerHTML = '';
	for(var i = 0 ; i< data['columns'].length ; i++){
			var row = `
							<td scope="col"  class="table-primary" colspan='${data['columns'][i]['columns'].length} ' style="text-align:center">${data['columns'][i]['Header']}</td>			
					  `;
			tem_h.innerHTML += row;
        for(var j= 0 ;j< data['columns'][i]['columns'].length; j++){
            var row_collect = `
							<td scope="col" class="table-secondary" style="text-align:center">${data['columns'][i]['columns'][j]['Header']}</td>			
					  `;
            tem_b.innerHTML += row_collect;
        }
    }       
    //Content-table
    for(var i = 0 ; i< data['data'].length ; i++){ 
        var id_temp  = 'row_';
        id_temp = id_temp + i;
        tem_c.innerHTML += "<tr id="+`${id_temp}`+"></tr>";
        var tem_contnet = document.getElementById(`${id_temp}`);
        var swap_position = data['data'][i].ten_tinh
        data['data'][i].ten_tinh = data['data'][i].nam;
        data['data'][i].nam = swap_position;
      for(var con_content in data['data'][i]){
        if(con_content != 'id_tinh'){
            if(data['data'][i][con_content] != null){
                var content_row =`<td scope="col">${data['data'][i][con_content]}</td>`;
                tem_contnet.innerHTML += content_row;  
            } 
        }
    }
      
    }  
}
// buildTable(dataToTable);


//Voice

function voice(){
        var contentSearch = document.getElementById("typing_text");   
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
        var grammar = '#JSGF V1.0;'
        var recognition = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.lang = 'vi-VN';
        recognition.interimResults = false;

        recognition.onresult = function(event) {
            var lastResult = event.results.length - 1;
            var content = event.results[lastResult][0].transcript;
            contentSearch.value = content;

        };

        recognition.onspeechend = function() {
            recognition.stop();
            $(document).ready(function(){ 
              $('#sendt')[0].click(function(){
              }); 
         });
            
        };

        recognition.onerror = function(event) {
            message.textContent = 'Error occurred in recognition: ' + event.error;
        }

        document.querySelector('#btnTalk').addEventListener('click', function(){
            recognition.start();
            
        });
}