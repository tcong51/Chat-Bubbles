var element = $('.floating-chat');


setTimeout(function() {
    element.addClass('enter');
}, 100);

element.click(openElement);

function openElement() {
  document.getElementById("myForm").style.display="block";
}


//saaaaaaaaaaaaaa
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
  }, 1500 );
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
function fakeMessage() {
  if ($('.message-input').val() != '') {
    return false;
  }
  if(i == 0){
  $('<div class="message loading new"><figure class="avatar"><img src="../dist/images.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();
  setTimeout(function() {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="../dist/images.png" /></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
    i++;
  }, 4000);
  }else{
    $('<div class="message loading new"><figure class="avatar"><img src="../dist/images.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
    updateScrollbar();
    var co ;
    $.post("http://localhost:5005/webhooks/rest/webhook", JSON.stringify( { "message": note} )).done(function(data){
          $.each (data, function (key, item){
           var hix=  item['text'];
           co = hix;
        });
        });


    setTimeout(function() {
      
      $('.message.loading').remove();
      $('<div class="message new"><figure class="avatar"><img src="../dist/images.png" /></figure>' + co + '</div>').appendTo($('.mCSB_container')).addClass('new');
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