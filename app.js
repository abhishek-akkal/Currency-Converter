const heartBtn = document.querySelector(".heart");
const heartIcon = document.getElementById("heartIcon");
const count = document.getElementById("count");
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");
const swapBtn = document.querySelector(".fa-right-left");

let likeCount = 0;

heartBtn.addEventListener("click", () => {
  likeCount++;
  count.textContent = likeCount;

  heartIcon.classList.remove("fa-regular");
  heartIcon.classList.add("fa-solid");
  heartIcon.style.color = "red";

  heartIcon.classList.add("pop");

  setTimeout(() => {
    heartIcon.classList.remove("pop");
  }, 300);

  const floatingHeart = document.createElement("span");
  floatingHeart.textContent = "❤️";

  floatingHeart.style.position = "absolute";
  floatingHeart.style.fontSize = "50px";
  floatingHeart.style.left = Math.random() * 50 + "px";
  floatingHeart.style.top = "0px";
  floatingHeart.style.transition = "all 1.2s ease";

  heartBtn.appendChild(floatingHeart);

  setTimeout(() => {
    floatingHeart.style.top = "-100px";
    floatingHeart.style.opacity = "0";
  }, 50);

  setTimeout(() => {
    floatingHeart.remove();
  }, 2000);
});

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = "selected";
    }

    select.append(option);
  }
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");

  img.src = newSrc;
};

dropdowns.forEach((select) => {
  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
});

const updateExchangeRate = async () => {
  let amount = amountInput.value;

  if (amount === "" || amount <= 0) {
    amount = 1;
    amountInput.value = "1";
  }

  const URL = `https://open.er-api.com/v6/latest/${fromCurr.value}`;

  try {
    msg.innerText = "Fetching rate...";

    let res = await fetch(URL);
    let data = await res.json();

    let rate = data.rates[toCurr.value];
    let finalAmount = amount * rate;

    msg.innerText = `${amount} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (err) {
    msg.innerText = "Error fetching data";
    console.log(err);
  }
};

btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});

swapBtn.addEventListener("click", () => {
  // swap values
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  // update flags
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // update conversion
  updateExchangeRate();
});
