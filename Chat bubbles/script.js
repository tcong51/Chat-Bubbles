
$(document).ready(async function () {
  var namHienTai = moment().format('YYYY');
  var thangHienTai = moment().format('MM');
  $('#nam-select').val(namHienTai).trigger('change');
  $('#thang-select').val(thangHienTai).trigger('change');
  
  
});
/**
 *  Xem bao cao
 * @param {Object}
 */

async function TraCuu(json) {
  
  const [error, result] = await cty9ExecApi({
    type: 'POST',
    url: 'https://apiutil.mobifone9.vn/voicecmd/v1/get-report?a=select',
    data: json
  });

  if (error) {
    console.log("error");
    return false;
  }

  if (result.mess == 'Lấy số liệu báo cáo thành công') {
    document.getElementById("status").innerHTML = result.mess;
    renderTable(result.data);
    return true; 
  }else{
    document.getElementById("status").innerHTML = result.mess;
    console.log(result.mess);
    document.getElementById("report").innerHTML = "";
  }
  
  
}

//--- Render --- //
const defaultConfigs = {
  fixedColumns: 1,
};

function renderTable(dataResp, configs = defaultConfigs) {
  const { columns, data } = dataResp;

  // --------------------------------------------------------------------------
  // RENDER HEDER
  let tr1 = [];
  let tr2 = [];
  let columnsTable = [];

  tr1.push('<tr>');
  tr2.push('<tr>');

  columns.forEach((col) => {
    tr1.push(`<th colspan="${col.columns.length}">${col.Header}</th>`);

    col.columns.forEach((subCol) => {
      tr2.push(`<th>${subCol.Header}</th>`);
      columnsTable.push({ data: subCol.accessor });
    });
  });

  tr1.push('</tr>');
  tr2.push('</tr>');
  $('#report').html(
    '<table class="table table-bordered table-hover my-3 text-nowrap" style="width: 100%" id="dataTable"><thead class="thead-light"></thead></table>',
  );
  $('#dataTable thead').html(tr1.join('') + tr2.join(''));

  // --------------------------------------------------------------------------
  // RENDER TABLE
  $('#dataTable').DataTable({
    data: data,
    columns: columnsTable,
    info: false,
    dom: 'Bfrtip',
    ordering: false,
    scrollX: true,
    fixedColumns: { leftColumns: configs.fixedColumns },
    pageLength: 30,
    paging: false,
    buttons: [
      {
        extend: 'excelHtml5',
        text: '<i class="far fa-file-excel"></i> Excel',
        className: 'btn-success ',
      },
    ],
  });
}
//FLoat
// GUI_chat

var element = $('.floating-chat');

setTimeout(function() {
    element.addClass('enter');
}, 100);

element.click(openElement);

function openElement() {
  document.getElementById("myForm").style.display="block";
}

function CloseGUI() {
  document.getElementById("myForm").style.display="none";
  
}
var $messages = $('.messages-content'),
    d, h, m,
    i = 0;
 
$(window).on('load',(function() {
  
  $messages.mCustomScrollbar();
  setTimeout(function() {
    fakeMessage();
  }, 1500);
}));


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
  'Hi! Anh/chị muốn xuất báo cáo? Hãy cho em thông tin!',

]
var dataJson;
const validateJSON = (str) => {
  try {
    const json = JSON.parse(str);
    if (Object.prototype.toString.call(json).slice(8, -1) !== 'Object') {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
}


async function playSound(url) {
  setTimeout(function () {
    var audio = document.createElement('audio');
    audio.autoplay = true;
    audio.innerHTML = '<source id="wr" src="' + url + '" type="video/mp4">';
    audio.controls = true;
    audio.style.display = "none";
    audio.onended = function () {
      audio.remove() //Remove when played.
    };
    document.body.appendChild(audio);
  },500);

}
async function voice_reponse(text) {
  $.ajax({
    type: "POST",
    url: "https://api.zalo.ai/v1/tts/synthesize",
    headers: {
		//PGKc4kp90AGkb5ggt0x4wv6eQyjoylA6
      apikey: 'kC9XnHaS3zw2Do2VXBBPssXrLXEdnzAA',
    },
    data: { input: text },
  })
    .done(function (datx) {
      // console.log(datx.data.url);
      var linkd = datx.data.url;
      playSound(linkd);
    });


}
function fakeMessage() {
  var content_reponse_GUI;
  if ($('.message-input').val() != '') {
    return false;
  }
  if(i == 0){
  $('<div class="message loading new"><figure class="avatar"><img src="/static/assets/img/images.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();
  setTimeout(function() {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="/static/assets/img/images.png" /></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    voice_reponse(Fake[i]);
    setDate();
    updateScrollbar();
    i++;
  }, 3000);
  }else{
    $('<div class="message loading new"><figure class="avatar"><img src="/static/assets/img/images.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
    updateScrollbar();
    $.post("http://10.32.11.4:5005/webhooks/rest/webhook", JSON.stringify( { "message": note} )).done(function(data){
      if(data[0]['custom']) {
        TraCuu(data[0]['custom']);
        console.log(data[0]['custom']);
        content_reponse_GUI = "Vui lòng đợi kết quả hiển thị!";
      }
      else{  
        $.each (data, function (key, item){
            var content_request=  item['text'];
            content_reponse_GUI =  content_request;

          }); 
      }
        
    });
    setTimeout(function() {
      $('.message.loading').remove();
      $('<div class="message new"><figure class="avatar"><img src="/static/assets/img/images.png" /></figure>' + content_reponse_GUI + '</div>').appendTo($('.mCSB_container')).addClass('new');
      voice_reponse(content_reponse_GUI);
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
function clickFunction(id) {
    document.getElementById(id).click();
  }

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
        clickFunction('sendt');
      
        
    };

    recognition.onerror = function(event) {
        message.textContent = 'Error occurred in recognition: ' + event.error;
    }

    document.querySelector('#btnTalk').addEventListener('click', function(){
        recognition.start();
        
    });
}
