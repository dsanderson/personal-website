<div id="bot-links">
</div>
<script>
  function write_page(text) {
    document.getElementById("bot-links").innerHTML = text;
  }
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            write_page(xmlHttp.responseText);
  }
  xmlHttp.open("GET", "./bot-raw.html", true);
  xmlHttp.send(null);
</script>
