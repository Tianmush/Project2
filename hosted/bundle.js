(()=>{const e=e=>{document.getElementById("errorMessage").textContent=e,document.getElementById("tweetMessage").classList.remove("hidden")},t=async(t,s)=>{const r=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}),o=await r.json();document.getElementById("tweetMessage").classList.add("hidden"),o.redirect&&(window.location=o.redirect),o.error&&e(o.error)};window.onload=()=>{const s=document.getElementById("signupForm"),r=document.getElementById("loginForm"),o=document.getElementById("tweetForm"),n=document.getElementById("tweetMessage");s&&s.addEventListener("submit",(r=>{r.preventDefault(),n.classList.add("hidden");const o=s.querySelector("#user").value,d=s.querySelector("#pass").value,a=s.querySelector("#pass2").value;return o&&d&&a?d!==a?(e("Passwords do not match!"),!1):(t(s.getAttribute("action"),{username:o,pass:d,pass2:a}),!1):(e("All fields are required!"),!1)})),r&&r.addEventListener("submit",(s=>{s.preventDefault(),n.classList.add("hidden");const o=r.querySelector("#user").value,d=r.querySelector("#pass").value;return o&&d?(t(r.getAttribute("action"),{username:o,pass:d}),!1):(e("Username or password is empty!"),!1)})),o&&o.addEventListener("submit",(s=>{s.preventDefault(),n.classList.add("hidden");const r=o.querySelector("#tweetName").value,d=o.querySelector("#tweetAge").value;return r&&d?(t(o.getAttribute("action"),{name:r,age:d}),!1):(e("All fields are required!"),!1)}))}})();