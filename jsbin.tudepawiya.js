function getDoki(date){
  return date.getUTCHours()*10 + Math.floor(date.getUTCMinutes()/6) + date.getUTCMinutes()%6 / 10;
}

function update(){
  t = new Date();
  month = t.getMonth();
  date = t.getDate();

  elem = document.getElementById('date');
  elem.innerHTML= month + '/' + date;

  elem = document.getElementById('doki');
  elem.innerHTML = getDoki(t);
}

update();
setInterval(update, 1000);