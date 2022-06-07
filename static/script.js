const shortcuts = {
  "google": "https://www.google.com/",
  "discord": "https://discord.com/"
}

const search = document.getElementById("search");
search.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", {
        scope: _$config.prefix,
        type: "module"
      }).then(() => {
        let location;
        if (shortcuts[search.value]) return window.location.href = `${_$config.prefix}${_$config.codec.encode(shortcuts[search.value])}`;
        if (/^https?:\/\/([^\s]+\.)+[^\s]+$/.test(search.value.trim())) location = search.value;
        else {
          if (/^([^\s]+\.)+[^\s]+$/.test(search.value.trim())) location = "https://" + search.value;
          else location = "https://search.brave.com/search?q=" + encodeURIComponent(search.value);
        }
        window.location.href = `${_$config.prefix}${_$config.codec.encode(location)}`;
      });
    }
  }
});
