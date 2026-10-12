(() => {
  const referenceFloors = { unskilled:484, semi:522, skilled:588, high:651 };
  const fallbackPhoto = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=75";
  const labour = [
    { id:"skilled", en:"Skilled Workers", hi:"कुशल कामगार", min:700, max:1200, level:"skilled", photo:"photo-1581092160562-40aa08e78837" },
    { id:"unskilled", en:"Unskilled Labour", hi:"अकुशल मजदूर", min:500, max:700, level:"unskilled", photo:"photo-1531834685032-c34bf0d84c77" },
    { id:"electrician", en:"Electricians", hi:"इलेक्ट्रीशियन", min:700, max:1200, level:"skilled", photo:"photo-1621905251918-48416bd8575a" },
    { id:"plumber", en:"Plumbers", hi:"प्लंबर", min:650, max:1100, level:"skilled", photo:"photo-1607472586893-edb57bdc0e39" },
    { id:"mason", en:"Masons", hi:"राजमिस्त्री", min:650, max:1000, level:"skilled", photo:"photo-1504307651254-35680f356dfd" },
    { id:"carpenter", en:"Carpenters", hi:"बढ़ई", min:700, max:1200, level:"skilled", photo:"photo-1581092921461-eab62e97a780" },
    { id:"welder", en:"Welders", hi:"वेल्डर", min:800, max:1500, level:"skilled", photo:"photo-1504917595217-d4dc5ebe6122" },
    { id:"fitter", en:"Fitters", hi:"फिटर", min:700, max:1200, level:"skilled", photo:"photo-1581092795360-fd1ca04f0952" },
    { id:"painter", en:"Painters", hi:"पेंटर", min:600, max:1000, level:"skilled", photo:"photo-1581092795360-fd1ca04f0952" },
    { id:"helper", en:"General Helpers", hi:"सामान्य हेल्पर", min:500, max:700, level:"unskilled", photo:"photo-1518770660439-4636190af475" },
    { id:"machine-operator", en:"Machine Operators", hi:"मशीन ऑपरेटर", min:900, max:1800, level:"high", photo:"photo-1581092334651-ddf26d9a09d0" },
    { id:"civil-engineer", en:"Civil Engineers", hi:"सिविल इंजीनियर", min:1500, max:3500, level:"high", photo:"photo-1558618666-fcd25c85cd64" },
    { id:"mechanical-engineer", en:"Mechanical Engineers", hi:"मैकेनिकल इंजीनियर", min:1500, max:3500, level:"high", photo:"photo-1581091226825-a6a2a5aee158" },
    { id:"electrical-engineer", en:"Electrical Engineers", hi:"इलेक्ट्रिकल इंजीनियर", min:1500, max:3500, level:"high", photo:"photo-1621905251918-48416bd8575a" },
    { id:"ac-technician", en:"AC Technicians", hi:"AC टेक्नीशियन", min:800, max:1500, level:"high", photo:"photo-1581092918056-0c4c3acd3789" },
    { id:"solar-technician", en:"Solar Technicians", hi:"सोलर टेक्नीशियन", min:900, max:1800, level:"high", photo:"photo-1509391366360-2e959784a276" },
    { id:"supervisor", en:"Construction Supervisors", hi:"निर्माण सुपरवाइजर", min:1000, max:2500, level:"high", photo:"photo-1531834685032-c34bf0d84c77" },
    { id:"heavy-operator", en:"Heavy Vehicle Operators", hi:"भारी वाहन ऑपरेटर", min:1000, max:2000, level:"high", photo:"photo-1531834685032-c34bf0d84c77" }
  ];
  const words = {
    hi:{ today:"आज", date:"आज की तारीख", district:"जिला", category:"काम", estimate:"अनुमानित दैनिक दर", min:"न्यूनतम", max:"अधिकतम", wageFloor:"दिया गया न्यूनतम वेतन संदर्भ", hours:"मानक घंटे", overtime:"ओवरटाइम / घंटा", tools:"औजार अलग", materials:"सामग्री अलग", availability:"उपलब्धता", unavailable:"जल्द उपलब्ध • लाइव उपलब्धता की पुष्टि आवश्यक", noLocalRate:"सामान्य डेमो रेट • जिले में पुष्टि बाकी", localRate:"स्थानीय एडमिन रेट • पुष्टि आवश्यक", updated:"अंतिम रेट अपडेट", notUpdated:"डेमो बेसलाइन • अपडेट तारीख नहीं", effective:"लागू तारीख", notSet:"सेट नहीं", quote:"काम के अनुसार कोटेशन", categorySelect:"श्रेणी चुनें", invalidFloor:"दर संदर्भ न्यूनतम वेतन से कम नहीं हो सकती।", invalidRange:"दर इस श्रेणी की प्रदर्शित सीमा में होनी चाहिए।", chooseDistrict:"पहले जिला चुनें।", calculation:"कुल मजदूरी: कामगार × दैनिक दर × दिन। ओवरटाइम और अतिरिक्त शुल्क अलग हैं।", estimateOnly:"अनुमानित राशि • अंतिम पुष्टि आवश्यक", toolsIncluded:"एडमिन डेमो शुल्क शामिल", toolsNotRequested:"नहीं चुने", saved:"डेमो अनुरोध इसी ब्राउज़र में सहेजा गया। बुकिंग पक्की नहीं हुई।", savedRate:"इस ब्राउज़र के लिए जिला-वार डेमो दर सहेजी गई।", lowRateAdmin:"न्यूनतम दर ₹{floor} के संदर्भ वेतन से कम नहीं हो सकती।", rangeError:"अधिकतम दर न्यूनतम दर से कम नहीं हो सकती।", adminBaseline:"सामान्य डेमो रेंज", requestCount:"अनुरोध", emptyRequests:"अभी कोई डेमो अनुरोध नहीं।", perWorker:"प्रति कामगार", perDay:"प्रति दिन", materialsExcluded:"निर्माण सामग्री शामिल नहीं", hoursNote:"8 घंटे से अधिक पर ओवरटाइम", otherFee:"एडमिन अतिरिक्त शुल्क", town:"शहर / कस्बा", locality:"इलाका", refCaveat:"संदर्भ उपयोगकर्ता के दिए विवरण पर आधारित है; सरकारी स्रोत से स्वतंत्र पुष्टि नहीं हुई।", rangeLocked:"पहले एडमिन से कोटेशन रेंज सेट कराएं।", workersAvailable:"एडमिन द्वारा दर्ज डेमो उपलब्धता", confirmRequired:"उपलब्धता की पुष्टि आवश्यक", invalidWorkHours:"काम के घंटे 1 से 24 के बीच होने चाहिए."},
    en:{ today:"Today", date:"Today's date", district:"District", category:"Trade", estimate:"Estimated daily rate", min:"Minimum", max:"Maximum", wageFloor:"Supplied minimum-wage reference", hours:"Standard hours", overtime:"Overtime / hour", tools:"Tools excluded", materials:"Materials excluded", availability:"Availability", unavailable:"Coming Soon • live availability must be confirmed", noLocalRate:"General demo range • district rate unconfirmed", localRate:"Local admin demo rate • confirm before work", updated:"Rate last updated", notUpdated:"Demo baseline • no update date", effective:"Effective date", notSet:"Not set", quote:"Quote based on scope", categorySelect:"Choose a trade", invalidFloor:"The daily rate cannot be below the supplied minimum-wage reference.", invalidRange:"Rate must be within the displayed range for this trade.", chooseDistrict:"Choose a district first.", calculation:"Total wages = workers × daily rate × days. Overtime and additional costs are separate.", estimateOnly:"Estimate only • final confirmation required", toolsIncluded:"Admin demo fee included", toolsNotRequested:"Not requested", saved:"Demo request saved in this browser. No booking was confirmed.", savedRate:"District demo rate saved in this browser only.", lowRateAdmin:"Minimum rate cannot be below the supplied ₹{floor} wage reference.", rangeError:"Maximum rate cannot be lower than minimum rate.", adminBaseline:"General demo range", requestCount:"requests", emptyRequests:"No demo requests yet.", perWorker:"per worker", perDay:"per day", materialsExcluded:"Construction materials excluded", hoursNote:"Overtime applies beyond 8 hours", otherFee:"Admin extra fee", town:"Town / city", locality:"Locality", refCaveat:"Reference is from the supplied brief and has not been independently checked against an official notice.", rangeLocked:"Ask the admin to set a quote range first.", workersAvailable:"Demo availability entered by admin", confirmRequired:"Availability must be confirmed", invalidWorkHours:"Work hours must be between 1 and 24."}
  };
  const $ = (selector) => document.querySelector(selector);
  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" }[character]));
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  let language = document.documentElement.lang === "en" ? "en" : "hi";
  let currentEstimate = null;
  const text = (key) => words[language][key] || key;
  const rupees = (value) => `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;
  const today = () => new Date().toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", { day:"numeric", month:"short", year:"numeric" });
  const dateLabel = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", { day:"numeric", month:"short", year:"numeric" }) : text("notSet");
  const photoUrl = (id, width = 720) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
  const districtName = (code) => {
    const entry = window.YantraDistricts?.districts.find(([english]) => english === code);
    return entry ? (language === "hi" ? `${entry[1]} (${entry[0]})` : entry[0]) : code;
  };
  const floorFor = (trade) => referenceFloors[trade.level] || 0;
  const defaultOvertime = (trade) => Math.ceil((((trade.min || floorFor(trade)) + (trade.max || floorFor(trade))) / 2 / 8) * 1.5 / 10) * 10;
  const rateFor = (trade, district) => {
    const override = read("yantra-labour-rates", {})[`${district}:${trade.id}`];
    return override ? { ...trade, ...override, local:true } : { ...trade, overtimeRate:defaultOvertime(trade), toolsFee:0, extraFee:0, availableCount:null, effectiveDate:"", updatedAt:"", local:false };
  };
  const nameOf = (trade) => language === "hi" ? trade.hi : trade.en;

  function fillTradeSelect(select, includePrompt) {
    const previous = select.value;
    select.replaceChildren();
    if (includePrompt) select.add(new Option(text("categorySelect"), ""));
    labour.forEach((trade) => select.add(new Option(nameOf(trade), trade.id)));
    if ([...select.options].some((option) => option.value === previous)) select.value = previous;
    else if (!includePrompt && labour.length) select.value = labour[0].id;
  }

  function renderRateCards() {
    const district = $("#labour-city").value;
    const query = $("#labour-search").value.trim().toLocaleLowerCase();
    const grid = $("#labour-grid");
    const visible = labour.filter((trade) => `${trade.en} ${trade.hi}`.toLocaleLowerCase().includes(query));
    grid.innerHTML = visible.map((trade) => {
      const rate = rateFor(trade, district);
      const floor = floorFor(trade);
      const min = rate.min === null ? null : Math.max(Number(rate.min), floor);
      const status = rate.local ? text("localRate") : text("noLocalRate");
      const range = min === null ? text("quote") : `${rupees(min)}–${rupees(rate.max)} / ${text("perDay")}`;
      const availability = rate.availableCount === null || rate.availableCount === "" ? text("unavailable") : `${text("workersAvailable")}: ${safe(rate.availableCount)} • ${text("confirmRequired")}`;
      const dateInfo = rate.updatedAt ? `${text("updated")}: ${dateLabel(rate.updatedAt)}` : text("notUpdated");
      const locationRate = rate.local ? `${text("effective")}: ${dateLabel(rate.effectiveDate)}` : text("refCaveat");
      return `<article class="labour-card"><div class="labour-photo"><img src="${photoUrl(trade.photo)}" data-fallback="${fallbackPhoto}" alt="${safe(nameOf(trade))} काम करते पेशेवर की फोटो" loading="lazy"><span class="labour-rate-tag">${safe(status)}</span></div><div class="labour-card-content"><div class="labour-card-heading"><p>${safe(text("category"))}</p><h3>${safe(nameOf(trade))}</h3></div><p class="labour-price-label">${safe(text("estimate"))}</p><strong class="labour-rate">${safe(range)}</strong><dl class="labour-facts"><div><dt>${safe(text("date"))}</dt><dd>${safe(today())}</dd></div><div><dt>${safe(text("district"))}</dt><dd>${safe(districtName(district))}</dd></div><div><dt>${safe(text("wageFloor"))}</dt><dd>${rupees(floor)} / ${text("perDay")}</dd></div><div><dt>${safe(text("hours"))}</dt><dd>8 ${language === "hi" ? "घंटे" : "hours"}</dd></div><div><dt>${safe(text("overtime"))}</dt><dd>${rupees(rate.overtimeRate)} / h</dd></div><div><dt>${safe(text("availability"))}</dt><dd>${safe(availability)}</dd></div></dl><p class="labour-exclusions">${safe(text("tools"))} • ${safe(text("materials"))}</p><p class="labour-rate-meta">${safe(dateInfo)}<br>${safe(locationRate)}</p><button class="mini-button labour-book-button" type="button" data-trade="${trade.id}">${language === "hi" ? "एक दिन के लिए बुक करें" : "Book for one day"}</button></div></article>`;
    }).join("");
    $("#labour-empty").classList.toggle("hidden", visible.length > 0);
    if (window.lucide?.createIcons) window.lucide.createIcons();
  }

  function selectedTrade() { return labour.find((trade) => trade.id === $("#booking-category").value); }
  function bookingDistrict() { return $("#booking-city").value; }
  function setRateField() {
    const trade = selectedTrade();
    const input = $("#booking-rate");
    if (!trade) { input.disabled = true; $("#booking-rate-hint").textContent = text("categorySelect"); return; }
    const rate = rateFor(trade, bookingDistrict());
    const floor = floorFor(trade);
    const min = rate.min === null ? null : Math.max(Number(rate.min), floor);
    if (rate.quote && !rate.local) {
      input.disabled = true;
      input.value = "";
      input.removeAttribute("min");
      input.removeAttribute("max");
      $("#booking-rate-hint").textContent = text("rangeLocked");
      input.setCustomValidity(text("rangeLocked"));
      updateEstimate();
      return;
    }
    input.disabled = false;
    input.min = String(min);
    input.max = String(rate.max);
    input.value = String(Math.round(((min + Number(rate.max)) / 2) / 10) * 10);
    input.setCustomValidity("");
    $("#booking-rate-hint").textContent = `${text("min")}: ${rupees(min)} • ${text("max")}: ${rupees(rate.max)} • ${text("wageFloor")}: ${rupees(floor)}`;
    updateEstimate();
  }

  function updateEstimate() {
    const trade = selectedTrade();
    const district = bookingDistrict();
    const rate = trade ? rateFor(trade, district) : null;
    const dailyRateInput = $("#booking-rate");
    if (!trade || !rate || rate.quote && !rate.local) {
      currentEstimate = null;
      $("#estimate-total").textContent = text("quote");
      $("#estimate-status").textContent = text("rangeLocked");
      ["base","overtime","tools","travel","other"].forEach((key) => { $(`#estimate-${key}`).textContent = "—"; });
      $("#estimate-breakdown").textContent = text("chooseDistrict");
      return;
    }
    const dailyRate = Number(dailyRateInput.value) || 0;
    const workers = Math.max(1, Number($("#booking-workers").value) || 1);
    const days = Math.max(1, Number($("#booking-days").value) || 1);
    const hours = Number($("#booking-hours").value) || 0;
    const floor = floorFor(trade);
    const minimum = Math.max(Number(rate.min), floor);
    const maximum = Number(rate.max);
    const invalidRate = dailyRate < floor || dailyRate < minimum || dailyRate > maximum;
    const invalidHours = hours < 1 || hours > 24;
    dailyRateInput.setCustomValidity(invalidRate ? (dailyRate < floor ? text("invalidFloor") : text("invalidRange")) : "");
    $("#booking-hours").setCustomValidity(invalidHours ? text("invalidWorkHours") : "");
    const base = workers * days * dailyRate;
    const overtimeHours = Math.max(0, hours - 8);
    const overtime = overtimeHours * workers * days * Number(rate.overtimeRate || 0);
    const tools = $("#booking-tools-required").checked ? Number(rate.toolsFee || 0) : 0;
    const travel = Number($("#booking-travel").value) || 0;
    const other = Number($("#booking-other-charge").value) + Number(rate.extraFee || 0);
    const total = invalidRate || invalidHours ? 0 : base + overtime + tools + travel + other;
    currentEstimate = invalidRate || invalidHours ? null : { trade, district, dailyRate, workers, days, hours, overtimeHours, base, overtime, tools, travel, other, total };
    $("#estimate-total").textContent = invalidRate || invalidHours ? "—" : rupees(total);
    $("#estimate-status").textContent = invalidRate ? (dailyRate < floor ? text("invalidFloor") : text("invalidRange")) : invalidHours ? text("invalidWorkHours") : text("estimateOnly");
    $("#estimate-base").textContent = rupees(base);
    $("#estimate-overtime").textContent = rupees(overtime);
    $("#estimate-tools").textContent = tools ? rupees(tools) : text("toolsNotRequested");
    $("#estimate-travel").textContent = rupees(travel);
    $("#estimate-other").textContent = rupees(other);
    $("#estimate-breakdown").textContent = `${workers} × ${rupees(dailyRate)} × ${days} = ${rupees(base)} • ${overtimeHours} ${language === "hi" ? "ओवरटाइम घंटे/दिन" : "OT hours/day"} × ${rupees(rate.overtimeRate)} • ${text("materialsExcluded")}`;
  }

  function populateAdmin() {
    const trade = labour.find((entry) => entry.id === $("#admin-category").value) || labour[0];
    const override = read("yantra-labour-rates", {})[`${$("#admin-city").value}:${trade.id}`];
    $("#admin-min").value = override ? override.min : trade.min ?? "";
    $("#admin-max").value = override ? override.max : trade.max ?? "";
    $("#admin-effective").value = override?.effectiveDate || "";
    $("#admin-updated").value = override?.updatedAt || "";
    $("#admin-overtime").value = override?.overtimeRate ?? defaultOvertime(trade);
    $("#admin-available").value = override?.availableCount ?? "";
    $("#admin-tools-fee").value = override?.toolsFee ?? 0;
    $("#admin-extra-fee").value = override?.extraFee ?? 0;
  }

  function renderRequests() {
    const records = read("yantra-labour-bookings", []).slice(-8).reverse();
    $("#labour-requests-list").innerHTML = records.length ? records.map((item) => `<div class="admin-request"><b>${safe(nameOf(labour.find((trade) => trade.id === item.category) || labour[0]))}</b><span>${safe(districtName(item.district))} • ${item.workers} × ${item.days} ${language === "hi" ? "दिन" : "days"} • ${rupees(item.total)}</span><small>${safe(new Date(item.createdAt).toLocaleString(language === "hi" ? "hi-IN" : "en-IN"))}</small></div>`).join("") : `<p class="form-note">${text("emptyRequests")}</p>`;
  }

  function renderAll() {
    fillTradeSelect($("#booking-category"), false);
    fillTradeSelect($("#admin-category"), false);
    if (!$("#labour-city").value) $("#labour-city").value = "Seoni";
    if (!$("#booking-city").value) $("#booking-city").value = "Seoni";
    if (!$("#admin-city").value) $("#admin-city").value = "Seoni";
    renderRateCards();
    setRateField();
    populateAdmin();
    renderRequests();
  }

  $("#labour-city").addEventListener("change", renderRateCards);
  $("#labour-search").addEventListener("input", renderRateCards);
  $("#labour-town").addEventListener("input", renderRateCards);
  ["#booking-city", "#booking-category"].forEach((selector) => $(selector).addEventListener("change", setRateField));
  ["#booking-workers", "#booking-days", "#booking-hours", "#booking-rate", "#booking-travel", "#booking-other-charge", "#booking-tools-required"].forEach((selector) => $(selector).addEventListener("input", updateEstimate));
  $("#booking-tools-required").addEventListener("change", updateEstimate);
  ["#admin-city", "#admin-category"].forEach((selector) => $(selector).addEventListener("change", populateAdmin));
  ["#admin-min", "#admin-max"].forEach((selector) => $(selector).addEventListener("input", () => {
    const trade = labour.find((entry) => entry.id === $("#admin-category").value) || labour[0];
    const floor = floorFor(trade);
    const min = Number($("#admin-min").value);
    const max = Number($("#admin-max").value);
    $("#admin-min").setCustomValidity(min < floor ? text("lowRateAdmin").replace("{floor}", floor) : "");
    $("#admin-max").setCustomValidity(max && min && max < min ? text("rangeError") : "");
  }));

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".labour-book-button");
    if (!button) return;
    $("#booking-category").value = button.dataset.trade;
    $("#booking-city").value = $("#labour-city").value;
    setRateField();
    $("#labour-calculator").scrollIntoView({ behavior:"smooth", block:"start" });
    $("#booking-workers").focus({ preventScroll:true });
  });

  $("#labour-admin-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const district = $("#admin-city").value;
    const category = $("#admin-category").value;
    const trade = labour.find((entry) => entry.id === category);
    const floor = floorFor(trade);
    const min = Number($("#admin-min").value);
    const max = Number($("#admin-max").value);
    if (min < floor) { $("#admin-min").setCustomValidity(text("lowRateAdmin").replace("{floor}", floor)); form.reportValidity(); return; }
    if (max < min) { $("#admin-max").setCustomValidity(text("rangeError")); form.reportValidity(); return; }
    const saved = read("yantra-labour-rates", {});
    saved[`${district}:${category}`] = {
      min, max, effectiveDate:$("#admin-effective").value, updatedAt:$("#admin-updated").value,
      overtimeRate:Number($("#admin-overtime").value), availableCount:$("#admin-available").value === "" ? null : Number($("#admin-available").value),
      toolsFee:Number($("#admin-tools-fee").value) || 0, extraFee:Number($("#admin-extra-fee").value) || 0
    };
    write("yantra-labour-rates", saved);
    $("#admin-success").textContent = text("savedRate");
    $("#admin-success").classList.remove("hidden");
    renderRateCards(); setRateField();
  });

  $("#labour-booking-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    if (!bookingDistrict()) { $("#booking-city").reportValidity(); return; }
    if (!currentEstimate) return;
    const record = {
      district:currentEstimate.district, town:$("#booking-town").value.trim(), locality:$("#booking-locality").value.trim(),
      category:currentEstimate.trade.id, workers:currentEstimate.workers, days:currentEstimate.days, hours:currentEstimate.hours,
      dailyRate:currentEstimate.dailyRate, base:currentEstimate.base, overtime:currentEstimate.overtime,
      tools:currentEstimate.tools, travel:currentEstimate.travel, other:currentEstimate.other, total:currentEstimate.total,
      description:$("#booking-description").value.trim(), createdAt:new Date().toISOString(), demo:true
    };
    const requests = read("yantra-labour-bookings", []);
    requests.push(record);
    write("yantra-labour-bookings", requests);
    $("#booking-success").textContent = `${text("saved")} ${text("estimateOnly")}: ${rupees(record.total)}`;
    $("#booking-success").classList.remove("hidden");
    renderRequests();
  });

  document.addEventListener("yantra-language-change", (event) => { language = event.detail.language; renderAll(); });
  renderAll();
})();
