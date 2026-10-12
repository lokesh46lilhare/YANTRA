(() => {
  const fallback = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=75";
  const services = [
    { id:"cook-one", en:"Cook one meal a day", hi:"एक समय खाना बनाना", price:1500, photo:"photo-1556911220-bff31c812dba" },
    { id:"cook-two", en:"Cook two meals a day", hi:"दो समय खाना बनाना", price:2500, photo:"photo-1556911220-e15b29be8c8f" },
    { id:"cook-three", en:"Cook three meals a day", hi:"तीन समय खाना बनाना", price:3500, photo:"photo-1556911220-bff31c812dba" },
    { id:"cook-dishes", en:"Cooking + dishwashing", hi:"खाना + बर्तन साफ करना", price:3000, photo:"photo-1556911220-e15b29be8c8f" },
    { id:"cook-kitchen", en:"Cooking + kitchen cleaning", hi:"खाना + किचन की सफाई", price:3500, photo:"photo-1581578731548-c64695cc6952" },
    { id:"sweep-mop", en:"Sweeping + mopping only", hi:"केवल झाड़ू-पोछा", price:1000, photo:"photo-1581578731548-c64695cc6952" },
    { id:"dishes-only", en:"Dishwashing only", hi:"केवल बर्तन धोना", price:800, photo:"photo-1556911220-e15b29be8c8f" },
    { id:"laundry", en:"Laundry only", hi:"कपड़े धोना", price:700, photo:"photo-1517677208171-0bc6725a3e60" },
    { id:"laundry-iron", en:"Laundry + ironing", hi:"कपड़े धोना + इस्त्री", price:1200, photo:"photo-1489987707025-afc232f7ea0f" },
    { id:"clean-dishes", en:"Home cleaning + dishes", hi:"घर की सफाई + बर्तन", price:1800, photo:"photo-1581578731548-c64695cc6952" },
    { id:"all-rounder", en:"All-rounder maid", hi:"ऑल-राउंडर मेड", price:3500, photo:"photo-1581578731548-c64695cc6952" },
    { id:"childcare-short", en:"Childcare, 2–4 hours daily", hi:"बच्चों की देखभाल — 2–4 घंटे रोज", price:3000, photo:"photo-1503454537195-1dcabb73ffb9" },
    { id:"babysitter", en:"Babysitter, 6–8 hours daily", hi:"Babysitter — 6–8 घंटे रोज", price:6000, photo:"photo-1503454537195-1dcabb73ffb9" },
    { id:"nanny", en:"Experienced nanny", hi:"अनुभवी Nanny", price:8000, photo:"photo-1503454537195-1dcabb73ffb9" },
    { id:"newborn-care", en:"Newborn baby care", hi:"नवजात शिशु की देखभाल", price:10000, photo:"photo-1519689680058-324335c77eba" },
    { id:"elder-care", en:"Elderly home assistance", hi:"बुजुर्गों की घरेलू सहायता", price:4000, photo:"photo-1576091160399-112ba8d25d1d" },
    { id:"live-in", en:"Full-time live-in maid", hi:"फुल-टाइम लिव-इन मेड", price:8000, startsAt:true, photo:"photo-1581578731548-c64695cc6952" }
  ];
  const words = {
    hi:{ title:"मासिक घरेलू सेवा", monthly:"माह", request:"इस सेवा का अनुरोध करें", selected:"चयनित सेवा", coverage:"जिला-वार स्थानीय प्रदाता सत्यापित नहीं • सेवा जल्द उपलब्ध", noResults:"इस खोज से कोई सेवा नहीं मिली।", priceNote:"दिए गए कम बजट का मासिक रेट", start:"से शुरू", requestDescription:"उपयोगकर्ता द्वारा दिया गया मासिक संकेतात्मक मूल्य: ", perMonth:"प्रति माह", localOnly:"अनुरोध स्थानीय डेमो फॉर्म में भरा गया है; कोई सेवा बुक नहीं हुई।" },
    en:{ title:"Monthly home service", monthly:"month", request:"Request this service", selected:"Selected service", coverage:"No district provider is verified • service coming soon", noResults:"No services match this search.", priceNote:"Supplied low-budget monthly estimate", start:"starting", perMonth:"per month", requestDescription:"User-supplied indicative monthly estimate: ", localOnly:"The local demo request form is prefilled; no service was booked." }
  };
  const $ = (selector) => document.querySelector(selector);
  const safe = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" }[char]));
  const money = (amount) => `₹${amount.toLocaleString("en-IN")}`;
  let language = document.documentElement.lang === "en" ? "en" : "hi";

  function render() {
    const query = $("#monthly-search").value.trim().toLocaleLowerCase();
    const district = $("#monthly-district").value;
    const shown = services.filter((service) => `${service.en} ${service.hi}`.toLocaleLowerCase().includes(query));
    $("#monthly-grid").innerHTML = shown.map((service) => {
      const name = language === "hi" ? service.hi : service.en;
      const price = `${money(service.price)}${service.startsAt ? ` ${words[language].start}` : ""}`;
      const alt = language === "hi" ? `${name} सेवा के लिए घर में काम करते पेशेवर की फोटो` : `Professional providing ${name} home service`;
      return `<article class="monthly-card" data-name="${safe(`${service.en} ${service.hi}`.toLocaleLowerCase())}"><div class="monthly-photo"><img src="https://images.unsplash.com/${service.photo}?auto=format&fit=crop&w=760&q=82" data-fallback="${fallback}" alt="${safe(alt)}" loading="lazy"><span>${safe(words[language].priceNote)}</span></div><div class="monthly-card-body"><h3>${safe(name)}</h3><p class="monthly-price">${price}<small> / ${safe(words[language].perMonth)}</small></p><button class="button button-orange monthly-request" type="button" data-service="${service.id}"><span>${safe(words[language].request)}</span><i data-lucide="arrow-up-right"></i></button></div></article>`;
    }).join("");
    $("#monthly-empty").classList.toggle("hidden", shown.length > 0);
    const coverage = $("#monthly-district-note");
    const districtLabel = district ? (language === "hi" ? window.YantraDistricts.districts.find(([english]) => english === district)?.[1] : district) : "";
    coverage.textContent = district
      ? `${districtLabel}: ${words[language].coverage}`
      : (language === "hi" ? "जिला चुनें • स्थानीय प्रदाता सत्यापित नहीं" : "Choose a district • no local provider verified");
    window.lucide?.createIcons?.();
  }

  $("#monthly-search").addEventListener("input", render);
  $("#monthly-district").addEventListener("change", render);
  document.addEventListener("yantra-language-change", (event) => { language = event.detail.language; render(); });
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".monthly-request");
    if (!button) return;
    const service = services.find((item) => item.id === button.dataset.service);
    if (!service) return;
    const name = language === "hi" ? service.hi : service.en;
    const price = `${money(service.price)}${service.startsAt ? ` ${words[language].start}` : ""} / ${words[language].perMonth}`;
    const work = document.querySelector('#job-form input[name="work"]');
    const description = document.querySelector('#job-form textarea[name="description"]');
    const district = document.querySelector('#job-form select[name="district"]');
    work.value = `${words[language].selected}: ${name}`;
    description.value = `${words[language].requestDescription}${price}. ${words[language].localOnly}`;
    if ($("#monthly-district").value) district.value = $("#monthly-district").value;
    document.querySelector("#post-job").scrollIntoView({ behavior:"smooth", block:"start" });
    work.focus({ preventScroll:true });
  });

  render();
})();
