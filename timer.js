//timer = (function(){
  var activities = ['Run', 'Walk'];

  var activity = 0;
  var remaining = 0;

  var timer_elt = document.getElementById('countdown')
  var activity_elt = document.getElementById('activity')

  var a_chime = document.getElementById('chime');

  var inputs = [document.getElementById('run'),
                document.getElementById('walk')];

  var interval;

  var tick = function(){
    remaining = remaining - 1
    if (remaining == 0){
      swapActivity()
      alarm()
    }
    update_display()
  }

  var update_display = function(){
    activity_elt.textContent = activities[activity];
    timer_elt.textContent =' ' + remaining +' ';
  }
  var swapActivity=function(){
    activity = !activity +0;
    remaining = parseInt(inputs[activity].value);
  }

  var alarm = function(){
    a_chime.play();
  }

  var init = function(e){
    remaining = parseInt(inputs[activity].value);
    update_display();
    alarm();
    interval = setInterval(tick, 1000);
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  var stop = function(e){
    clearInterval(interval);
    interval = 0;
    activity = 0;
    e.preventDefault();
    e.stopPropagation();
    return false;
  }


  document.getElementById('start').addEventListener('click', init)
  document.getElementById('stop').addEventListener('click', stop)

