timer = (function(){
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
    var remain_string = '' + remaining;
    if (remaining >= 60){
      remain_string = Math.floor(remaining / 60) + ':' +
          ('0'+ remaining % 60).slice(-2)
    }
    timer_elt.textContent =' ' + remain_string +' ';
  }
  var swapActivity=function(){
    activity = !activity +0;
    remaining = parseInt(inputs[activity].value);
  }

  var alarm = function(){
    a_chime.play();
  }

  var init_alarm = function(){
     /* work around safari limitation that the first
       play of a sound has to be from an event handler */
    a_chime.play();
    a_chime.pause();
  }
  var save_prefs = function(){
      localStorage.setItem('run', inputs[0].value);
      localStorage.setItem('walk', inputs[1].value);
  }

  var load_prefs = function(){
    if (localStorage.key('run')){
      inputs[0].value = localStorage.getItem('run');
      inputs[1].value = localStorage.getItem('walk');
    }
  }

  var start = function(e){
    remaining = parseInt(inputs[activity].value);
    update_display();
    init_alarm();
    save_prefs();
    try{
      clearInterval(interval);
    } catch(e){}

    document.getElementById('start').disabled = true;
    document.getElementById('stop').disabled = false;
    interval = setInterval(tick, 1000);
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  var stop = function(e){
    clearInterval(interval);
    interval = 0;
    activity = 0;
    document.getElementById('start').disabled = false;
    document.getElementById('stop').disabled = true;
    e.preventDefault();
    e.stopPropagation();
    return false;
  }


  document.getElementById('start').addEventListener('click', start)
  document.getElementById('stop').addEventListener('click', stop)
  load_prefs();

})()