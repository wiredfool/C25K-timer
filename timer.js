timer = (function(){
  var activities = ['Run', 'Walk'];

  var activity = 0;
  var remaining = 0;
  var paused = 0;

  var timer_elt = document.getElementById('countdown')
  var activity_elt = document.getElementById('activity')

  var a_chime = document.getElementById('chime');

  var inputs = [document.getElementById('s_1'),
                document.getElementById('s_2')];

  var interval;

  var tick = function(){
    remaining = remaining - 1
    if (remaining == 0){
      swap_activity()
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

  var swap_activity=function(){
    activity = (activity + 1) % activities.length;
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
      var current = [];
      try {
        current = JSON.parse(localStorage.getItem('inputs')) || [];
      }catch (e){};
      for (var i=0;i<inputs.length;i++){
        current[i] = inputs[i].value;
      }
      localStorage.setItem('inputs', JSON.stringify(current));
  }

  var load_prefs = function(){
    try {
      current = JSON.parse(localStorage.getItem('inputs'));
      for (var i=0;i<inputs.length && i< current.length;i++){
        inputs[i].value = current[i];
      }
    }
    catch(e){}
  }

  var start = function(e){
    remaining = parseInt(inputs[activity].value);
    window.getSelection().removeAllRanges()
    document.getElementById('d_start').className='hidden';
    document.getElementById('countdown').className='';
    document.getElementById('activity').className='';
    update_display();
    init_alarm();
    save_prefs();
    try{
      clearInterval(interval);
    } catch(e){}

    document.getElementById('pause').disabled = false;
    interval = setInterval(tick, 1000);
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  var restart = function(){
    update_display();
    save_prefs();
    try{
      clearInterval(interval);
    } catch(e){}
    interval = setInterval(tick, 1000);
    paused = 0;

    document.getElementById('pause').innerText = 'Pause';

  }

  var pause = function(){
    clearInterval(interval);
    interval = 0;
    paused = 1;
    document.getElementById('pause').innerText = 'Continue';
  }

  var cb_pause = function(e){
    if (paused) { restart(); }
    else { pause(); }
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  var stop = function(e){
    clearInterval(interval);
    interval = 0;
    activity = 0;
    //document.getElementById('start').disabled = false;
    //document.getElementById('stop').disabled = true;
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  var cb_activity = function(e){
    window.getSelection().removeAllRanges()
    if (paused) {
      swap_activity();
      update_display();
    }
    return false;
  }

  var cb_countdown = function(e){
    window.getSelection().removeAllRanges()
    if (paused) {
      remaining = parseInt(inputs[activity].value);
      save_prefs();
      update_display();
    }
    return false;
  }

  document.getElementById('d_start').addEventListener('click', start)
  document.getElementById('pause').addEventListener('click', cb_pause)
  activity_elt.addEventListener('click', cb_activity);
  timer_elt.addEventListener('click', cb_countdown);

  document.getElementById('pause').disabled = true;


  load_prefs();


})()