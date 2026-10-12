(() => {
  let activeLanguage = "hi";
  const districts = [
    ["Agar Malwa", "आगर मालवा"], ["Alirajpur", "अलीराजपुर"], ["Anuppur", "अनूपपुर"],
    ["Ashoknagar", "अशोकनगर"], ["Balaghat", "बालाघाट"], ["Barwani", "बड़वानी"],
    ["Betul", "बैतूल"], ["Bhind", "भिंड"], ["Bhopal", "भोपाल"], ["Burhanpur", "बुरहानपुर"],
    ["Chhatarpur", "छतरपुर"], ["Chhindwara", "छिंदवाड़ा"], ["Damoh", "दमोह"],
    ["Datia", "दतिया"], ["Dewas", "देवास"], ["Dhar", "धार"], ["Dindori", "डिंडोरी"],
    ["Guna", "गुना"], ["Gwalior", "ग्वालियर"], ["Harda", "हरदा"], ["Indore", "इंदौर"],
    ["Jabalpur", "जबलपुर"], ["Jhabua", "झाबुआ"], ["Katni", "कटनी"], ["Khandwa", "खंडवा"],
    ["Khargone", "खरगोन"], ["Maihar", "मैहर"], ["Mandla", "मंडला"], ["Mauganj", "मऊगंज"],
    ["Mandsaur", "मंदसौर"], ["Morena", "मुरैना"], ["Narmadapuram", "नर्मदापुरम"],
    ["Narsinghpur", "नरसिंहपुर"], ["Neemuch", "नीमच"], ["Niwari", "निवाड़ी"],
    ["Pandhurna", "पांढुर्णा"], ["Panna", "पन्ना"], ["Raisen", "रायसेन"], ["Rajgarh", "राजगढ़"],
    ["Ratlam", "रतलाम"], ["Rewa", "रीवा"], ["Sagar", "सागर"], ["Satna", "सतना"],
    ["Sehore", "सीहोर"], ["Seoni", "सिवनी"], ["Shahdol", "शहडोल"], ["Shajapur", "शाजापुर"],
    ["Sheopur", "श्योपुर"], ["Shivpuri", "शिवपुरी"], ["Sidhi", "सीधी"], ["Singrauli", "सिंगरौली"],
    ["Tikamgarh", "टीकमगढ़"], ["Ujjain", "उज्जैन"], ["Umaria", "उमरिया"], ["Vidisha", "विदिशा"]
  ];

  function apply(language) {
    activeLanguage = language;
    document.querySelectorAll("select[data-mp-district]").forEach((select) => {
      const previous = select.value;
      const includeAll = select.dataset.includeAll === "true";
      const prompt = language === "hi"
        ? (includeAll ? "सभी जिले" : "जिला चुनें")
        : (includeAll ? "All districts" : "Choose a district");
      select.replaceChildren(new Option(prompt, ""));
      districts.forEach(([english, hindi]) => {
        select.add(new Option(language === "hi" ? `${hindi} (${english})` : english, english));
      });
      if ([...select.options].some((option) => option.value === previous)) select.value = previous;
      updateCoverage(select);
    });
  }

  function updateCoverage(select) {
    const district = select.value;
    if (!district) return;
    const entry = districts.find(([english]) => english === district);
    const name = entry ? (activeLanguage === "hi" ? `${entry[1]} (${entry[0]})` : entry[0]) : district;
    const label = activeLanguage === "hi"
      ? `${name}: सत्यापित स्थानीय लिस्टिंग जल्द उपलब्ध • अभी केवल डेमो कैटेगरी`
      : `${name}: verified local listings coming soon • demo categories only`;
    const target = {
      "global-location":"hero-note",
      "worker-city":"worker-district-note",
      "product-district":"product-district-note",
      "machinery-district":"machinery-district-note"
    }[select.id];
    if (target && document.getElementById(target)) document.getElementById(target).textContent = label;
  }

  document.addEventListener("change", (event) => {
    if (event.target.matches("select[data-mp-district]")) updateCoverage(event.target);
  });
  window.YantraDistricts = { districts, apply };
})();
