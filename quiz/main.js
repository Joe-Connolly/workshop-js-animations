$.getJSON("data.json", function(data) {
  $('#quiz-title').append(`<h1>${data.quiz_title}</h1>`);
  
  data.questions.forEach(question => {
    var current_question = $(`<div class="question"></div>`);
    current_question.append(`<div class="q-header">
                            <h3 class="question_name">${question.question_name}</h3>
                            <img class="question_img_url" src=${question.question_img_url}></div>`)

    var current_choices = $(`<div class="choices"></div>`);
    question.choices.forEach(choice => {
      var current_label = $(`<label></label>`)
      current_label.append(`<input type="radio" name=${question.name} value=${choice.value}>`);
      var curr_choice = $(`<div class="choice"></div>`)
      if (choice.img) {
        curr_choice.append(`<img src=${choice.img} class="img-with-border"/>`);
      }
      if (choice.caption) {
        curr_choice.append(`<p class="caption">${choice.caption}</p>`);
      } else { // don't want the caption bar, so choice div is just full img -- styled differently 
        curr_choice.addClass('no-caption');
      }
      current_label.append(curr_choice);
      current_choices.append(current_label); 
    });
    current_question.append(current_choices);
    $('.questions').append(current_question);
  }); 

  $('#submit').html(data.submit_button);

  $('label').click(function() {
    $(this).addClass('selected');
    $(this).siblings().addClass('unselected');
    $(this).siblings().removeClass('selected');
    $(this).removeClass('unselected');
    //tutorial
    $(this).velocity({
      scale: 1.2
    }, 200);
    $(this).siblings().velocity({
      scale: 0.8
    }, 200);
  });
  //tutorial
  $('.choice').click(function() {
    $(this).velocity({  rotateZ: "+=60" }, { duration: 100});
    $(this).velocity({  rotateZ: "-=120" }, { duration: 100});
    $(this).velocity({  rotateZ: "+=60" }, { duration: 100});
  });
});

var winner = ""; // need this to be global 

//tutorial
$("#quiz-title").velocity({ 
  scale: 1.5
}, 500);
$("#quiz-title").velocity({ 
  scale: 1.0
}, 500);

$('#submit').on('click', function(e) {
    var choices = $("input[type='radio']:checked").map(function(i, radio) {
      return $(radio).val();
    }).toArray();

    //tutorial
    $(this).velocity({
      translateY: "-1.5rem",
      rotateZ: "-10deg"
    }, 100, "easeOut").velocity({
      rotateZ: "8deg",
    }, 150).velocity({
      translateY: "0",
      rotateZ: "0"
    }, 600, "easeOutBounce");
    
    $("+ .shadow", this).velocity({
      scale: "1.3",
      opacity: "1"
    }, 150).velocity("reverse", 600, "easeOutBounce");
    
    // used this for help on writing the function below to find the most freq. word 
    //appendto.com/2016/10/finding-the-most-frequent-string-in-a-javascript-array/
    var frequencies = {}; 
    for (i = 0; i < choices.length; i++) {
        el = choices[i];
        if (!frequencies[el]) {
            frequencies[el] = 1; 
        } else {
            frequencies[el]++;
        }
    };

    max = 0;
    Object.keys(frequencies).forEach(function(key)  {
        if (frequencies[key] > max) {
            max = frequencies[key];
            winner = key; 
        }
    })

    $.getJSON("data.json", function(data) {
      var current_outcome;
      if (choices.length < data.number_of_questions) {
        current_outcome = $(`<p id="error">${data.error}</p>`);
      } else {
        current_outcome = $(`<div class="outcome"><div class="outcome-text"><p id="congrats">${data.congrats}</p>
                              <p id="whoami">${winner}</p>
                              <p id="whoami-description">${data.outcomes[winner].text}</p></div>
                              <img class="outcome-img"src=${data.outcomes[winner].img}></div>`)
      }
      $('.current-outcome').html(current_outcome);
    }); 
});

// all from https://www.w3schools.com/howto/howto_css_modals.asp
// this makes a modal pop up after submission s
var result = document.getElementById('myresult');
var btn = document.getElementById('submit');
var span = document.getElementsByClassName("close")[0];

// some of the modal
btn.onclick = function() {
  result.style.display = "block";
  var buttonId = $(this).attr('id');
  $('#result-content').removeAttr('class').addClass(buttonId);
  $('body').addClass('modal-active');
}
span.onclick = function() {
  $(this).addClass('out');
  $('body').removeClass('modal-active');
  result.style.display = "none";
}
window.onclick = function(event) {
  $(this).addClass('out');
  $('body').removeClass('modal-active');
  if (event.target == result) {
    result.style.display = "none";
  }
}