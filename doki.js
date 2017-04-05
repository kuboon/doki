+function(){
  // This script is released to the public domain and may be used, modified and
  // distributed without restrictions. Attribution not necessary but appreciated.
  // Source: https://weeknumber.net/how-to/javascript

  // modified to UTC
  // Returns the ISO week of the date.
  Date.prototype.getUTCWeek = function() {
    var date = new Date(this.getTime());
    date.setUTCHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setUTCDate(date.getUTCDate() + 3 - (date.getUTCDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(Date.UTC(date.getFullYear(), 0, 4));
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getUTCDay() + 6) % 7) / 7);
  }
}

+function(){
  var getDoki = function(date){
    return date.getUTCHours()*10 + Math.floor(date.getUTCMinutes()/6);
  }
  var getDokiMinutes = function(date){
    return date.getUTCMinutes() % 6;
  }
  var getDokiDay = function(date){
    return ['D','M','T','W','T','F','S'][date.getUTCDay()]
  }

  Date.prototype.toDoki = function() {
    var day = getDokiDay(this),
      doki = ('00' + getDoki(this)).substr(-3,3),
      min = getDokiMinutes(this),
      ret = day + doki;
    if(min != 0){ ret += ':' + min}
    return ret;
  }

  function update(){
    var t = new Date(),
    month = t.getUTCMonth() + 1,
    date = t.getUTCDate(),
    date_elem = document.getElementById('date'),
    doki_elem = document.getElementById('doki');

    date_elem.innerHTML = month + '/' + date;
    doki_elem.innerHTML = t.toDoki();
  }

  update();
  setInterval(update, 1000);
}()
