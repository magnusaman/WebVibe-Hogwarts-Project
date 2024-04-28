document.addEventListener('mousemove', function(e) {
    var cursor = document.querySelector('.cursor');
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
  });
function init() {
  document.onmousemove = mousemove;
}

function mousemove(event) {
  var mouse_x = event.clientX;
  var mouse_y = event.clientY;

  var fl = document.getElementById('flashlight');
  fl.style.transform = 'translate(calc(' + mouse_x + 'px - 50vw), ' + 'calc(' + mouse_y + 'px - 50vh))';
}

init();

var image = document.getElementById('cursor');

document.addEventListener('mousemove', function (event) {
  image.style.left = event.pageX + 'px';
  image.style.top = event.pageY + 'px';
});

$(document).ready(function () {
  var canvas = $('#canvas')[0];
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';


    var init = [];
    var maxParts = 1000;
    for (var a = 0; a < maxParts; a++) {
      init.push({
        x: Math.random() * w,
        y: Math.random() * h,
        l: Math.random() * 1,
        xs: -4 + Math.random() * 10 + 2,
        ys: Math.random() * 10 + 10
      })
    }

    var particles = [];
    for (var b = 0; b < maxParts; b++) {
      particles[b] = init[b];
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var c = 0; c < particles.length; c++) {
        var p = particles[c];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
        ctx.stroke();
      }
      move();
    }

    function move() {
      for (var b = 0; b < particles.length; b++) {
        var p = particles[b];
        p.x += p.xs;
        p.y += p.ys;
        if (p.x > w || p.y > h) {
          p.x = Math.random() * w;
          p.y = -20;
        }
      }
    }

    setInterval(draw, 30);

  }
});
window.onload = function () {
  document.querySelector("#pre-loader").style.display = "none";
}
        function updateClock() {
            console.log("Updating clock...");
            var now = new Date();
            var dname = now.getDay(),
                mo = now.getMonth(),
                dnum = now.getDate(),
                yr = now.getFullYear();
        
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var ids = ["dayname", "mon", "daynum", "Year"];
            var values = [week[dname], months[mo], dnum, yr];
        
            for (var i = 0; i < ids.length; i++) {
                document.getElementById(ids[i]).firstChild.nodeValue = values[i];
            }
        }
        
    
        function initClock() {
            console.log("Initializing clock...");
            updateClock();
            setInterval(updateClock, 1000); // Update every 1000 milliseconds (1 second)
        }
        
    
        window.onload = initClock; 
  